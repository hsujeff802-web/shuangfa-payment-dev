/* 雙發付款管理系統 V8.3 DEV Build 001
   登入權限、付款修改稽核、智慧語音提醒 */
(() => {
  'use strict';
  const AUTH_KEY='shuangfa_v83_auth';
  const SESSION_KEY='shuangfa_v83_session';
  const DEFAULT_CODE='admin';
  const DEFAULT_PASSWORD='1234';
  let currentUser=null;
  let voiceReady=false;

  const q=s=>document.querySelector(s);
  const now=()=>new Date().toISOString();
  const h=async text=>{
    if(crypto?.subtle){
      const data=new TextEncoder().encode(text);
      const digest=await crypto.subtle.digest('SHA-256',data);
      return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');
    }
    return btoa(unescape(encodeURIComponent(text)));
  };
  const readAuth=()=>{try{return JSON.parse(localStorage.getItem(AUTH_KEY)||'null')}catch{return null}};
  const writeAuth=x=>localStorage.setItem(AUTH_KEY,JSON.stringify(x));

  async function ensureAuth(){
    let a=readAuth();
    if(!a?.users?.length){
      a={version:1,users:[{code:DEFAULT_CODE,name:'徐鵬雙',role:'admin',enabled:true,passwordHash:await h(DEFAULT_PASSWORD),createdAt:now()}]};
      writeAuth(a);
    }
    return a;
  }
  function audit(action,detail={}){
    db.auditLogs=Array.isArray(db.auditLogs)?db.auditLogs:[];
    db.auditLogs.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),at:now(),action,userCode:currentUser?.code||'system',userName:currentUser?.name||'系統',detail});
    db.auditLogs=db.auditLogs.slice(0,2000);
    save();
  }
  function speak(text,force=false){
    if(!('speechSynthesis' in window))return;
    if(!force && settings.voiceEnabled===false)return;
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);
      u.lang='zh-TW';
      u.rate=Number(settings.voiceRate||0.95);
      u.volume=Number(settings.voiceVolume??1);
      const voices=speechSynthesis.getVoices();
      u.voice=voices.find(v=>/zh-TW/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang))||null;
      speechSynthesis.speak(u);
    }catch(e){console.warn('語音播放失敗',e)}
  }
  window.shuangfaSpeak=speak;

  function injectUI(){
    document.body.insertAdjacentHTML('afterbegin',`
      <div id="loginGate" class="login-gate hidden" aria-modal="true" role="dialog">
        <div class="login-panel">
          <img src="icon-192.png" alt="雙發付款" class="login-logo">
          <h2>雙發付款管理系統</h2>
          <p>V8.3 DEV・5.6 智慧語音版</p>
          <label>登入代碼<input id="loginCode" autocomplete="username" inputmode="text" value="admin"></label>
          <label>登入密碼<input id="loginPassword" type="password" autocomplete="current-password" inputmode="numeric"></label>
          <label class="remember-row"><input id="rememberLogin" type="checkbox" checked> 記住登入</label>
          <button id="loginSubmit" class="primary full">登入</button>
          <div id="loginMessage" class="login-message"></div>
          <small>初次登入代碼：admin　密碼：1234</small>
        </div>
      </div>`);
    q('.topbar>div').insertAdjacentHTML('beforeend','<small id="loginUserTag" class="login-user-tag hidden"></small>');
    q('#settings').insertAdjacentHTML('beforeend',`
      <div class="card"><h3>🔊 智慧語音提醒</h3>
        <label class="toggle-row"><span><b>啟用中文語音</b><small>備份完成、輸入錯誤、付款完成及支票到期會說話提醒</small></span><input id="voiceEnabled" type="checkbox"></label>
        <label>語音音量<input id="voiceVolume" type="range" min="0" max="1" step="0.1"></label>
        <label>語音速度<input id="voiceRate" type="range" min="0.7" max="1.3" step="0.05"></label>
        <button id="testVoice" class="secondary full">測試語音</button>
      </div>
      <div class="card"><h3>🔐 登入與密碼</h3>
        <p id="currentLoginInfo" class="hint"></p>
        <label>目前密碼<input id="oldPassword" type="password"></label>
        <label>新密碼<input id="newPassword" type="password" minlength="4"></label>
        <label>再次輸入新密碼<input id="newPassword2" type="password" minlength="4"></label>
        <button id="changePassword" class="primary full">修改密碼</button>
        <button id="logoutBtn" class="secondary full">登出</button>
      </div>
      <div class="card"><h3>📝 修改紀錄</h3><p class="hint">已付款資料不能直接修改。管理員每次修改都必須填原因，並永久保留修改前後內容。</p><button id="viewAuditLogs" class="secondary full">查看最近修改紀錄</button><div id="auditLogList"></div></div>`);
  }

  function applyVoiceSettings(){
    settings.voiceEnabled=settings.voiceEnabled!==false;
    settings.voiceVolume=Number(settings.voiceVolume??1);
    settings.voiceRate=Number(settings.voiceRate||0.95);
    q('#voiceEnabled').checked=settings.voiceEnabled;
    q('#voiceVolume').value=settings.voiceVolume;
    q('#voiceRate').value=settings.voiceRate;
  }
  function saveVoiceSettings(){
    settings.voiceEnabled=q('#voiceEnabled').checked;
    settings.voiceVolume=Number(q('#voiceVolume').value);
    settings.voiceRate=Number(q('#voiceRate').value);
    saveSettings();
  }
  function renderUser(){
    const tag=q('#loginUserTag');
    if(currentUser){tag.textContent=`已登入：${currentUser.name}（${currentUser.role==='admin'?'管理員':'員工'}）`;tag.classList.remove('hidden');q('#currentLoginInfo').textContent=`目前登入：${currentUser.name}｜代碼 ${currentUser.code}`}
    else tag.classList.add('hidden');
  }
  function showLogin(){q('#loginGate').classList.remove('hidden');setTimeout(()=>q('#loginPassword').focus(),100)}
  function hideLogin(){q('#loginGate').classList.add('hidden')}
  async function login(){
    const code=q('#loginCode').value.trim();
    const password=q('#loginPassword').value;
    const a=await ensureAuth();
    const user=a.users.find(x=>x.enabled!==false&&x.code.toLowerCase()===code.toLowerCase());
    if(!user||user.passwordHash!==await h(password)){
      q('#loginMessage').textContent='登入代碼或密碼錯誤';
      speak('登入代碼或密碼錯誤，請重新確認。');
      return;
    }
    currentUser={code:user.code,name:user.name,role:user.role};
    if(q('#rememberLogin').checked)localStorage.setItem(SESSION_KEY,JSON.stringify(currentUser));else sessionStorage.setItem(SESSION_KEY,JSON.stringify(currentUser));
    hideLogin();renderUser();voiceReady=true;audit('登入');speak(`${user.name}您好，登入成功。`);
    announceDueChecks();
  }
  function logout(){
    audit('登出');localStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(SESSION_KEY);currentUser=null;renderUser();q('#loginPassword').value='';showLogin();
  }
  function restoreSession(){
    try{currentUser=JSON.parse(sessionStorage.getItem(SESSION_KEY)||localStorage.getItem(SESSION_KEY)||'null')}catch{currentUser=null}
    if(currentUser){hideLogin();renderUser();setTimeout(announceDueChecks,700)}else showLogin();
  }

  function announceDueChecks(){
    if(!currentUser||settings.voiceEnabled===false)return;
    const today=new Date();today.setHours(0,0,0,0);
    const due=(db.payments||[]).filter(p=>p.method==='支票'&&!['已銷帳','作廢'].includes(p.status)&&p.checkDueDate).filter(p=>new Date(p.checkDueDate+'T00:00:00')<=today);
    if(due.length)speak(`提醒您，今天有${due.length}張支票到期或已經到期，請查看支票管理。`);
  }

  function renderAudit(){
    const list=(db.auditLogs||[]).slice(0,50);
    q('#auditLogList').innerHTML=list.length?list.map(x=>`<div class="audit-row"><b>${esc(x.action)}</b><span>${esc(x.userName)}｜${new Date(x.at).toLocaleString('zh-TW')}</span><small>${esc(x.detail?.reason||x.detail?.serial||'')}</small></div>`).join(''):'<p class="hint">目前尚無修改紀錄。</p>';
  }

  function installEvents(){
    q('#loginSubmit').onclick=login;
    q('#loginPassword').addEventListener('keydown',e=>{if(e.key==='Enter')login()});
    q('#voiceEnabled').onchange=saveVoiceSettings;q('#voiceVolume').oninput=saveVoiceSettings;q('#voiceRate').oninput=saveVoiceSettings;
    q('#testVoice').onclick=()=>{voiceReady=true;speak('雙發付款管理系統，語音提醒測試正常。',true)};
    q('#logoutBtn').onclick=logout;
    q('#viewAuditLogs').onclick=renderAudit;
    q('#changePassword').onclick=async()=>{
      const old=q('#oldPassword').value,n1=q('#newPassword').value,n2=q('#newPassword2').value;
      if(n1.length<4)return toast('新密碼至少四碼');
      if(n1!==n2)return toast('兩次新密碼不相同');
      const a=await ensureAuth(),u=a.users.find(x=>x.code===currentUser.code);
      if(!u||u.passwordHash!==await h(old))return toast('目前密碼不正確');
      u.passwordHash=await h(n1);u.passwordChangedAt=now();writeAuth(a);q('#oldPassword').value=q('#newPassword').value=q('#newPassword2').value='';audit('修改密碼');toast('密碼已修改');speak('密碼已修改完成。');
    };

    // 備份完成後語音提醒
    q('#exportBtn').addEventListener('click',()=>setTimeout(()=>{audit('完整備份');speak('資料已備份完成。')},350));

    // 付款完成語音
    q('#saveBtn').addEventListener('click',()=>setTimeout(()=>{if(q('#done').classList.contains('active'))speak('付款資料已儲存完成。')},600));

    // 已付款資料鎖定：僅管理員可留痕修改
    q('#editPaymentBtn').onclick=()=>{
      const p=db.payments.find(x=>x.id===currentDetailId);if(!p)return toast('找不到付款資料');
      if(currentUser?.role!=='admin')return toast('只有管理員可以建立修改紀錄');
      const reason=prompt('請輸入修改原因（必填）','');if(reason===null)return;if(!reason.trim())return toast('修改原因不可空白');
      const before=structuredClone(p);
      const due=prompt('應付金額',p.amountDue??'');if(due===null)return;
      const paid=prompt('實付金額',p.amountPaid??'');if(paid===null)return;
      const note=prompt('扣款內容',p.deductionNote??'');if(note===null)return;
      const status=prompt('狀態：待轉帳／已開支票／已銷帳／作廢',p.status??'');if(status===null)return;
      if(!/^\d+(\.\d+)?$/.test(String(due).trim())||!/^\d+(\.\d+)?$/.test(String(paid).trim()))return toast('金額格式不正確');
      p.amountDue=Number(due);p.amountPaid=Number(paid);p.deductionAmount=Math.max(0,p.amountDue-p.amountPaid);p.deductionNote=String(note).trim();
      if(['待轉帳','已開支票','已銷帳','作廢'].includes(String(status).trim()))p.status=String(status).trim();
      p.updatedAt=now();p.revisionHistory=Array.isArray(p.revisionHistory)?p.revisionHistory:[];
      p.revisionHistory.unshift({at:p.updatedAt,user:currentUser,reason:reason.trim(),before,after:structuredClone(p)});
      save();audit('修改付款資料',{serial:p.serial,reason:reason.trim(),before,after:structuredClone(p)});toast('已建立修改紀錄');speak('付款資料已修改，修改紀錄已保存。');openDetail(p.id);runSearch();renderDue();
    };
  }

  // 將錯誤訊息同步用語音說出來
  const oldToast=toast;
  toast=function(message){oldToast(message);if(!voiceReady||settings.voiceEnabled===false)return;if(/錯誤|不可|請輸入|請選擇|找不到|重複|失敗|不正確/.test(message))speak(message)};

  async function init(){
    injectUI();
    settings.voiceEnabled=settings.voiceEnabled!==false;
    settings.voiceVolume=Number(settings.voiceVolume??1);
    settings.voiceRate=Number(settings.voiceRate||0.95);
    saveSettings();applyVoiceSettings();installEvents();await ensureAuth();restoreSession();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
