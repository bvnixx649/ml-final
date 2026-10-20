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

function route() {
  app.onclick = null;
  const [, page = '', id = '', ...flags] = location.hash.split('/');
  scrollTo(0, 0);
  ({t: lesson, q: quiz}[page] || home)(id, flags);
}
addEventListener('hashchange', route);

function home() {
  theme();
  const s = store.get();
  const wrong = QB.filter(q => s[q.id] === 0).length;
  app.innerHTML = `
  <section class="hero"><h1>Machine Learning<br>Final</h1>
  <p>อ่านนิยามทีละบท แล้วฝึกควิซ ${QB.length} ข้อ กดตอบแล้วรู้ทันทีว่าถูกหรือผิด พร้อมเหตุผลของทุกช้อยส์</p>
  <a class="go" href="#/q/all">ควิซรวมทุกบท</a></section>
  <div class="topics">${TOPICS.map((t, i) => {
    const qs = byTopic(t.id), done = qs.filter(q => q.id in s).length, ok = qs.filter(q => s[q.id] === 1).length;
    return `<div class="tp" style="--c:${COLOR[t.id]}"><div class="num" style="background:${COLOR[t.id]}">${i + 1}</div>
    <h3>${t.name}</h3><div class="sub">${t.th} ออกสอบ ${t.n} ข้อ คลัง ${qs.length} ข้อ</div>
    <div class="meter" title="${ok}/${qs.length}"><i style="width:${ok / qs.length * 100}%"></i></div>
    <div class="acts"><a class="chip" href="#/t/${t.id}">อ่านบทเรียน</a><a class="chip pri" href="#/q/${t.id}">ควิซ</a><a class="chip" href="#/q/${t.id}/key">เปิดคำตอบหมด</a></div></div>`;
  }).join('')}</div>
  ${wrong ? `<a class="next-lesson" style="background:var(--bad)" href="#/q/wrong">ฝึกข้อที่เคยตอบผิด (${wrong})</a>` : ''}`;
}

