// ===== Utilitas UI + efek interaktif (kilau, glow, slideshow, flip, konfeti, kursor lup hidup) =====
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rich = s => { let o = esc(s), b = false, i = false; o = o.replace(/\*{1,3}/g, m => { if (m.length === 3) { if (b && i) { b = i = false; return '</i></b>'; } if (!b && !i) { b = i = true; return '<b><i>'; } if (b) { b = false; return '</b>'; } i = false; return '</i>'; } if (m.length === 2) { b = !b; return b ? '<b>' : '</b>'; } i = !i; return i ? '<i>' : '</i>'; }); return o + (i ? '</i>' : '') + (b ? '</b>' : ''); };
const initials = n => String(n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase();
const waktu = s => { if (!s) return '-'; const d = new Date(String(s).replace(' ', 'T') + '+07:00'); return isNaN(d) ? s : d.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).replace('.', ':') + ' WIB'; };
const lalu = s => { const d = new Date(String(s).replace(' ', 'T') + '+07:00'), m = Math.round((Date.now() - d) / 60000); return isNaN(d) ? '' : m < 1 ? 'baru saja' : m < 60 ? m + ' menit yang lalu' : m < 1440 ? Math.round(m / 60) + ' jam yang lalu' : Math.round(m / 1440) + ' hari yang lalu'; };
const mmss = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

let _toastT;
function toast(msg, tipe) { const t = $('#toast'); t.textContent = msg; t.className = 'show ' + (tipe || ''); clearTimeout(_toastT); _toastT = setTimeout(() => t.classList.remove('show'), 3200); }
function modal(html, onClose) {
  const m = $('#modal'); m.innerHTML = '<div class="modal-box"><button class="modal-x" aria-label="Tutup">✕</button>' + html + '</div>'; m.classList.add('show');
  const close = () => { m.classList.remove('show'); m.innerHTML = ''; onClose && onClose(); };
  m.onclick = e => { if (e.target === m) close(); }; $('.modal-x', m).onclick = close; return { close, el: m };
}
function confirmBox(judul, teks, okLabel) {
  return new Promise(res => {
    const m = modal('<h3>' + esc(judul) + '</h3><p class="muted mt">' + esc(teks) + '</p><div class="row mt2" style="justify-content:flex-end"><button class="btn btn-ghost" data-n>Batal</button><button class="btn btn-primary shine" data-y>' + esc(okLabel || 'Ya, lanjutkan') + '</button></div>', () => res(false));
    $('[data-y]', m.el).onclick = () => { res(true); m.el.onclick = null; $('#modal').classList.remove('show'); $('#modal').innerHTML = ''; };
    $('[data-n]', m.el).onclick = () => m.close();
  });
}

// ---------- konfeti ----------
const Confetti = {
  go(n) {
    const c = $('#confetti'), x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
    const cols = ['#7C4DFF', '#EC4899', '#FBBF24', '#5FA052', '#5B8DEF'];
    const ps = Array.from({ length: n || 140 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .4, vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 4, s: 6 + Math.random() * 7, c: cols[Math.random() * 5 | 0], r: Math.random() * 6, vr: (Math.random() - .5) * .4 }));
    let f = 0; (function step() {
      x.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.vy += .4; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .6); x.restore(); });
      if (++f < 150) requestAnimationFrame(step); else x.clearRect(0, 0, c.width, c.height);
    })();
  }
};

