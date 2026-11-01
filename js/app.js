// ===== Router hash sederhana + penjaga peran =====
function parseHash() {
  const h = location.hash.replace(/^#/, '') || '/', i = h.indexOf('?'), path = i < 0 ? h : h.slice(0, i), q = {};
  if (i >= 0) new URLSearchParams(h.slice(i + 1)).forEach((v, k) => q[k] = v);
  return { parts: path.split('/').filter(Boolean), q, path };
}
let _lastPath = null;
function route() {
  clearTimers(); document.body.classList.remove('tka-mode'); window.onbeforeunload = null; const m = $('#modal'); m.classList.remove('show'); m.innerHTML = '';
  const { parts, q, path } = parseHash(), el = $('#app');
  if (path !== _lastPath) { window.scrollTo(0, 0); _lastPath = path; }
  const s = Sesi.get(), p0 = parts[0] || '';
  try {
    if (!p0) { API.demo = false; Views.landing(el); return; }
    if (p0 === 'masuk') { API.demo = false; Views.masuk(el, q); return; }
    if (p0 === 's' || p0 === 'ps') {
      const demo = p0 === 'ps';
      if (!demo && !(s && s.me.role === 'siswa')) { location.hash = '#/masuk'; return; }
      API.demo = demo; const ctx = { base: '#/' + p0, params: parts.slice(2), q }, pg = parts[1] || 'beranda';
      ({ beranda: Views.sBeranda, peta: Views.sPeta, nilai: Views.sNilai, profil: Views.sProfil, akt: Views.sAkt }[pg] || Views.sBeranda)(el, ctx); return;
    }
    if (p0 === 'g' || p0 === 'pg') {
      const demo = p0 === 'pg';
      if (!demo && !(s && s.me.role === 'guru')) { location.hash = '#/masuk?t=guru'; return; }
      API.demo = demo; const ctx = { base: '#/' + p0, params: parts.slice(2), q }, pg = parts[1] || 'overview';
      ({ overview: Views.gOverview, log: Views.gLog, nilai: Views.gNilai, kunci: Views.gKunci, impor: Views.gImpor }[pg] || Views.gOverview)(el, ctx); return;
    }
    location.hash = '#/';
  } catch (e) {
    console.error(e); el.innerHTML = '<div class="auth"><div class="card center auth-card"><div style="font-size:52px">😵</div><h3>Ups, ada yang tidak beres</h3><p class="muted mt">Muat ulang halaman. Jika berulang, hubungi gurumu.</p><a class="btn btn-primary mt" href="#/">Ke Beranda</a></div></div>';
  }
}
window.refresh = route;
addEventListener('hashchange', route);
addEventListener('DOMContentLoaded', () => { route(); warmUp(); });
if ('serviceWorker' in navigator) { /* sengaja tidak dipakai: hindari cache basi di GitHub Pages */ }
