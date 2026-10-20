const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
const T = Object.fromEntries(TOPICS.map(t => [t.id, t]));
const COLOR = {reg:'#3b5bdb',multi:'#0c8599',logit:'#c2255c',clus:'#5f3dc4',lab:'#e8590c'};
const L = 'ABCD';
QB.forEach((q, i) => q.id = i);

const store = {
  get() { try { return JSON.parse(localStorage.getItem('mlf') || '{}'); } catch { return {}; } },
  set(id, ok) { try { const s = store.get(); s[id] = ok ? 1 : 0; localStorage.setItem('mlf', JSON.stringify(s)); } catch {} }
};
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const byTopic = id => id === 'all' ? QB : id === 'wrong' ? QB.filter(q => store.get()[q.id] === 0) : QB.filter(q => q.t === id);
const theme = id => id && T[id] ? document.documentElement.dataset.t = id : delete document.documentElement.dataset.t;
const sheet = document.createElement('div'); sheet.className = 'sheet'; document.body.append(sheet);
const hideSheet = () => sheet.className = 'sheet';

function route() {
  hideSheet(); $('.submit')?.remove();
  const [, page = '', id = ''] = location.hash.split('/');
  scrollTo(0, 0);
  ({t: lesson, p: practice, x: exam, k: key}[page] || home)(id);
}
addEventListener('hashchange', route);

function home() {
  theme();
  const s = store.get();
  const wrong = QB.filter(q => s[q.id] === 0).length;
  app.innerHTML = `
  <section class="hero"><h1>Machine Learning<br>Final</h1>
  <p>อ่านนิยามทีละบท แล้วฝึกควิซ ${QB.length} ข้อ กดตอบแล้วรู้ทันทีว่าถูกหรือผิด พร้อมเหตุผลของทุกช้อยส์</p>
  <a class="go" href="#/x/all">สอบจำลอง 80 ข้อ</a></section>
  <div class="topics">${TOPICS.map((t, i) => {
    const qs = byTopic(t.id), done = qs.filter(q => q.id in s).length, ok = qs.filter(q => s[q.id] === 1).length;
    return `<div class="tp" style="--c:${COLOR[t.id]}"><div class="num" style="background:${COLOR[t.id]}">${i + 1}</div>
    <h3>${t.name}</h3><div class="sub">${t.th} ออกสอบ ${t.n} ข้อ คลัง ${qs.length} ข้อ</div>
    <div class="meter" title="${ok}/${qs.length}"><i style="width:${ok / qs.length * 100}%"></i></div>
    <div class="acts"><a class="chip" href="#/t/${t.id}">อ่านบทเรียน</a><a class="chip pri" href="#/p/${t.id}">ฝึกทีละข้อ</a>
    <a class="chip" href="#/x/${t.id}">ทำเป็นชุด</a><a class="chip" href="#/k/${t.id}">ดูเฉลย</a></div></div>`;
  }).join('')}</div>
  ${wrong ? `<a class="next-lesson" style="background:var(--bad)" href="#/p/wrong">ฝึกข้อที่เคยตอบผิด (${wrong})</a>` : ''}`;
}

function lesson(id) {
  const t = T[id]; if (!t) return home();
  theme(id);
  const i = TOPICS.indexOf(t), nx = TOPICS[i + 1];
  app.innerHTML = `<div class="lhead"><h1>${t.name}</h1><p>${t.th}</p></div>
  ${t.cards.map(c => `<article class="card"><h2>${c.h}</h2><p class="key">${c.k}</p>${c.b}${c.f ? `<div class="fig" data-f="${c.f}"></div>` : ''}</article>`).join('')}
  <a class="next-lesson" href="#/p/${id}">ฝึกควิซบทนี้ ${byTopic(id).length} ข้อ</a>
  ${nx ? `<a class="chip" style="display:block;text-align:center" href="#/t/${nx.id}">บทถัดไป: ${nx.name}</a>` : ''}`;
  app.querySelectorAll('.fig').forEach(el => FIGS[el.dataset.f]?.(el));
}

function optHTML(q, order, cls = '') {
  return order.map((oi, k) => `<button class="opt ${cls}" data-o="${oi}"><span class="L">${L[k]}</span><span class="t">${q.o[oi]}</span><span class="why">${q.e[oi]}</span></button>`).join('');
}
function mark(box, q, picked) {
  box.classList.add('done');
  box.querySelectorAll('.opt').forEach(b => {
    const o = +b.dataset.o;
    if (o === q.a) b.classList.add('ok');
    else if (o === picked) b.classList.add('bad');
  });
}

