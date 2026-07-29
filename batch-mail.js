/* 雙發付款管理系統 V8.3 DEV Build 002：批次郵寄 */
(() => {
  'use strict';
  const $q = s => document.querySelector(s);
  const escMail = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmtMoney = v => Number(v || 0).toLocaleString('zh-TW');
  const today = () => new Date().toISOString().slice(0, 10);
  const uidMail = () => crypto.randomUUID ? crypto.randomUUID() : `mail-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try { titles.batchMail = '批次郵寄'; } catch (_) {}

  function sayMail(text) {
    try {
      if (settings?.voiceEnabled === false || !('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-TW';
      u.volume = Number(settings?.voiceVolume ?? 0.9);
      u.rate = Number(settings?.voiceRate || 1);
      speechSynthesis.speak(u);
    } catch (_) {}
  }

  function pendingPayments() {
    return (db.payments || []).filter(p => p.method === '郵寄支票' && p.mailStatus !== '已寄出' && p.status !== '作廢');
  }

  function selectedIds() {
    return [...document.querySelectorAll('.mail-payment-check:checked')].map(x => x.value);
  }

  function groupedPending() {
    const groups = new Map();
    pendingPayments().forEach(p => {
      const key = `${p.vendorCode || ''}__${p.vendor || ''}`;
      if (!groups.has(key)) groups.set(key, { vendorCode: p.vendorCode || '', vendor: p.vendor || '', rows: [] });
      groups.get(key).rows.push(p);
    });
    return [...groups.values()].sort((a,b) => `${a.vendorCode}${a.vendor}`.localeCompare(`${b.vendorCode}${b.vendor}`,'zh-Hant',{numeric:true}));
  }

  function updateSummary() {
    const ids = new Set(selectedIds());
    const rows = pendingPayments().filter(p => ids.has(p.id));
    const vendors = new Set(rows.map(p => `${p.vendorCode}|${p.vendor}`)).size;
    const total = rows.reduce((sum,p) => sum + Number(p.amountPaid || p.checkAmount || 0), 0);
    const box = $q('#batchMailSummary');
    if (box) box.innerHTML = `<b>已選 ${vendors} 家廠商、${rows.length} 張支票</b><br>總金額：NT$ ${fmtMoney(total)}`;
  }

  function syncVendorCheckbox(groupKey) {
    const children = [...document.querySelectorAll(`.mail-payment-check[data-group="${CSS.escape(groupKey)}"]`)];
    const head = document.querySelector(`.mail-vendor-check[data-group="${CSS.escape(groupKey)}"]`);
    if (!head) return;
    head.checked = children.length > 0 && children.every(x => x.checked);
    head.indeterminate = children.some(x => x.checked) && !head.checked;
  }

  function renderHistory() {
    const el = $q('#mailBatchHistory');
    if (!el) return;
    db.mailBatches = Array.isArray(db.mailBatches) ? db.mailBatches : [];
    el.innerHTML = db.mailBatches.length ? db.mailBatches.slice(0, 10).map(b => `<div class="batch-history-row"><b>${escMail(b.name || '未命名批次')}｜${escMail(b.mailDate || '')}</b><small>${Number(b.vendorCount||0)} 家廠商・${Number(b.checkCount||0)} 張支票・NT$ ${fmtMoney(b.totalAmount)}</small></div>`).join('') : '<p class="hint">尚無批次寄件紀錄。</p>';
  }

  function renderBatchMail() {
    const dateInput = $q('#batchMailDate');
    if (dateInput && !dateInput.value) dateInput.value = today();
    const list = $q('#batchMailList');
    if (!list) return;
    const groups = groupedPending();
    if (!groups.length) {
      list.innerHTML = '<div class="mail-empty">目前沒有待寄出的郵寄支票。</div>';
      updateSummary(); renderHistory(); return;
    }
    list.innerHTML = groups.map((g, gi) => {
      const key = `g${gi}`;
      const subtotal = g.rows.reduce((s,p)=>s+Number(p.amountPaid||p.checkAmount||0),0);
      return `<div class="mail-vendor-group"><label class="mail-vendor-head"><input type="checkbox" class="mail-vendor-check" data-group="${key}"><span>${escMail(g.vendorCode)} ${escMail(g.vendor)}</span><span class="mail-count">${g.rows.length} 張・NT$ ${fmtMoney(subtotal)}</span></label>${g.rows.map(p=>`<label class="mail-item"><input type="checkbox" class="mail-payment-check" data-group="${key}" value="${escMail(p.id)}"><span class="mail-item-main"><b>${escMail(p.checkNumber || '未填票號')}</b><small>到期日：${escMail(p.checkDueDate || '未填')}｜月份：${escMail(p.month || '')}</small></span><span class="mail-amount">NT$ ${fmtMoney(p.amountPaid || p.checkAmount)}</span></label>`).join('')}</div>`;
    }).join('');

    document.querySelectorAll('.mail-vendor-check').forEach(head => head.onchange = () => {
      document.querySelectorAll(`.mail-payment-check[data-group="${CSS.escape(head.dataset.group)}"]`).forEach(x => x.checked = head.checked);
      updateSummary();
    });
    document.querySelectorAll('.mail-payment-check').forEach(x => x.onchange = () => { syncVendorCheckbox(x.dataset.group); updateSummary(); });
    updateSummary(); renderHistory();
  }

  function confirmBatch() {
    const ids = selectedIds();
    if (!ids.length) return toast('請至少勾選一張待寄支票');
    const mailDate = $q('#batchMailDate')?.value;
    if (!mailDate) return toast('請填寫寄件日期');
    const name = ($q('#mailBatchName')?.value || '').trim() || `${mailDate.replaceAll('-','/')} 寄件批次`;
    if (!confirm(`確定將選取的 ${ids.length} 張支票全部標示為已寄出嗎？`)) return;
    const idSet = new Set(ids);
    const rows = (db.payments || []).filter(p => idSet.has(p.id));
    rows.forEach(p => { p.mailStatus = '已寄出'; p.mailDate = mailDate; p.status = '已寄出'; p.updatedAt = new Date().toISOString(); });
    const batch = {
      id: uidMail(), name, mailDate, createdAt: new Date().toISOString(),
      paymentIds: ids,
      vendorCount: new Set(rows.map(p => `${p.vendorCode}|${p.vendor}`)).size,
      checkCount: rows.length,
      totalAmount: rows.reduce((s,p)=>s+Number(p.amountPaid||p.checkAmount||0),0)
    };
    db.mailBatches = Array.isArray(db.mailBatches) ? db.mailBatches : [];
    db.mailBatches.unshift(batch);
    db.auditLogs = Array.isArray(db.auditLogs) ? db.auditLogs : [];
    db.auditLogs.unshift({id:uidMail(),at:new Date().toISOString(),action:'批次郵寄',userCode:'current',userName:'目前登入者',detail:{batchName:name,checkCount:rows.length,mailDate}});
    save();
    toast(`批次寄件完成，共 ${rows.length} 張支票`);
    sayMail(`批次寄件完成，共 ${rows.length} 張支票。`);
    renderBatchMail();
  }

  function printList() {
    const ids = new Set(selectedIds());
    if (!ids.size) return toast('請先勾選要列印的支票');
    const rows = pendingPayments().filter(p => ids.has(p.id));
    const date = $q('#batchMailDate')?.value || today();
    const name = ($q('#mailBatchName')?.value || '').trim() || '支票郵寄清單';
    const popup = window.open('', '_blank');
    if (!popup) return toast('瀏覽器阻擋列印視窗，請允許彈出視窗');
    popup.document.write(`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><title>${escMail(name)}</title><style>body{font-family:Arial,"Noto Sans TC",sans-serif;padding:28px}h1{font-size:22px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #999;padding:8px;text-align:left}th{background:#eee}.num{text-align:right}</style></head><body><h1>${escMail(name)}</h1><p>寄件日期：${escMail(date)}　共 ${rows.length} 張</p><table><thead><tr><th>廠商</th><th>支票號碼</th><th>到期日</th><th class="num">金額</th></tr></thead><tbody>${rows.map(p=>`<tr><td>${escMail(p.vendorCode)} ${escMail(p.vendor)}</td><td>${escMail(p.checkNumber)}</td><td>${escMail(p.checkDueDate)}</td><td class="num">NT$ ${fmtMoney(p.amountPaid||p.checkAmount)}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print()<\/script></body></html>`);
    popup.document.close();
  }

  function install() {
    const originalShowMail = show;
    show = function(id, push = true) {
      originalShowMail(id, push);
      if (id === 'batchMail') renderBatchMail();
    };
    $q('#selectAllPendingMail').onclick = () => { document.querySelectorAll('.mail-payment-check,.mail-vendor-check').forEach(x => x.checked = true); updateSummary(); };
    $q('#clearBatchMailSelection').onclick = () => { document.querySelectorAll('.mail-payment-check,.mail-vendor-check').forEach(x => {x.checked=false;x.indeterminate=false}); updateSummary(); };
    $q('#confirmBatchMail').onclick = confirmBatch;
    $q('#printBatchMailList').onclick = printList;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
})();
