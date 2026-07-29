/* 雙發付款管理系統 V8.3 DEV Build 010
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
    if (!voiceReady && !force) {
      pendingVoice.push({ text, kind });
      return;
    }
    speakNow(text, kind, force);
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
          <img src="icon-192.png" alt="雙發付款" class="login-logo">
          <h2>雙發付款管理系統</h2>
          <p>V8.3 DEV Build 014・正式測試版</p>
          <label>登入代碼<input id="loginCode" autocomplete="username" value="admin"></label>
          <label>登入密碼<input id="loginPassword" type="password" autocomplete="current-password" inputmode="numeric"></label>
          <label class="remember-row"><input id="rememberLogin" type="checkbox" checked> 記住登入</label>
          <button id="loginSubmit" class="primary full">登入</button>
          <div id="loginMessage" class="login-message"></div>
          <small>初次登入代碼：admin　密碼：1234</small>
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

  function showLogin() {
    q('#loginGate').classList.remove('hidden');
    setTimeout(() => q('#loginPassword').focus(), 100);
  }

  function hideLogin() {
    q('#loginGate').classList.add('hidden');
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
    renderUser();
    resetIdleTimer();
    saveAudit('登入');
    speak(`${user.name}您好，登入成功。`, 'success', true);
    queueStartupAnnouncements();
  }

  function logout(auto = false) {
    if (currentUser) saveAudit(auto ? '閒置自動登出' : '登出');
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

  function correctionCard(correction) {
    return `<div class="correction-row">
      <h4>${esc(correction.serial)}｜${esc(correction.vendorCode)} ${esc(correction.vendor)}</h4>
      <div class="correction-change"><span><small>修改前</small><b>${esc(correction.oldValue)}</b></span><strong>→</strong><span><small>修改後</small><b>${esc(correction.newValue)}</b></span></div>
      <p>項目：${esc(correction.fieldLabel)}<br>原因：${esc(correction.reason)}</p>
      <small>${esc(correction.operator)}｜${new Date(correction.createdAt).toLocaleString('zh-TW')}</small>
      <button class="secondary full" data-revision-payment="${esc(correction.paymentId)}">查看原始付款</button>
    </div>`;
  }

  function renderCorrections() {
    const search = (q('#revisionSearch')?.value || '').trim().toLowerCase();
    const all = Array.isArray(db.correctionLogs) ? db.correctionLogs : [];
    const list = all.filter(x => !search || [x.serial, x.vendorCode, x.vendor, x.fieldLabel, x.reason, x.operator, x.newValue].join(' ').toLowerCase().includes(search));
    q('#revisionCount').textContent = `共 ${all.length} 筆｜目前顯示 ${list.length} 筆`;
    q('#revisionList').innerHTML = list.length ? list.map(correctionCard).join('') : '<div class="correction-empty">目前沒有修改紀錄。</div>';
    qa('[data-revision-payment]').forEach(button => {
      button.onclick = () => {
        const id = button.dataset.revisionPayment;
        history = ['home', 'search', 'detail'];
        openDetail(id);
      };
    });
  }

  function renderDetailCorrections(paymentId) {
    const list = (db.correctionLogs || []).filter(x => x.paymentId === paymentId);
    q('#detailRevisionHistory').innerHTML = `<h3>修改紀錄</h3>${list.length ? list.map(correctionCard).join('') : '<div class="correction-empty">目前沒有修改紀錄，原始資料保持不變。</div>'}`;
    qa('#detailRevisionHistory [data-revision-payment]').forEach(button => button.remove());
  }

  function installEvents() {
    q('#loginSubmit').onclick = login;
    q('#loginPassword').addEventListener('keydown', event => { if (event.key === 'Enter') login(); });
    q('#logoutBtn').onclick = () => logout(false);

    ['voiceEnabled', 'voiceErrors', 'voiceSuccess', 'voiceBackup', 'voiceDue'].forEach(id => q(`#${id}`).addEventListener('change', saveVoiceSettings));
    ['voiceVolume', 'voiceRate'].forEach(id => q(`#${id}`).addEventListener('input', saveVoiceSettings));
    q('#testVoice').onclick = () => {
      voiceReady = true;
      saveVoiceSettings();
      speakNow('資料已備份完成。', 'backup', true);
    };

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
      applyVoiceSettings();
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