function lesson(id) {
  const t = T[id]; if (!t) return home();
  theme(id);
  const i = TOPICS.indexOf(t), nx = TOPICS[i + 1];
  app.innerHTML = `<div class="lhead"><h1>${t.name}</h1><p>${t.th}</p></div>
  ${t.cards.map(c => `<article class="card"><h2>${c.h}</h2><p class="key">${c.k}</p>${c.b}${c.f ? `<div class="fig" data-f="${c.f}"></div>` : ''}</article>`).join('')}
  <a class="next-lesson" href="#/q/${id}">ฝึกควิซบทนี้ ${byTopic(id).length} ข้อ</a>
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

function quiz(id, flags) {
  if (id !== 'all' && id !== 'wrong' && !T[id]) return home();
  const reveal = flags.includes('key'), mix = flags.includes('mix'), multi = id === 'all';
  theme(T[id] ? id : null);
  const base = byTopic(id);
  if (!base.length) { app.innerHTML = `<p class="empty">ยังไม่มีข้อที่ตอบผิด</p>`; return; }
  const groups = multi && !mix ? TOPICS.map(t => [t.id, shuffle(base.filter(q => q.t === t.id))]) : [[null, shuffle(base)]];
  const qs = groups.flatMap(g => g[1]);
  const link = (k, m) => '#/q/' + id + (k ? '/key' : '') + (m ? '/mix' : '');
  let n = 0;
  app.innerHTML = `<div class="lhead"><h1>${multi ? 'ควิซรวมทุกบท' : id === 'wrong' ? 'ข้อที่เคยตอบผิด' : T[id].name}</h1><p>${qs.length} ข้อ ${reveal ? 'ข้อสีเขียวคือคำตอบที่ถูก' : 'กดช้อยส์แล้วเห็นเฉลยกับเหตุผลทันที'} สลับข้อใหม่ทุกครั้งที่เข้า</p></div>
  <div class="seg"><a href="${link(0, mix)}" class="${reveal ? '' : 'on'}">ควิซ</a><a href="${link(1, mix)}" class="${reveal ? 'on' : ''}">เปิดคำตอบหมด</a></div>
  ${multi ? `<div class="seg"><a href="${link(reveal, 0)}" class="${mix ? '' : 'on'}">เรียงตามบท</a><a href="${link(reveal, 1)}" class="${mix ? 'on' : ''}">สุ่มบท</a></div>` : ''}
  <div class="qbar">${reveal ? '' : `<div class="pr"><div class="prog"><i></i></div><span class="qcount"><b id="cnt">0</b>/${qs.length} ถูก <b id="ok" style="color:var(--ok)">0</b></span></div>`}
  ${multi && !mix ? `<div class="filters">${TOPICS.map(t => `<button data-s="${t.id}" style="--c:${COLOR[t.id]}">${t.name}</button>`).join('')}</div>` : ''}</div>
  ${groups.map(([t, list]) => `${t ? `<h2 class="gsec" id="sec-${t}" style="color:${COLOR[t]}">${T[t].name}</h2>` : ''}
    ${list.map(q => `<div class="ex-q" data-k="${n}"><span class="qtag" style="color:${COLOR[q.t]}">${++n}${multi && mix ? '. ' + T[q.t].name : ''}</span><p class="q">${q.q}</p><div class="opts">${optHTML(q, shuffle([0, 1, 2, 3]))}</div></div>`).join('')}`).join('')}
  <div id="sum"></div>
  <a class="next-lesson" href="${link(reveal, mix)}" onclick="setTimeout(route)">สลับข้อใหม่</a>`;
  const qbar = $('.qbar'); qbar.style.top = $('.bar').offsetHeight + 'px';
  if (!qbar.children.length) qbar.remove();
  if (reveal) { app.querySelectorAll('.ex-q .opts').forEach((b, k) => mark(b, qs[k], -1)); }
  const chips = app.querySelectorAll('.filters button');
  const setChip = t => chips.forEach(c => { const on = c.dataset.s === t; if (on && !c.classList.contains('on')) c.parentElement.scrollTo({left: c.offsetLeft - 16, behavior: 'smooth'}); c.classList.toggle('on', on); });
  chips.forEach(c => c.onclick = () => {
    setChip(c.dataset.s);
    const s = $('#sec-' + c.dataset.s);
    scrollTo({top: s.getBoundingClientRect().top + scrollY - qbar.offsetHeight - $('.bar').offsetHeight - 8, behavior: 'smooth'});
  });
  if (chips.length) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) setChip(e.target.dataset.t);
    }), {rootMargin: '-45% 0px -50% 0px'});
    app.querySelectorAll('.ex-q').forEach(el => { el.dataset.t = qs[+el.dataset.k].t; io.observe(el); });
  }
  if (reveal) return;
  const ans = {};
  app.onclick = e => {
    const b = e.target.closest('.opt'); if (!b) return;
    const box = b.parentElement; if (box.classList.contains('done')) return;
    const k = +box.parentElement.dataset.k, q = qs[k], o = +b.dataset.o, ok = o === q.a;
    ans[k] = o; mark(box, q, o); store.set(q.id, ok); box.classList.add('w');
    const done = Object.keys(ans).length, right = Object.entries(ans).filter(([kk, a]) => a === qs[kk].a).length;
    $('#cnt').textContent = done; $('#ok').textContent = right;
    $('.qbar .prog i').style.width = done / qs.length * 100 + '%';
    if (done === qs.length) {
      const per = {};
      qs.forEach((q, k) => { (per[q.t] ||= [0, 0])[1]++; if (ans[k] === q.a) per[q.t][0]++; });
      $('#sum').innerHTML = `<div class="score"><div class="n">${right}/${qs.length}</div><p>ตอบถูก ${Math.round(right / qs.length * 100)}%</p></div>
      <div class="bd">${Object.entries(per).map(([t, [a, c]]) => `<div style="--c:${COLOR[t]}"><span>${T[t].name}</span><b>${a}/${c}</b><div class="meter"><i style="width:${a / c * 100}%"></i></div></div>`).join('')}</div>`;
    }
  };
}

route();