// ---------- slideshow otomatis (kartu produk & hero) ----------
const _timers = [];
function clearTimers() { while (_timers.length) clearInterval(_timers.pop()); }
function initSlides(root) {
  $$('.slides', root).forEach(el => {
    if (el.dataset.ready) return; el.dataset.ready = 1;
    const src = (el.dataset.slides || '').split(',').filter(Boolean); if (!src.length) return;
    el.innerHTML = src.map((s, i) => '<img src="' + s + '" alt="" loading="lazy" class="' + (i ? '' : 'on') + '">').join('') + '<div class="sl-dots">' + src.map((_, i) => '<b class="' + (i ? '' : 'on') + '"></b>').join('') + '</div>';
    const im = $$('img', el), dt = $$('.sl-dots b', el); let i = 0, hold = false;
    const go = n => { im[i].classList.remove('on'); dt[i].classList.remove('on'); i = (n + im.length) % im.length; im[i].classList.add('on'); dt[i].classList.add('on'); };
    dt.forEach((d, k) => d.onclick = e => { e.stopPropagation(); go(k); });
    const host = el.closest('.card,.prod') || el; host.addEventListener('mouseenter', () => hold = true); host.addEventListener('mouseleave', () => hold = false);
    _timers.push(setInterval(() => { if (!hold && !document.hidden) go(i + 1); }, +el.dataset.interval || 3200 + Math.random() * 800));
  });
}
function initHero(root) {
  const h = $('.hero-stage', root); if (!h) return;
  const sl = $$('.hero-slide', h), dt = $$('.hero-dots b', h); let i = 0, hold = false;
  const go = n => { sl[i].classList.remove('on'); dt[i].classList.remove('on'); i = (n + sl.length) % sl.length; sl[i].classList.add('on'); dt[i].classList.add('on'); };
  dt.forEach((d, k) => d.onclick = () => go(k)); h.addEventListener('mouseenter', () => hold = true); h.addEventListener('mouseleave', () => hold = false);
  _timers.push(setInterval(() => { if (!hold && !document.hidden) go(i + 1); }, 5200));
}
// ---------- kartu testimoni flip otomatis ----------
function initFlip(root) {
  const w = $$('.flipwrap', root); if (!w.length) return;
  w.forEach(x => x.addEventListener('mouseenter', () => x.dataset.hold = 1) || x.addEventListener('mouseleave', () => delete x.dataset.hold));
  _timers.push(setInterval(() => { if (document.hidden) return; const c = w.filter(x => !x.dataset.hold); if (!c.length) return; const x = c[Math.random() * c.length | 0]; x.classList.toggle('flipped'); setTimeout(() => { if (!x.dataset.hold) x.classList.remove('flipped'); }, 3600); }, 2400));
}
// ---------- scroll reveal, hitung angka, bar progres ----------
let _io;
function initReveal(root) {
  if (_io) _io.disconnect();
  _io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const t = e.target; t.classList.add('in'); _io.unobserve(t);
    if (t.dataset.count) { const to = +t.dataset.count, d = 1200, t0 = performance.now(); (function f(n) { const p = Math.min(1, (n - t0) / d); t.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + (t.dataset.suf || ''); if (p < 1) requestAnimationFrame(f); })(t0); }
    if (t.dataset.w) t.style.width = t.dataset.w;
  }), { threshold: .15 });
  $$('.rv,[data-count],[data-w]', root).forEach((e, i) => { if (e.classList.contains('rv')) e.style.transitionDelay = (i % 6) * 70 + 'ms'; _io.observe(e); });
}
function afterRender(root) { root = root || document; initSlides(root); initReveal(root); }

// ---------- interaksi global: ripple, glow mengikuti kursor, tilt ----------
document.addEventListener('click', e => {
  const b = e.target.closest('.btn'); if (!b) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = document.createElement('span'); sp.className = 'ripple';
  sp.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px'; b.appendChild(sp); setTimeout(() => sp.remove(), 650);
});
document.addEventListener('pointermove', e => {
  const g = e.target.closest && e.target.closest('.glow'); if (!g) return;
  const r = g.getBoundingClientRect(); g.style.setProperty('--mx', (e.clientX - r.left) + 'px'); g.style.setProperty('--my', (e.clientY - r.top) + 'px');
  if (g.classList.contains('tilt') && matchMedia('(pointer:fine)').matches) { const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; g.style.transform = 'perspective(900px) rotateX(' + (-py * 7) + 'deg) rotateY(' + (px * 7) + 'deg) translateY(-4px)'; }
});
document.addEventListener('pointerout', e => { const g = e.target.closest && e.target.closest('.tilt'); if (g && !g.contains(e.relatedTarget)) g.style.transform = ''; });

