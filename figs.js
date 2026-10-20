// Interactive figures for lesson cards
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (vb) => `<svg viewBox="${vb}" xmlns="${NS}">`;
const slider = (name, min, max, step, val, color) =>
  `<label class="ctl"><span style="color:${color || 'inherit'};font-weight:700">${name}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${val}" data-n="${name}"><output></output></label>`;
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

const FIGS = {
  line(el) {
    const P = [[1, 2.2], [2, 2.9], [3, 4.6], [4, 4.9], [5, 6.8], [6, 7.1]];
    el.innerHTML = svgEl('0 0 320 220') + '</svg>' + slider('w', -1, 3, .05, .5, 'var(--cw)') + slider('b', -2, 6, .1, 1, 'var(--cb)') + '<div class="readout"></div>';
    const sv = el.querySelector('svg'), [sw, sb] = el.querySelectorAll('input'), ro = el.querySelector('.readout');
    const X = x => 30 + x * 40, Y = y => 200 - y * 22;
    const draw = () => {
      const w = +sw.value, b = +sb.value;
      sw.nextElementSibling.textContent = w.toFixed(2); sb.nextElementSibling.textContent = b.toFixed(1);
      let sse = 0, g = '';
      P.forEach(([x, y]) => { const yh = w * x + b; sse += (yh - y) ** 2;
        g += `<line x1="${X(x)}" y1="${Y(y)}" x2="${X(x)}" y2="${Y(yh)}" stroke="var(--cw)" stroke-dasharray="4 3" stroke-width="2"/>`; });
      sv.innerHTML = `<line x1="30" y1="200" x2="310" y2="200" stroke="var(--mut)"/><line x1="30" y1="10" x2="30" y2="200" stroke="var(--mut)"/>
      ${g}<line x1="${X(-.75)}" y1="${Y(w * -.75 + b)}" x2="${X(7)}" y2="${Y(w * 7 + b)}" stroke="var(--acc)" stroke-width="3" stroke-linecap="round"/>
      ${P.map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="var(--fg)"/>`).join('')}
      <text x="300" y="215" font-size="12" fill="var(--mut)">x</text><text x="14" y="20" font-size="12" fill="var(--mut)">y</text>`;
      ro.innerHTML = `ŷ = ${w.toFixed(2)}x + ${b.toFixed(1)} &nbsp; J = <b>${(sse / (2 * P.length)).toFixed(3)}</b>`;
    };
    sw.oninput = sb.oninput = draw; draw();
  },

  gd(el) {
    el.innerHTML = svgEl('0 0 320 200') + '</svg>' + slider('α', .05, 1.05, .05, .2, 'var(--ca)') + '<div class="readout"></div><button class="fbtn">ปล่อยลูกบอล</button>';
    const sv = el.querySelector('svg'), sa = el.querySelector('input'), ro = el.querySelector('.readout'), btn = el.querySelector('button');
    const J = w => (w - 2) ** 2, X = w => 20 + w * 70, Y = j => 180 - j * 40;
    let curve = ''; for (let w = -.1; w <= 4.1; w += .05) curve += `${curve ? 'L' : 'M'}${X(w)},${Y(J(w))}`;
    let path = [], timer;
    const draw = () => {
      sa.nextElementSibling.textContent = (+sa.value).toFixed(2);
      const p = path.map(w => [X(Math.max(-.2, Math.min(4.2, w))), Y(Math.min(J(w), 4.4))]);
      sv.innerHTML = `<path d="${curve}" fill="none" stroke="var(--mut)" stroke-width="2"/>
      <line x1="${X(2)}" y1="180" x2="${X(2)}" y2="${Y(0)}" stroke="var(--ok)" stroke-dasharray="3 3"/>
      ${p.length > 1 ? `<polyline points="${p.map(q => q.join(',')).join(' ')}" fill="none" stroke="var(--ca)" stroke-width="1.5" opacity=".6"/>` : ''}
      ${p.map((q, i) => `<circle cx="${q[0]}" cy="${q[1]}" r="${i === p.length - 1 ? 8 : 3.5}" fill="var(--ca)"/>`).join('')}
      <text x="${X(2) + 6}" y="194" font-size="11" fill="var(--ok)">ต่ำสุด</text><text x="300" y="194" font-size="12" fill="var(--mut)">w</text>`;
    };
    const run = () => {
      clearInterval(timer); path = [.2]; const a = +sa.value; let n = 0;
      timer = setInterval(() => {
        const w = path[path.length - 1], nw = w - a * 2 * (w - 2); path.push(nw); n++; draw();
        const j = J(nw);
        ro.innerHTML = `รอบ ${n} &nbsp; w = ${nw.toFixed(3)} &nbsp; J = <b>${j > 999 ? '∞' : j.toFixed(4)}</b> ${a >= 1 ? '&nbsp; แกว่ง/ระเบิด' : a < .1 ? '&nbsp; ช้ามาก' : ''}`;
        if (n >= 14 || Math.abs(nw - w) < 1e-4 || j > 1e3) clearInterval(timer);
      }, 280);
    };
    btn.onclick = run; sa.oninput = () => { path = []; draw(); ro.textContent = 'เลือก α แล้วกดปล่อย'; };
    sa.oninput();
  },

  multi(el) {
    const F = [['ขนาด (ตร.ม.)', 40, 300, 120, 0.9, '#3b5bdb'], ['ห้องนอน', 1, 6, 3, 15, '#e8590c'], ['อายุบ้าน (ปี)', 0, 40, 10, -1.2, '#c2255c']];
    const b = 30;
    el.innerHTML = F.map(f => slider(f[0], f[1], f[2], 1, f[3], f[5])).join('') + '<div class="bars" style="margin-top:14px"></div><div class="readout"></div>';
    const ins = el.querySelectorAll('input'), bars = el.querySelector('.bars'), ro = el.querySelector('.readout');
    const draw = () => {
      const parts = F.map((f, i) => { ins[i].nextElementSibling.textContent = ins[i].value; return f[4] * ins[i].value; });
      const y = parts.reduce((a, c) => a + c, b), max = 330;
      bars.innerHTML = `<div style="display:flex;height:34px;border-radius:10px;overflow:hidden;background:var(--card)">
        <div style="width:${b / max * 100}%;background:#868e96"></div>
        ${parts.map((p, i) => p > 0 ? `<div style="width:${p / max * 100}%;background:${F[i][5]};transition:width .2s"></div>` : '').join('')}</div>`;
      ro.innerHTML = `ŷ = 0.9·x₁ + 15·x₂ − 1.2·x₃ + 30 = ${parts.map(p => p.toFixed(1)).join(' + ').replace('+ -', '− ')} + ${b} = <b>${y.toFixed(1)} แสน</b>`;
    };
    ins.forEach(i => i.oninput = draw); draw();
  },

  scale(el) {
    const inc = [52000, 61000, 68500, 73000, 79500, 88000], room = [4, 5, 6, 7, 8, 9];
    const st = a => { const m = a.reduce((s, x) => s + x) / a.length, sd = Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length); return a.map(x => (x - m) / sd); };
    el.innerHTML = svgEl('0 0 320 170') + '</svg><button class="fbtn">Standardize</button>';
    const sv = el.querySelector('svg'), btn = el.querySelector('button');
    let z = false;
    const draw = () => {
      const ri = z ? st(inc) : inc, rr = z ? st(room) : room;
      const lo = z ? -2 : 0, hi = z ? 2 : 90000, X = v => 20 + (v - lo) / (hi - lo) * 280;
      const row = (vals, y, c, name) => `<text x="20" y="${y - 16}" font-size="12" fill="var(--mut)">${name}</text><line x1="20" x2="300" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="2"/>
        ${vals.map(v => `<circle cx="${X(v)}" cy="${y}" r="7" fill="${c}" style="transition:cx .6s cubic-bezier(.2,.8,.2,1)"/>`).join('')}`;
      sv.innerHTML = row(ri, 50, '#0c8599', 'รายได้ (Income)') + row(rr, 120, '#e8590c', 'จำนวนห้อง (Rooms)') +
        `<text x="20" y="160" font-size="11" fill="var(--mut)">${z ? '−2σ' : '0'}</text><text x="300" y="160" font-size="11" fill="var(--mut)" text-anchor="end">${z ? '+2σ' : '90,000'}</text>
         ${z ? `<line x1="160" x2="160" y1="30" y2="140" stroke="var(--mut)" stroke-dasharray="3 3"/><text x="160" y="160" font-size="11" fill="var(--mut)" text-anchor="middle">μ = 0</text>` : ''}`;
      btn.textContent = z ? 'ดูค่าเดิม' : 'Standardize';
    };
    btn.onclick = () => { z = !z; draw(); }; draw();
  },

  sigmoid(el) {
    el.innerHTML = svgEl('0 0 320 200') + '</svg>' + slider('z', -8, 8, .1, 1.5) + slider('th', .05, .95, .05, .5) + '<div class="readout"></div>';
    const sv = el.querySelector('svg'), [sz, st] = el.querySelectorAll('input'), ro = el.querySelector('.readout');
    const s = z => 1 / (1 + Math.exp(-z)), X = z => 160 + z * 18, Y = p => 180 - p * 160;
    let d = ''; for (let z = -8; z <= 8; z += .2) d += `${d ? 'L' : 'M'}${X(z)},${Y(s(z))}`;
    const draw = () => {
      const z = +sz.value, th = +st.value, p = s(z), c = p >= th ? 1 : 0;
      sz.nextElementSibling.textContent = z.toFixed(1); st.nextElementSibling.textContent = th.toFixed(2);
      sv.innerHTML = `<rect x="16" y="${Y(1)}" width="288" height="${Y(th) - Y(1)}" fill="var(--ok)" opacity=".08"/>
      <line x1="16" x2="304" y1="${Y(th)}" y2="${Y(th)}" stroke="var(--mut)" stroke-dasharray="4 3"/>
      <line x1="16" x2="304" y1="180" y2="180" stroke="var(--mut)"/><line x1="160" x2="160" y1="15" y2="180" stroke="var(--line)"/>
      <path d="${d}" fill="none" stroke="var(--acc)" stroke-width="3"/>
      <line x1="${X(z)}" x2="${X(z)}" y1="180" y2="${Y(p)}" stroke="var(--acc)" stroke-dasharray="2 3"/>
      <circle cx="${X(z)}" cy="${Y(p)}" r="8" fill="${c ? 'var(--ok)' : 'var(--bad)'}" stroke="var(--card)" stroke-width="2"/>
      <text x="300" y="${Y(th) - 6}" font-size="11" text-anchor="end" fill="var(--mut)">threshold</text>
      <text x="300" y="195" font-size="12" fill="var(--mut)">z</text><text x="20" y="${Y(1) + 4}" font-size="11" fill="var(--mut)">1</text>`;
      ro.innerHTML = `σ(${z.toFixed(1)}) = <b>${p.toFixed(3)}</b> &nbsp; ${p.toFixed(3)} ${p >= th ? '≥' : '<'} ${th.toFixed(2)} → ทาย <b>${c}</b>`;
    };
    sz.oninput = st.oninput = draw; draw();
  },

  cm(el) {
    const v = {TN: 925, FP: 5, FN: 150, TP: 17};
    const cell = (k, good) => `<div class="c ${good ? 'g' : 'r'}">${k}<b data-k="${k}">${v[k]}</b><div class="pm"><button data-k="${k}" data-d="-10">−</button><button data-k="${k}" data-d="10">+</button></div></div>`;
    el.innerHTML = `<div class="cm"><span></span><span class="h">ทาย 0</span><span class="h">ทาย 1</span>
      <span class="h">จริง 0</span>${cell('TN', 1)}${cell('FP')}<span class="h">จริง 1</span>${cell('FN')}${cell('TP', 1)}</div><div class="readout"></div>`;
    const ro = el.querySelector('.readout');
    const draw = () => {
      const {TN, FP, FN, TP} = v, n = TN + FP + FN + TP, P = TP / (TP + FP) || 0, R = TP / (TP + FN) || 0;
      el.querySelectorAll('b[data-k]').forEach(b => b.textContent = v[b.dataset.k]);
      ro.innerHTML = `Accuracy <b>${((TP + TN) / n).toFixed(3)}</b> Precision <b>${P.toFixed(3)}</b> Recall <b>${R.toFixed(3)}</b> F1 <b>${(2 * P * R / (P + R) || 0).toFixed(3)}</b>`;
    };
    el.onclick = e => { const b = e.target.closest('button[data-d]'); if (!b) return; v[b.dataset.k] = Math.max(0, v[b.dataset.k] + +b.dataset.d); draw(); };
    draw();
  },

  kmeans(el) {
    const rnd = (cx, cy, n) => Array.from({length: n}, () => [cx + (Math.random() - .5) * 70, cy + (Math.random() - .5) * 70]);
    const C = ['#3b5bdb', '#e8590c', '#c2255c'];
    let pts, cen, asg, phase, it;
    el.innerHTML = svgEl('0 0 320 220') + '</svg><div class="readout"></div><button class="fbtn"></button>';
    const sv = el.querySelector('svg'), ro = el.querySelector('.readout'), btn = el.querySelector('button');
    const reset = () => {
      pts = [...rnd(80, 70, 12), ...rnd(230, 80, 12), ...rnd(150, 170, 12)];
      cen = [[40, 200], [60, 190], [80, 205]].map(([x, y]) => [x + Math.random() * 200, y - Math.random() * 170]);
      asg = pts.map(() => -1); phase = 0; it = 0; draw();
    };
    const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
    const draw = () => {
      sv.innerHTML = pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${asg[i] < 0 ? 'var(--mut)' : C[asg[i]]}" style="transition:fill .3s"/>`).join('') +
        cen.map((c, k) => `<g style="transform:translate(${c[0]}px,${c[1]}px);transition:transform .6s cubic-bezier(.2,.8,.2,1)"><path d="M-9,-9L9,9M9,-9L-9,9" stroke="var(--card)" stroke-width="7"/><path d="M-8,-8L8,8M8,-8L-8,8" stroke="${C[k]}" stroke-width="4" stroke-linecap="round"/></g>`).join('');
      const wcss = asg[0] < 0 ? null : pts.reduce((s, p, i) => s + d2(p, cen[asg[i]]), 0);
      ro.innerHTML = `รอบ ${it} &nbsp; ${wcss == null ? 'centroid เริ่มต้นแบบสุ่ม' : `WCSS = <b>${Math.round(wcss)}</b>`}`;
      btn.textContent = phase === 2 ? 'ลู่เข้าแล้ว สุ่มใหม่' : phase === 0 ? 'จัดจุดเข้า centroid ที่ใกล้สุด' : 'ย้าย centroid ไปที่ค่าเฉลี่ย';
    };
    btn.onclick = () => {
      if (phase === 2) return reset();
      if (phase === 0) {
        const old = asg.join();
        asg = pts.map(p => cen.map(c => d2(p, c)).reduce((bi, d, k, a) => d < a[bi] ? k : bi, 0));
        it++; phase = old === asg.join() ? 2 : 1;
      } else {
        cen = cen.map((c, k) => { const m = pts.filter((_, i) => asg[i] === k); return m.length ? [m.reduce((s, p) => s + p[0], 0) / m.length, m.reduce((s, p) => s + p[1], 0) / m.length] : c; });
        phase = 0;
      }
      draw();
    };
    reset();
  },

  elbow(el) {
    const W = [980, 520, 190, 160, 138, 120, 106, 95];
    el.innerHTML = svgEl('0 0 320 190') + '</svg>' + slider('K', 1, 8, 1, 3) + '<div class="readout"></div>';
    const sv = el.querySelector('svg'), sk = el.querySelector('input'), ro = el.querySelector('.readout');
    const X = k => 20 + (k - 1) * 40, Y = w => 165 - w / 1000 * 150;
    const draw = () => {
      const k = +sk.value; sk.nextElementSibling.textContent = k;
      sv.innerHTML = `<line x1="20" x2="310" y1="165" y2="165" stroke="var(--mut)"/>
      <polyline points="${W.map((w, i) => `${X(i + 1)},${Y(w)}`).join(' ')}" fill="none" stroke="var(--acc)" stroke-width="3"/>
      ${W.map((w, i) => `<circle cx="${X(i + 1)}" cy="${Y(w)}" r="${i + 1 === k ? 9 : 4}" fill="${i === 2 ? 'var(--ok)' : 'var(--acc)'}" style="transition:r .2s"/><text x="${X(i + 1)}" y="182" font-size="11" text-anchor="middle" fill="var(--mut)">${i + 1}</text>`).join('')}
      <text x="${X(3) + 12}" y="${Y(190) - 10}" font-size="12" fill="var(--ok)">elbow</text>`;
      ro.innerHTML = `K = ${k} &nbsp; inertia = <b>${W[k - 1]}</b> ${k > 1 ? `&nbsp; ลดลง ${W[k - 2] - W[k - 1]}` : ''}`;
    };
    sk.oninput = draw; draw();
  }
};
