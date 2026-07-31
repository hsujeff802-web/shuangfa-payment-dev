/* 雙發付款管理系統 V8.3 DEV Build 025.7
   登入權限、已付款鎖定、修改紀錄、智慧語音提醒 */
(() => {
  'use strict';

  const AUTH_KEY = 'shuangfa_v83_auth';
  const SESSION_KEY = 'shuangfa_v83_session';
  const DEFAULT_CODE = 'admin';
  const DEFAULT_PASSWORD = '1234';
  const IDLE_MS = 30 * 60 * 1000;

  let currentUser = null;
  let failedAttempts = 0;
  let lockUntil = 0;
  let idleTimer = null;
  let voiceReady = false;
  let pendingVoice = [];
  let audioContext = null;
  let editingPaymentId = '';

  const q = selector => document.querySelector(selector);
  const qa = selector => [...document.querySelectorAll(selector)];
  const now = () => new Date().toISOString();
  const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

  async function hash(text) {
    if (crypto?.subtle) {
      const data = new TextEncoder().encode(text);
      const digest = await crypto.subtle.digest('SHA-256', data);
      return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, '0')).join('');
    }
    return btoa(unescape(encodeURIComponent(text)));
  }

  function readAuth() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); }
    catch { return null; }
  }

  function writeAuth(value) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(value));
  }

  async function ensureAuth() {
    let auth = readAuth();
    if (!auth?.users?.length) {
      auth = {
        version: 1,
        users: [{
          code: DEFAULT_CODE,
          name: '徐鵬雙',
          role: 'admin',
          enabled: true,
          mustChangePassword: true,
          passwordHash: await hash(DEFAULT_PASSWORD),
          createdAt: now()
        }]
      };
      writeAuth(auth);
    }
    return auth;
  }

  function saveAudit(action, detail = {}) {
    db.auditLogs = Array.isArray(db.auditLogs) ? db.auditLogs : [];
    db.auditLogs.unshift({
      id: uid(),
      at: now(),
      action,
      userCode: currentUser?.code || 'system',
      userName: currentUser?.name || '系統',
      detail
    });
    db.auditLogs = db.auditLogs.slice(0, 2000);
    try { save(); } catch (error) { console.warn('操作紀錄儲存失敗', error); }
  }

  function voiceSettings() {
    return {
      enabled: settings.voiceEnabled !== false,
      errors: settings.voiceErrors !== false,
      success: settings.voiceSuccess !== false,
      backup: settings.voiceBackup !== false,
      due: settings.voiceDue !== false,
      volume: Number(settings.voiceVolume ?? 0.9),
      rate: Number(settings.voiceRate || 1)
    };
  }

  function voiceAllowed(kind) {
    const v = voiceSettings();
    if (!v.enabled) return false;
    if (kind === 'error') return v.errors;
    if (kind === 'backup') return v.backup;
    if (kind === 'due') return v.due;
    return v.success;
  }

  function playTone(kind = 'success') {
    if (!voiceAllowed(kind)) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext = audioContext || new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();
      const start = audioContext.currentTime;
      const notes = kind === 'error' ? [330, 240] : kind === 'due' ? [660, 880, 660] : [660, 880];
      notes.forEach((frequency, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = frequency;
        const at = start + index * 0.13;
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.015, voiceSettings().volume * 0.055), at + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.11);
        osc.connect(gain).connect(audioContext.destination);
        osc.start(at);
        osc.stop(at + 0.12);
      });
      if (navigator.vibrate && kind === 'error') navigator.vibrate(90);
    } catch (error) {
      console.warn('提示音播放失敗', error);
    }
  }

  function getChineseVoice() {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    return voices.find(v => /zh[-_]TW/i.test(v.lang)) || voices.find(v => /^zh/i.test(v.lang)) || null;
  }

  function speakNow(text, kind = 'success', force = false) {
    if (!text || (!force && !voiceAllowed(kind))) return false;
    playTone(kind);
    if (!('speechSynthesis' in window)) return false;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = voiceSettings().rate;
      utterance.volume = voiceSettings().volume;
      const voice = getChineseVoice();
      if (voice) utterance.voice = voice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.warn('語音播放失敗', error);
      return false;
    }
  }

  function speak(text, kind = 'success', force = false) {
    if (!force && !voiceAllowed(kind)) return;
    const isWorkCompletion = /完成|已儲存|已備份|已清除|已修改|壓縮完成|還原完成/.test(String(text || ''));
    const play = () => {
      if (!voiceReady && !force) {
        pendingVoice.push({ text, kind });
        return;
      }
      speakNow(text, kind, force);
    };
    // 儲存、備份、完成工作後先停一秒，再播放中文語音。
    if (isWorkCompletion && (kind === 'success' || kind === 'backup')) setTimeout(play, 1000);
    else play();
  }

  function unlockVoice() {
    voiceReady = true;
    const item = pendingVoice.shift();
    if (item) speakNow(item.text, item.kind);
  }

  window.shuangfaSpeak = speak;

  function injectUI() {
    document.body.insertAdjacentHTML('afterbegin', `
      <div id="loginGate" class="login-gate hidden" aria-modal="true" role="dialog">
        <div class="login-panel">
          <div class="login-brand">
            <img src="icon-192.png" alt="系統 Logo" class="login-logo">
            <h2 id="loginSystemName">雙發付款管理系統</h2>
          </div>
          <div class="login-input-row">
            <span class="login-input-icon" aria-hidden="true">👤</span>
            <input id="loginCode" autocomplete="username" autocapitalize="none" placeholder="請輸入登入代碼" aria-label="登入代碼">
          </div>
          <div class="login-input-row">
            <span class="login-input-icon" aria-hidden="true">🔒</span>
            <input id="loginPassword" type="password" autocomplete="current-password" inputmode="numeric" placeholder="請輸入密碼" aria-label="登入密碼">
          </div>
          <label class="remember-row"><input id="rememberLogin" type="checkbox" checked> 記住登入</label>
          <button id="loginSubmit" class="primary full">登入</button>
          <div id="loginMessage" class="login-message"></div>
        </div>
      </div>
      <div id="correctionModal" class="correction-modal hidden" aria-modal="true" role="dialog">
        <div class="correction-panel">
          <h2>新增修改紀錄</h2>
          <div class="lock-notice">🔒 原始付款資料不會被修改，只會永久新增一筆更正紀錄。</div>
          <div id="correctionPaymentSummary" class="mini-summary"></div>
          <label>修改項目<select id="correctionField">
            <option value="amountDue">應付金額</option>
            <option value="amountPaid">實付金額</option>
            <option value="deductionNote">扣款內容</option>
            <option value="checkNumber">支票號碼</option>
            <option value="checkDueDate">支票到期日</option>
            <option value="bank">銀行</option>
            <option value="status">狀態</option>
            <option value="other">其他內容</option>
          </select></label>
          <label>修改後正確內容<input id="correctionNewValue" placeholder="請輸入正確內容"></label>
          <label>修改原因<textarea id="correctionReason" rows="3" placeholder="例如：支票號碼輸入錯誤、銀行換票"></textarea></label>
          <div class="two"><button id="cancelCorrection" class="secondary">取消</button><button id="saveCorrection" class="primary">儲存修改紀錄</button></div>
        </div>
      </div>`);

    q('.topbar>div').insertAdjacentHTML('beforeend', '<small id="loginUserTag" class="login-user-tag hidden"></small>');
    q('.home-grid').insertAdjacentHTML('beforeend', '<button id="homeRevisionCard" class="home-card"><b>修改紀錄</b><span>原始資料鎖定，查看所有更正</span></button>');
    q('#detailImages').insertAdjacentHTML('beforebegin', '<div id="detailRevisionHistory"></div>');
    q('#editPaymentBtn').textContent = '新增修改紀錄';

    q('#settings').insertAdjacentHTML('beforebegin', `
      <section id="revisions" class="page">
        <h2>修改紀錄</h2>
        <div class="card" id="revisionCenterCard">
          <p class="hint">已付款資料不能直接修改。每次更正都會保留修改前、修改後、原因、記錄人及時間。</p>
          <input id="revisionSearch" placeholder="搜尋廠商、序號、修改項目或原因">
          <p id="revisionCount" class="hint"></p>
          <div id="revisionList"></div>
        </div>
      </section>`);

    q('#settings').insertAdjacentHTML('beforeend', `
      <div class="card" id="voiceSettingsCard"><h3>🔊 智慧語音提醒</h3>
        <p class="hint">可用中文語音說出輸入錯誤、付款完成、備份完成及支票到期提醒。iPhone／iPad 第一次播放時請先點一下畫面。</p>
        <label class="toggle-row"><span><b>啟用中文語音</b><small>關閉後不播放語音及提示音</small></span><input id="voiceEnabled" type="checkbox"></label>
        <div class="voice-grid">
          <label class="toggle-row"><span>輸入錯誤</span><input id="voiceErrors" type="checkbox"></label>
          <label class="toggle-row"><span>付款完成</span><input id="voiceSuccess" type="checkbox"></label>
          <label class="toggle-row"><span>備份完成</span><input id="voiceBackup" type="checkbox"></label>
          <label class="toggle-row"><span>支票到期</span><input id="voiceDue" type="checkbox"></label>
        </div>
        <label>語音音量 <b id="voiceVolumeText">90%</b><input id="voiceVolume" type="range" min="0" max="1" step="0.05"></label>
        <label>語音速度 <b id="voiceRateText">正常</b><input id="voiceRate" type="range" min="0.7" max="1.3" step="0.1"></label>
        <button id="testVoice" class="secondary full">測試語音：資料已備份完成</button>
      </div>
      <div class="card" id="loginLogoutSoundCard"><h3>🎵 登入／登出聲音</h3>
        <p class="hint">可自訂登入歡迎詞，也可從手機或電腦選擇 MP3、WAV、M4A 音樂。音樂會存入本機設定並包含在完整備份中。</p>
        <label class="toggle-row"><span><b>啟用登入歡迎聲音</b><small>登入成功後播放</small></span><input id="loginSoundEnabled" type="checkbox"></label>
        <label>登入歡迎詞<input id="loginWelcomeText" maxlength="80" placeholder="歡迎進入{系統名稱}"></label>
        <label>登入播放方式<select id="loginPlayMode"><option value="voice">只播放歡迎詞</option><option value="music">只播放自訂音樂</option><option value="musicVoice">先音樂、再歡迎詞</option><option value="voiceMusic">先歡迎詞、再音樂</option></select></label>
        <label class="secondary full file-label">選擇登入音樂<input id="loginMusicInput" type="file" accept="audio/*,.mp3,.wav,.m4a,.aac"></label>
        <div id="loginMusicName" class="backup-status">尚未選擇登入音樂</div>
        <div class="inline"><button id="testLoginSound" class="secondary">試聽登入聲音</button><button id="removeLoginMusic" class="secondary">移除登入音樂</button></div>
        <hr>
        <label class="toggle-row"><span><b>啟用登出聲音</b><small>完成登出前播放</small></span><input id="logoutSoundEnabled" type="checkbox"></label>
        <label>登出聲音<select id="logoutSoundMode"><option value="windows">Windows 風格提示音</option><option value="windowsxp">Windows XP 關機風格聲音</option><option value="custom">自訂音樂</option><option value="none">無聲</option></select></label>
        <label>登出自訂詞<input id="logoutFarewellText" maxlength="80" placeholder="謝謝使用{系統名稱}，再見"></label>
        <label>登出播放方式<select id="logoutPlayMode"><option value="sound">只播放登出聲音</option><option value="voice">只播放自訂詞</option><option value="soundVoice">先登出聲音、再自訂詞</option><option value="voiceSound">先自訂詞、再登出聲音</option></select></label>
        <label class="secondary full file-label">選擇登出音樂<input id="logoutMusicInput" type="file" accept="audio/*,.mp3,.wav,.m4a,.aac"></label>
        <div id="logoutMusicName" class="backup-status">尚未選擇登出音樂</div>
        <div class="inline"><button id="testLogoutSound" class="secondary">試聽登出聲音</button><button id="removeLogoutMusic" class="secondary">移除登出音樂</button></div>
        <button id="saveLoginLogoutSound" class="primary full">儲存登入／登出設定</button>
      </div>
      <div class="card"><h3>🔐 登入與密碼</h3>
        <p id="currentLoginInfo" class="hint"></p>
        <div id="defaultPasswordNotice" class="lock-notice hidden">目前仍使用初始密碼 1234，建議立即修改。</div>
        <label>目前密碼<input id="oldPassword" type="password"></label>
        <label>新密碼<input id="newPassword" type="password" minlength="4"></label>
        <label>再次輸入新密碼<input id="newPassword2" type="password" minlength="4"></label>
        <button id="changePassword" class="primary full">修改密碼</button>
        <button id="logoutBtn" class="secondary full">登出</button>
      </div>
`);
  }

  function syncLoginBrand() {
    const name = (typeof getSystemName === 'function' ? getSystemName() : (settings?.systemName || '雙發付款管理系統'));
    const title = q('#loginSystemName');
    if (title) title.textContent = name;
    const logo = q('.login-logo');
    if (logo) logo.alt = `${name} Logo`;
  }

  function showLogin() {
    syncLoginBrand();
    document.body.classList.add('login-locked');
    q('#loginGate').classList.remove('hidden');
    setTimeout(() => { const code=q('#loginCode'); const password=q('#loginPassword'); (code && !code.value ? code : password).focus(); }, 100);
  }

  function hideLogin() {
    q('#loginGate').classList.add('hidden');
    document.body.classList.remove('login-locked');
  }

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    if (!currentUser) return;
    idleTimer = setTimeout(() => {
      logout(true);
      originalToast('已閒置 30 分鐘，系統已自動登出');
    }, IDLE_MS);
  }

  function renderUser() {
    const tag = q('#loginUserTag');
    if (!currentUser) {
      tag.classList.add('hidden');
      return;
    }
    tag.textContent = `已登入：${currentUser.name}（${currentUser.role === 'admin' ? '管理員' : '員工'}）`;
    tag.classList.remove('hidden');
    q('#currentLoginInfo').textContent = `目前登入：${currentUser.name}｜代碼 ${currentUser.code}`;
    q('#defaultPasswordNotice').classList.toggle('hidden', !currentUser.mustChangePassword);
  }

  async function login() {
    const currentTime = Date.now();
    if (currentTime < lockUntil) {
      const seconds = Math.ceil((lockUntil - currentTime) / 1000);
      q('#loginMessage').textContent = `登入暫時鎖定，請 ${seconds} 秒後再試`;
      speak('登入暫時鎖定，請稍後再試。', 'error', true);
      return;
    }

    const code = q('#loginCode').value.trim();
    const password = q('#loginPassword').value;
    const auth = await ensureAuth();
    const user = auth.users.find(x => x.enabled !== false && x.code.toLowerCase() === code.toLowerCase());

    if (!user || user.passwordHash !== await hash(password)) {
      failedAttempts += 1;
      if (failedAttempts >= 5) {
        lockUntil = Date.now() + 30 * 1000;
        failedAttempts = 0;
        q('#loginMessage').textContent = '登入錯誤 5 次，已暫時鎖定 30 秒';
      } else {
        q('#loginMessage').textContent = `登入代碼或密碼錯誤（${failedAttempts}/5）`;
      }
      speak('登入代碼或密碼錯誤，請重新確認。', 'error', true);
      return;
    }

    failedAttempts = 0;
    currentUser = {
      code: user.code,
      name: user.name,
      role: user.role,
      mustChangePassword: !!user.mustChangePassword
    };
    const target = q('#rememberLogin').checked ? localStorage : sessionStorage;
    target.setItem(SESSION_KEY, JSON.stringify(currentUser));
    hideLogin();
    history = ['home'];
    if (typeof show === 'function') show('home', false);
    renderUser();
    resetIdleTimer();
    saveAudit('登入');
    playLoginWelcome();
    queueStartupAnnouncements();
  }

  function audioSettings() {
    return {
      loginEnabled: settings.loginSoundEnabled !== false,
      loginText: settings.loginWelcomeText || '歡迎進入{系統名稱}',
      loginMode: settings.loginPlayMode || 'voice',
      loginMusicData: settings.loginMusicData || '',
      loginMusicName: settings.loginMusicName || '',
      logoutEnabled: settings.logoutSoundEnabled !== false,
      logoutMode: settings.logoutSoundMode || 'windows',
      logoutMusicData: settings.logoutMusicData || '',
      logoutMusicName: settings.logoutMusicName || '',
      logoutText: settings.logoutFarewellText || '謝謝使用{系統名稱}，再見',
      logoutPlayMode: settings.logoutPlayMode || 'sound'
    };
  }

  function playAudioData(dataUrl) {
    if (!dataUrl) return Promise.resolve(false);
    return new Promise(resolve => {
      try {
        const audio = new Audio(dataUrl);
        audio.volume = voiceSettings().volume;
        const done = result => { audio.onended = audio.onerror = null; resolve(result); };
        audio.onended = () => done(true);
        audio.onerror = () => done(false);
        const result = audio.play();
        if (result?.catch) result.catch(() => done(false));
      } catch { resolve(false); }
    });
  }

  function speakPromise(text) {
    return new Promise(resolve => {
      if (!text || !('speechSynthesis' in window)) return resolve(false);
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-TW';
        utterance.rate = voiceSettings().rate;
        utterance.volume = voiceSettings().volume;
        const voice = getChineseVoice();
        if (voice) utterance.voice = voice;
        utterance.onend = () => resolve(true);
        utterance.onerror = () => resolve(false);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch { resolve(false); }
    });
  }

  async function playLoginWelcome() {
    const a = audioSettings();
    if (!a.loginEnabled) return;
    const systemName = typeof getSystemName === 'function' ? getSystemName() : '雙發付款管理系統';
    const text = String(a.loginText || '歡迎進入{系統名稱}').replaceAll('{系統名稱}', systemName);
    if (a.loginMode === 'music') return playAudioData(a.loginMusicData);
    if (a.loginMode === 'musicVoice') { await playAudioData(a.loginMusicData); return speakPromise(text); }
    if (a.loginMode === 'voiceMusic') { await speakPromise(text); return playAudioData(a.loginMusicData); }
    return speakPromise(text);
  }

  async function playLogoutBaseSound(a) {
    if (a.logoutMode === 'none') return;
    if (a.logoutMode === 'custom' && a.logoutMusicData) return playAudioData(a.logoutMusicData);
    if (a.logoutMode === 'windowsxp') return playWindowsXPStyleShutdownSound();
    return playWindowsStyleLogoutSound();
  }

  async function playLogoutSound() {
    const a = audioSettings();
    if (!a.logoutEnabled) return;
    const systemName = typeof getSystemName === 'function' ? getSystemName() : '雙發付款管理系統';
    const text = String(a.logoutText || '謝謝使用{系統名稱}，再見').replaceAll('{系統名稱}', systemName);
    if (a.logoutPlayMode === 'voice') return speakPromise(text);
    if (a.logoutPlayMode === 'soundVoice') { await playLogoutBaseSound(a); return speakPromise(text); }
    if (a.logoutPlayMode === 'voiceSound') { await speakPromise(text); return playLogoutBaseSound(a); }
    return playLogoutBaseSound(a);
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      if (file.size > 5 * 1024 * 1024) return reject(new Error('音樂檔請小於 5MB'));
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('讀取音樂檔失敗'));
      reader.readAsDataURL(file);
    });
  }

  function applyAudioSettings() {
    const a = audioSettings();
    q('#loginSoundEnabled').checked = a.loginEnabled;
    q('#loginWelcomeText').value = a.loginText;
    q('#loginPlayMode').value = a.loginMode;
    q('#logoutSoundEnabled').checked = a.logoutEnabled;
    q('#logoutSoundMode').value = a.logoutMode;
    q('#logoutFarewellText').value = a.logoutText;
    q('#logoutPlayMode').value = a.logoutPlayMode;
    q('#loginMusicName').textContent = a.loginMusicName ? `目前登入音樂：${a.loginMusicName}` : '尚未選擇登入音樂';
    q('#logoutMusicName').textContent = a.logoutMusicName ? `目前登出音樂：${a.logoutMusicName}` : '尚未選擇登出音樂';
  }

  function showLogoutChoice() {
    return new Promise(resolve => {
      const old = q('#logoutChoiceOverlay'); if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'logoutChoiceOverlay';
      overlay.className = 'logout-choice-overlay';
      overlay.innerHTML = `<div class="logout-choice-panel"><h3>確定要登出？</h3><p class="hint">請選擇是否先下載完整備份。</p><button data-choice="backup" class="primary full">📦 備份後登出</button><button data-choice="direct" class="secondary full">🚪 不儲存直接登出</button><button data-choice="cancel" class="secondary full">取消</button></div>`;
      document.body.appendChild(overlay);
      overlay.querySelectorAll('[data-choice]').forEach(btn => btn.onclick = () => { const value=btn.dataset.choice; overlay.remove(); resolve(value); });
      overlay.onclick = event => { if (event.target === overlay) { overlay.remove(); resolve('cancel'); } };
    });
  }

  function playWindowsXPStyleShutdownSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return Promise.resolve();
      const context = new AudioContextClass();
      const now = context.currentTime;
      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.14, now + 0.04);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
      master.connect(context.destination);
      const notes = [
        {f:659.25,t:0.00,d:0.55,v:0.75},
        {f:523.25,t:0.18,d:0.70,v:0.68},
        {f:392.00,t:0.42,d:0.85,v:0.60},
        {f:329.63,t:0.72,d:1.10,v:0.52}
      ];
      notes.forEach(note => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = now + note.t;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note.f, start);
        oscillator.frequency.exponentialRampToValueAtTime(note.f * 0.985, start + note.d);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(note.v, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + note.d);
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(start);
        oscillator.stop(start + note.d + 0.05);
      });
      return new Promise(resolve => setTimeout(() => {
        context.close().catch(() => {});
        resolve();
      }, 2250));
    } catch (error) {
      console.warn('Windows XP 關機風格聲音播放失敗', error);
      return Promise.resolve();
    }
  }

  function playWindowsStyleLogoutSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return Promise.resolve();
      const context = new AudioContextClass();
      const now = context.currentTime;
      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.16, now + 0.03);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
      master.connect(context.destination);
      [659.25, 523.25, 392.0].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = now + index * 0.22;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.8, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(start);
        oscillator.stop(start + 0.45);
      });
      return new Promise(resolve => setTimeout(() => {
        context.close().catch(() => {});
        resolve();
      }, 1200));
    } catch (error) {
      console.warn('登出提示音播放失敗', error);
      return Promise.resolve();
    }
  }

  function logout(auto = false, skipAudit = false) {
    if (currentUser && !skipAudit) saveAudit(auto ? '閒置自動登出' : '登出');
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    currentUser = null;
    clearTimeout(idleTimer);
    renderUser();
    q('#loginPassword').value = '';
    showLogin();
  }

  function restoreSession() {
    try {
      currentUser = JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || 'null');
    } catch {
      currentUser = null;
    }
    if (currentUser) {
      hideLogin();
      history = ['home'];
      if (typeof show === 'function') show('home', false);
      renderUser();
      resetIdleTimer();
      queueStartupAnnouncements();
    } else {
      showLogin();
    }
  }

  function updateVoiceLabels() {
    q('#voiceVolumeText').textContent = `${Math.round(Number(q('#voiceVolume').value) * 100)}%`;
    const rate = Number(q('#voiceRate').value);
    q('#voiceRateText').textContent = rate === 1 ? '正常' : rate < 1 ? '較慢' : '較快';
  }

  function applyVoiceSettings() {
    const v = voiceSettings();
    q('#voiceEnabled').checked = v.enabled;
    q('#voiceErrors').checked = v.errors;
    q('#voiceSuccess').checked = v.success;
    q('#voiceBackup').checked = v.backup;
    q('#voiceDue').checked = v.due;
    q('#voiceVolume').value = v.volume;
    q('#voiceRate').value = v.rate;
    updateVoiceLabels();
  }

  function saveVoiceSettings() {
    settings.voiceEnabled = q('#voiceEnabled').checked;
    settings.voiceErrors = q('#voiceErrors').checked;
    settings.voiceSuccess = q('#voiceSuccess').checked;
    settings.voiceBackup = q('#voiceBackup').checked;
    settings.voiceDue = q('#voiceDue').checked;
    settings.voiceVolume = Number(q('#voiceVolume').value);
    settings.voiceRate = Number(q('#voiceRate').value);
    saveSettings();
    updateVoiceLabels();
  }

  function dueSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let overdue = 0;
    let dueToday = 0;
    let dueTomorrow = 0;

    (db.payments || [])
      .filter(p => p.method === '支票' && !['已銷帳', '作廢'].includes(p.status) && p.checkDueDate)
      .forEach(p => {
        const due = new Date(`${p.checkDueDate}T00:00:00`);
        if (due < today) overdue += 1;
        else if (due.getTime() === today.getTime()) dueToday += 1;
        else if (due.getTime() === tomorrow.getTime()) dueTomorrow += 1;
      });

    return { overdue, dueToday, dueTomorrow };
  }

  function queueStartupAnnouncements() {
    if (!currentUser) return;
    const day = new Date().toISOString().slice(0, 10);
    const autoBackupAt = localStorage.getItem('shuangfa_last_auto_backup') || '';

    if (voiceSettings().backup && autoBackupAt.slice(0, 10) === day && localStorage.getItem('shuangfa_voice_backup_day') !== day) {
      speak('今日資料已自動備份完成。', 'backup');
      localStorage.setItem('shuangfa_voice_backup_day', day);
    }

    const due = dueSummary();
    if (voiceSettings().due && (due.overdue || due.dueToday || due.dueTomorrow) && localStorage.getItem('shuangfa_voice_due_day') !== day) {
      const parts = [];
      if (due.overdue) parts.push(`有${due.overdue}張支票已逾期`);
      if (due.dueToday) parts.push(`今天有${due.dueToday}張支票到期`);
      if (due.dueTomorrow) parts.push(`明天有${due.dueTomorrow}張支票到期`);
      speak(`提醒您，${parts.join('，')}。`, 'due');
      localStorage.setItem('shuangfa_voice_due_day', day);
    }
  }

  const fieldLabels = {
    amountDue: '應付金額',
    amountPaid: '實付金額',
    deductionNote: '扣款內容',
    checkNumber: '支票號碼',
    checkDueDate: '支票到期日',
    bank: '銀行',
    status: '狀態',
    other: '其他內容'
  };

  function originalValue(payment, field) {
    if (field === 'amountDue' || field === 'amountPaid') return `$${money(payment[field])}`;
    if (field === 'other') return '其他內容';
    return String(payment[field] ?? '—');
  }

  function openCorrectionModal() {
    const payment = db.payments.find(x => x.id === currentDetailId);
    if (!payment) return toast('找不到付款資料');
    if (currentUser?.role !== 'admin') return toast('只有管理員可以建立修改紀錄');

    editingPaymentId = payment.id;
    q('#correctionPaymentSummary').innerHTML = `<b>${esc(payment.serial)}</b><br>${esc(payment.vendorCode)} ${esc(payment.vendor)}<br>原始付款憑證：${esc(voucher(payment))}`;
    q('#correctionField').value = 'amountDue';
    q('#correctionNewValue').value = '';
    q('#correctionNewValue').placeholder = `原始內容：${originalValue(payment, 'amountDue')}`;
    q('#correctionReason').value = '';
    q('#correctionModal').classList.remove('hidden');
  }

  function closeCorrectionModal() {
    q('#correctionModal').classList.add('hidden');
    editingPaymentId = '';
  }

  function saveCorrection() {
    const payment = db.payments.find(x => x.id === editingPaymentId);
    if (!payment) return toast('找不到付款資料');

    const field = q('#correctionField').value;
    const newValue = q('#correctionNewValue').value.trim();
    const reason = q('#correctionReason').value.trim();
    if (!newValue) return toast('請輸入修改後的正確內容');
    if (!reason) return toast('請填寫修改原因');

    const correction = {
      id: uid(),
      paymentId: payment.id,
      serial: payment.serial,
      vendorCode: payment.vendorCode,
      vendor: payment.vendor,
      field,
      fieldLabel: fieldLabels[field] || field,
      oldValue: originalValue(payment, field),
      newValue,
      reason,
      operatorCode: currentUser.code,
      operator: currentUser.name,
      createdAt: now()
    };

    db.correctionLogs = Array.isArray(db.correctionLogs) ? db.correctionLogs : [];
    db.correctionLogs.unshift(correction);
    saveAudit('新增修改紀錄', correction);
    closeCorrectionModal();
    renderCorrections();
    renderDetailCorrections(payment.id);
    originalToast('修改紀錄已儲存，原始付款資料沒有變動');
    speak('修改紀錄已儲存，原始付款資料沒有變動。', 'success');
  }

  function correctionCard(correction, allowDelete = true) {
    return `<div class="correction-row">
      <h4>${esc(correction.serial)}｜${esc(correction.vendorCode)} ${esc(correction.vendor)}</h4>
      <div class="correction-change"><span><small>修改前</small><b>${esc(correction.oldValue)}</b></span><strong>→</strong><span><small>修改後</small><b>${esc(correction.newValue)}</b></span></div>
      <p>項目：${esc(correction.fieldLabel)}<br>原因：${esc(correction.reason)}</p>
      <small>${esc(correction.operator)}｜${new Date(correction.createdAt).toLocaleString('zh-TW')}</small>
      <button class="secondary full" data-revision-payment="${esc(correction.paymentId)}">查看原始付款</button>
      ${allowDelete ? `<button class="secondary full revision-delete-btn" data-delete-revision="${esc(correction.id)}">🗑️ 移除此筆修改紀錄</button>` : ''}
    </div>`;
  }

  async function deleteCorrection(id) {
    if (currentUser?.role !== 'admin') return toast('只有管理員可以移除修改紀錄');
    const correction = (db.correctionLogs || []).find(x => x.id === id);
    if (!correction) return toast('找不到這筆修改紀錄');

    const password = prompt('移除修改紀錄需要輸入目前登入密碼：');
    if (password === null) return;
    if (!password) return toast('請輸入密碼');

    const auth = await ensureAuth();
    const user = auth.users.find(x => x.code === currentUser.code && x.enabled !== false);
    if (!user || user.passwordHash !== await hash(password)) {
      speak('密碼錯誤，無法移除修改紀錄。', 'error', true);
      return toast('密碼錯誤，無法移除');
    }

    if (!confirm(`確定要移除此筆修改紀錄嗎？\n\n${correction.serial}｜${correction.vendorCode} ${correction.vendor}\n${correction.fieldLabel}：${correction.oldValue} → ${correction.newValue}`)) return;

    db.correctionLogs = (db.correctionLogs || []).filter(x => x.id !== id);
    saveAudit('移除修改紀錄', {
      correctionId: correction.id,
      serial: correction.serial,
      vendorCode: correction.vendorCode,
      vendor: correction.vendor,
      fieldLabel: correction.fieldLabel
    });
    try { save(); } catch (error) {
      console.error('移除修改紀錄失敗', error);
      return toast('移除失敗，請稍後再試');
    }
    renderCorrections();
    if (currentDetailId) renderDetailCorrections(currentDetailId);
    originalToast('修改紀錄已移除');
    speak('修改紀錄已移除。', 'success');
  }

  function renderCorrections() {
    const search = (q('#revisionSearch')?.value || '').trim().toLowerCase();
    const all = Array.isArray(db.correctionLogs) ? db.correctionLogs : [];
    const list = all.filter(x => !search || [x.serial, x.vendorCode, x.vendor, x.fieldLabel, x.reason, x.operator, x.newValue].join(' ').toLowerCase().includes(search));
    q('#revisionCount').textContent = `共 ${all.length} 筆｜目前顯示 ${list.length} 筆`;
    q('#revisionList').innerHTML = list.length ? list.map(x => correctionCard(x, true)).join('') : '<div class="correction-empty">目前沒有修改紀錄。</div>';
    qa('[data-revision-payment]').forEach(button => {
      button.onclick = () => {
        const id = button.dataset.revisionPayment;
        history = ['home', 'search', 'detail'];
        openDetail(id);
      };
    });
    qa('[data-delete-revision]').forEach(button => {
      button.onclick = () => deleteCorrection(button.dataset.deleteRevision);
    });
  }

  function renderDetailCorrections(paymentId) {
    const list = (db.correctionLogs || []).filter(x => x.paymentId === paymentId);
    q('#detailRevisionHistory').innerHTML = `<h3>修改紀錄</h3>${list.length ? list.map(x => correctionCard(x, false)).join('') : '<div class="correction-empty">目前沒有修改紀錄，原始資料保持不變。</div>'}`;
    qa('#detailRevisionHistory [data-revision-payment]').forEach(button => button.remove());
  }

  function installEvents() {
    q('#loginSubmit').onclick = login;
    q('#loginCode').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); q('#loginPassword').focus(); } });
    q('#loginPassword').addEventListener('keydown', event => { if (event.key === 'Enter') login(); });
    const backupAndLogout = async () => {
      const choice = await showLogoutChoice();
      if (choice === 'cancel') return;
      if (choice === 'direct' && !confirm('確定不備份就直接登出？\n\n這次不會下載備份檔。')) return;
      if (typeof window.shuangfaStopSignatureVoice === 'function') window.shuangfaStopSignatureVoice();
      if (choice === 'backup') {
        try {
          if (currentUser) saveAudit('登出');
          if (typeof downloadBackup === 'function') downloadBackup(false);
          originalToast('完整備份已完成，準備登出');
          await speakPromise('資料已備份完成。');
          await new Promise(resolve => setTimeout(resolve, 180));
        } catch (error) {
          console.error('登出備份失敗', error);
          originalToast('備份失敗，尚未登出');
          speak('備份失敗，系統尚未登出。', 'error', true);
          return;
        }
      } else if (currentUser) {
        saveAudit('不備份直接登出');
      }
      await playLogoutSound();
      logout(false, true);
    };
    q('#logoutBtn').onclick = backupAndLogout;
    const homeLogoutBtn = q('#homeLogoutBtn');
    if (homeLogoutBtn) homeLogoutBtn.onclick = backupAndLogout;

    ['voiceEnabled', 'voiceErrors', 'voiceSuccess', 'voiceBackup', 'voiceDue'].forEach(id => q(`#${id}`).addEventListener('change', saveVoiceSettings));
    ['voiceVolume', 'voiceRate'].forEach(id => q(`#${id}`).addEventListener('input', saveVoiceSettings));
    q('#testVoice').onclick = () => {
      voiceReady = true;
      saveVoiceSettings();
      speakNow('資料已備份完成。', 'backup', true);
    };
    q('#loginMusicInput').onchange = async event => {
      try {
        const file = event.target.files?.[0]; if (!file) return;
        settings.loginMusicData = await fileToDataUrl(file);
        settings.loginMusicName = file.name;
        q('#loginMusicName').textContent = `目前登入音樂：${file.name}`;
        originalToast('登入音樂已載入，請按儲存設定');
      } catch (error) { originalToast(error.message || '登入音樂讀取失敗'); }
    };
    q('#logoutMusicInput').onchange = async event => {
      try {
        const file = event.target.files?.[0]; if (!file) return;
        settings.logoutMusicData = await fileToDataUrl(file);
        settings.logoutMusicName = file.name;
        q('#logoutMusicName').textContent = `目前登出音樂：${file.name}`;
        originalToast('登出音樂已載入，請按儲存設定');
      } catch (error) { originalToast(error.message || '登出音樂讀取失敗'); }
    };
    q('#saveLoginLogoutSound').onclick = () => {
      settings.loginSoundEnabled = q('#loginSoundEnabled').checked;
      settings.loginWelcomeText = q('#loginWelcomeText').value.trim() || '歡迎進入{系統名稱}';
      settings.loginPlayMode = q('#loginPlayMode').value;
      settings.logoutSoundEnabled = q('#logoutSoundEnabled').checked;
      settings.logoutSoundMode = q('#logoutSoundMode').value;
      settings.logoutFarewellText = q('#logoutFarewellText').value.trim() || '謝謝使用{系統名稱}，再見';
      settings.logoutPlayMode = q('#logoutPlayMode').value;
      saveSettings();
      applyAudioSettings();
      originalToast('登入／登出設定已儲存');
      speak('登入與登出設定已儲存完成。', 'success');
    };
    q('#testLoginSound').onclick = () => { voiceReady = true; playLoginWelcome(); };
    q('#testLogoutSound').onclick = () => { voiceReady = true; playLogoutSound(); };
    q('#removeLoginMusic').onclick = () => { settings.loginMusicData=''; settings.loginMusicName=''; saveSettings(); applyAudioSettings(); originalToast('登入音樂已移除'); };
    q('#removeLogoutMusic').onclick = () => { settings.logoutMusicData=''; settings.logoutMusicName=''; saveSettings(); applyAudioSettings(); originalToast('登出音樂已移除'); };

    q('#changePassword').onclick = async () => {
      const oldPassword = q('#oldPassword').value;
      const newPassword = q('#newPassword').value;
      const newPassword2 = q('#newPassword2').value;
      if (newPassword.length < 4) return toast('新密碼至少四碼');
      if (newPassword !== newPassword2) return toast('兩次新密碼不相同');

      const auth = await ensureAuth();
      const user = auth.users.find(x => x.code === currentUser.code);
      if (!user || user.passwordHash !== await hash(oldPassword)) return toast('目前密碼不正確');

      user.passwordHash = await hash(newPassword);
      user.mustChangePassword = false;
      user.passwordChangedAt = now();
      writeAuth(auth);
      currentUser.mustChangePassword = false;
      if (localStorage.getItem(SESSION_KEY)) localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      else sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      q('#oldPassword').value = q('#newPassword').value = q('#newPassword2').value = '';
      renderUser();
      saveAudit('修改密碼');
      originalToast('密碼已修改');
      speak('密碼已修改完成。', 'success');
    };

    const copySystemInfo = q('#copySystemInfo');
    if (copySystemInfo) copySystemInfo.onclick = async () => {
      const text = `${typeof getSystemName === 'function' ? getSystemName() : '雙發付款管理系統'}\nV8.3 DEV Build 025\n資料庫版本：DB 3.0\n最後更新：2026/07/31`;
      try {
        await navigator.clipboard.writeText(text);
        originalToast('系統資訊已複製');
        speak('系統資訊已複製。', 'success');
      } catch {
        prompt('請複製以下系統資訊：', text);
      }
    };

    q('#exportBtn').addEventListener('click', () => {
      setTimeout(() => {
        saveAudit('完整備份');
        speak('資料已備份完成。', 'backup');
      }, 350);
    });


    q('#saveBtn').addEventListener('click', () => {
      const before = db.payments.length;
      let attempts = 0;
      const checkSaved = setInterval(() => {
        attempts += 1;
        if (db.payments.length > before) {
          clearInterval(checkSaved);
          const payment = db.payments[0];
          saveAudit('新增付款', { serial: payment?.serial || '' });
          speak('付款資料已儲存完成。', 'success');
        } else if (attempts >= 20) {
          clearInterval(checkSaved);
        }
      }, 250);
    });

    q('#editPaymentBtn').onclick = openCorrectionModal;
    q('#cancelCorrection').onclick = closeCorrectionModal;
    q('#saveCorrection').onclick = saveCorrection;
    q('#correctionField').onchange = () => {
      const payment = db.payments.find(x => x.id === editingPaymentId);
      if (payment) q('#correctionNewValue').placeholder = `原始內容：${originalValue(payment, q('#correctionField').value)}`;
    };

    q('#homeRevisionCard').onclick = () => {
      show('revisions');
      renderCorrections();
    };
    q('#revisionSearch').oninput = renderCorrections;

    ['pointerdown', 'keydown', 'touchstart'].forEach(eventName => {
      window.addEventListener(eventName, () => {
        unlockVoice();
        resetIdleTimer();
      }, { passive: true });
    });
  }

  const originalToast = toast;
  toast = function(message) {
    originalToast(message);
    if (/完整備份已還原/.test(String(message))) { speak('備份資料已還原完成。', 'backup'); return; }
    if (/請|找不到|不可|錯誤|失敗|不正確|重複|不足|尚未|阻擋|範圍/.test(String(message))) {
      speak(String(message).endsWith('。') ? String(message) : `${message}。`, 'error');
    }
  };

  const originalShow = show;
  show = function(id, push = true) {
    originalShow(id, push);
    if (id === 'settings') {
      syncLoginBrand();
      applyVoiceSettings();
    applyAudioSettings();
      renderUser();
    }
    if (id === 'revisions') renderCorrections();
  };

  const originalOpenDetail = openDetail;
  openDetail = function(id) {
    originalOpenDetail(id);
    renderDetailCorrections(id);
  };

  async function init() {
    injectUI();
    syncLoginBrand();
    settings.voiceEnabled = settings.voiceEnabled !== false;
    settings.voiceErrors = settings.voiceErrors !== false;
    settings.voiceSuccess = settings.voiceSuccess !== false;
    settings.voiceBackup = settings.voiceBackup !== false;
    settings.voiceDue = settings.voiceDue !== false;
    settings.voiceVolume = Number(settings.voiceVolume ?? 0.9);
    settings.voiceRate = Number(settings.voiceRate || 1);
    saveSettings();
    applyVoiceSettings();
    installEvents();
    await ensureAuth();
    restoreSession();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