function practice(id) {
  const qs = shuffle(byTopic(id));
  theme(T[id] ? id : null);
  if (!qs.length) { app.innerHTML = `<p class="empty">ยังไม่มีข้อที่ตอบผิด</p>`; return; }
  let i = 0, right = 0;
  const show = () => {
    hideSheet();
    if (i >= qs.length) return result();
    const q = qs[i], order = shuffle([0, 1, 2, 3]);
    theme(q.t);
    app.innerHTML = `<div class="qtop"><a href="#/" aria-label="ปิด" style="font-size:22px">✕</a><div class="prog"><i style="width:${i / qs.length * 100}%"></i></div><span class="qcount">${i + 1}/${qs.length}</span></div>
    ${T[id] ? '' : `<span class="qtag">${T[q.t].name}</span>`}
    <p class="q">${q.q}</p><div class="opts">${optHTML(q, order)}</div>`;
    const box = $('.opts');
    box.onclick = e => {
      const b = e.target.closest('.opt'); if (!b || box.classList.contains('done')) return;
      const o = +b.dataset.o, ok = o === q.a;
      mark(box, q, o); store.set(q.id, ok); if (ok) right++;
      b.classList.add(ok ? 'pop' : 'shake');
      if (!ok) box.querySelector('.ok').classList.add('pop');
      sheet.innerHTML = `<div class="in"><span class="msg">${ok ? 'ถูกต้อง' : 'ยังไม่ใช่'}</span><button class="big">${i + 1 < qs.length ? 'ข้อต่อไป' : 'ดูผล'}</button></div>`;
      sheet.className = 'sheet on ' + (ok ? 'g' : 'r');
      sheet.querySelector('.big').onclick = () => { i++; show(); scrollTo(0, 0); };
    };
  };
  const result = () => {
    theme(T[id] ? id : null);
    app.innerHTML = `<div class="score"><div class="n">${right}/${qs.length}</div><p>ตอบถูก ${Math.round(right / qs.length * 100)}%</p></div>
    <a class="next-lesson" href="#/p/${id}">ฝึกอีกรอบ (สลับข้อ)</a><a class="chip" style="display:block;text-align:center" href="#/">กลับหน้าแรก</a>`;
  };
  show();
}

function pickMock() {
  return TOPICS.flatMap(t => shuffle(byTopic(t.id)).slice(0, t.n));
}

function exam(id) {
  const qs = id === 'all' ? pickMock() : shuffle(byTopic(id));
  if (!qs.length) return home();
  theme(T[id] ? id : null);
  const orders = qs.map(() => shuffle([0, 1, 2, 3])), ans = {};
  app.innerHTML = `<div class="lhead"><h1>${id === 'all' ? 'สอบจำลอง' : T[id].name}</h1><p>${qs.length} ข้อ เลือกให้ครบแล้วกดส่ง จะเห็นเฉลยและเหตุผลทุกข้อ</p></div>
  ${qs.map((q, k) => `<div class="ex-q" data-k="${k}"><span class="qtag">${k + 1}. ${T[q.t].name}</span><p class="q">${q.q}</p><div class="opts">${optHTML(q, orders[k])}</div></div>`).join('')}`;
  const bar = document.createElement('div'); bar.className = 'submit';
  bar.innerHTML = `<div class="in"><span>ตอบแล้ว <b id="cnt">0</b>/${qs.length}</span><button class="big">ส่งคำตอบ</button></div>`;
  document.body.append(bar);
  app.onclick = e => {
    const b = e.target.closest('.opt'); if (!b) return;
    const box = b.parentElement; if (box.classList.contains('done')) return;
    const k = +box.parentElement.dataset.k;
    box.querySelectorAll('.opt').forEach(x => x.classList.toggle('sel', x === b));
    ans[k] = +b.dataset.o; $('#cnt').textContent = Object.keys(ans).length;
  };
  bar.querySelector('.big').onclick = () => {
    const left = qs.length - Object.keys(ans).length;
    if (left && !confirm(`ยังไม่ได้ตอบ ${left} ข้อ ส่งเลยไหม`)) return;
    app.onclick = null; bar.remove();
    let right = 0; const per = {};
    qs.forEach((q, k) => {
      const box = app.querySelector(`[data-k="${k}"] .opts`), ok = ans[k] === q.a;
      box.querySelectorAll('.opt').forEach(x => x.classList.remove('sel'));
      mark(box, q, ans[k]); if (k in ans) store.set(q.id, ok);
      if (ok) right++;
      (per[q.t] ||= [0, 0])[1]++; if (ok) per[q.t][0]++;
    });
    const head = document.createElement('div');
    head.innerHTML = `<div class="score"><div class="n">${right}/${qs.length}</div><p>ตอบถูก ${Math.round(right / qs.length * 100)}% เลื่อนลงดูเหตุผลทุกข้อ</p></div>
    <div class="bd">${Object.entries(per).map(([t, [a, n]]) => `<div style="--c:${COLOR[t]}"><span>${T[t].name}</span><b>${a}/${n}</b><div class="meter"><i style="width:${a / n * 100}%"></i></div></div>`).join('')}</div>
    <a class="next-lesson" href="#/x/${id}" onclick="setTimeout(route)">ทำชุดใหม่</a>`;
    app.prepend(head); scrollTo({top: 0, behavior: 'smooth'});
  };
}

function key(id) {
  theme(T[id] ? id : null);
  const qs = byTopic(id);
  app.innerHTML = `<div class="lhead"><h1>เฉลยทั้งหมด</h1><p>ข้อสีเขียวคือคำตอบที่ถูก ใต้ทุกช้อยส์มีเหตุผลว่าทำไมถูกหรือผิด</p></div>
  <div class="filters">${[['all', 'ทุกบท'], ...TOPICS.map(t => [t.id, t.name])].map(([k, n]) => `<button class="${k === id ? 'on' : ''}" data-k="${k}">${n}</button>`).join('')}</div>
  ${qs.map((q, k) => `<div class="ex-q"><span class="qtag">${k + 1}. ${T[q.t].name}</span><p class="q">${q.q}</p><div class="opts done">${optHTML(q, shuffle([0, 1, 2, 3]))}</div></div>`).join('')}`;
  app.querySelectorAll('.ex-q .opts').forEach((b, k) => mark(b, qs[k], -1));
  app.querySelector('.filters').onclick = e => { const b = e.target.closest('button'); if (b) location.hash = '#/k/' + b.dataset.k; };
}

route();