// ---------- KARAKTER KURSOR LUP HIDUP ----------
const Lup = {
  on: false, x: -200, y: -200, tx: -200, ty: -200, rot: 0, last: Date.now(), lx: 0, ly: 0, el: null,
  svg: '<svg viewBox="0 0 96 96" width="96" height="96"><defs><radialGradient id="lg" cx="35%" cy="30%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#d9ccff" stop-opacity=".8"/></radialGradient></defs>' +
    '<g class="body"><line x1="55" y1="55" x2="84" y2="84" stroke="#4f2bb8" stroke-width="11" stroke-linecap="round"/><line x1="55" y1="55" x2="84" y2="84" stroke="#7C4DFF" stroke-width="6" stroke-linecap="round"/>' +
    '<circle cx="36" cy="36" r="30" fill="url(#lg)" stroke="#7C4DFF" stroke-width="7"/><path d="M15 30 A22 22 0 0 1 28 16" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>' +
    '<g class="eyes"><ellipse cx="27" cy="33" rx="6.5" ry="8" fill="#fff" stroke="#22223B" stroke-width="1.5"/><ellipse cx="45" cy="33" rx="6.5" ry="8" fill="#fff" stroke="#22223B" stroke-width="1.5"/>' +
    '<circle class="pupil" cx="27" cy="34" r="3.6" fill="#22223B"/><circle class="pupil" cx="45" cy="34" r="3.6" fill="#22223B"/>' +
    '<rect class="lid" x="19" y="31" width="16" height="6" rx="3" fill="#d9ccff" stroke="#22223B" stroke-width="1.5"/><rect class="lid" x="37" y="31" width="16" height="6" rx="3" fill="#d9ccff" stroke="#22223B" stroke-width="1.5"/></g>' +
    '<circle cx="19" cy="46" r="4" fill="#EC4899" opacity=".45"/><circle cx="53" cy="46" r="4" fill="#EC4899" opacity=".45"/>' +
    '<path class="mouth-s" d="M29 47 Q36 53 43 47" stroke="#22223B" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse class="mouth-o" cx="36" cy="49" rx="5" ry="5.5" fill="#EC4899" stroke="#22223B" stroke-width="2"/>' +
    '<g class="zz"><text x="58" y="14" font-size="14" font-weight="800" fill="#7C4DFF" font-family="Arial">z</text><text x="68" y="6" font-size="10" font-weight="800" fill="#EC4899" font-family="Arial">z</text></g></g></svg>',
  prefOn() { return localStorage.getItem('ddd_lup') !== 'off'; },
  supported() { return matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches; },
  init() {
    if (this.el || !this.supported()) return;
    const el = this.el = document.createElement('div'); el.id = 'lup'; el.innerHTML = this.svg; document.body.appendChild(el);
    this.eyes = $$('.pupil', el);
    addEventListener('pointermove', e => {
      if (!this.on) return;
      const nx = e.clientX, ny = e.clientY; this.dx = nx - this.tx; this.dy = ny - this.ty; this.tx = nx; this.ty = ny; this.last = Date.now(); el.classList.add('vis'); el.classList.remove('sleep');
      const t = e.target;
      el.classList.toggle('txt', !!(t.closest && t.closest('input,textarea,select')));
      el.classList.toggle('hov', !!(t.closest && t.closest('a,button,.opt,.chip,.flipwrap,.glow,.akt,[data-act],summary,label')));
      this.trail(nx, ny);
    }, { passive: true });
    addEventListener('pointerdown', e => { if (!this.on) return; el.classList.add('down'); const r = document.createElement('i'); r.className = 'lup-ring'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.body.appendChild(r); setTimeout(() => r.remove(), 650); });
    addEventListener('pointerup', () => el.classList.remove('down'));
    document.addEventListener('mouseleave', () => el.classList.remove('vis'));
    document.addEventListener('mouseenter', () => this.on && el.classList.add('vis'));
    setInterval(() => { if (!this.on) return; if (Date.now() - this.last > 7000) el.classList.add('sleep'); else { el.classList.add('blink'); setTimeout(() => el.classList.remove('blink'), 140); } }, 3200);
    const loop = () => {
      this.x += (this.tx - this.x) * .5; this.y += (this.ty - this.y) * .5;
      const vx = (this.tx - this.x) * 2.2; this.rot += (Math.max(-28, Math.min(28, vx)) - this.rot) * .15;
      el.style.transform = 'translate(' + (this.x - 36) + 'px,' + (this.y - 36) + 'px) rotate(' + this.rot + 'deg)';
      const ex = Math.max(-2.4, Math.min(2.4, (this.tx - this.x) * .35 + (this.dx || 0) * .15)), ey = Math.max(-2.4, Math.min(2.4, (this.ty - this.y) * .35 + (this.dy || 0) * .15));
      this.eyes.forEach(p => p.style.transform = 'translate(' + ex + 'px,' + ey + 'px)');
      this.dx *= .9; this.dy *= .9; requestAnimationFrame(loop);
    }; loop();
    this.set(this.prefOn());
  },
  trail(x, y) { if (Math.hypot(x - this.lx, y - this.ly) < 46) return; this.lx = x; this.ly = y; const s = document.createElement('i'); s.className = 'spark'; s.textContent = ['✨', '⭐', '💜', '🔍'][Math.random() * 4 | 0]; s.style.left = x + 8 + 'px'; s.style.top = y + 8 + 'px'; s.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px'); s.style.setProperty('--dy', (20 + Math.random() * 30) + 'px'); document.body.appendChild(s); setTimeout(() => s.remove(), 800); },
  set(v) { this.on = !!v && !!this.el; document.body.classList.toggle('lup-on', this.on); if (!this.on && this.el) this.el.classList.remove('vis'); try { localStorage.setItem('ddd_lup', v ? 'on' : 'off'); } catch (e) {} },
  toggle() { if (!this.supported()) { toast('Kursor lup hanya tersedia di komputer/laptop dengan mouse.'); return; } if (!this.el) this.init(); this.set(!this.on); toast(this.on ? 'Kursor lup dinyalakan 🔍' : 'Kursor lup dimatikan'); }
};
addEventListener('DOMContentLoaded', () => Lup.init());
