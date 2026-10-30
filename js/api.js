// ===== Lapisan API: fetch ke GAS, dedupe, cache SWR, mode demo =====
const Sesi = {
  get() { try { const s = JSON.parse(localStorage.getItem('ddd_sesi')); return s && s.exp > Date.now() ? s : null; } catch (e) { return null; } },
  set(s) { try { localStorage.setItem('ddd_sesi', JSON.stringify(s)); } catch (e) {} },
  clear() { try { localStorage.removeItem('ddd_sesi'); Object.keys(localStorage).filter(k => k.indexOf('ddd_c_') === 0).forEach(k => localStorage.removeItem(k)); } catch (e) {} }
};
const API = {
  demo: false,
  ready() { return !/GANTI|XXXX/.test(APP_CONFIG.GAS_URL); },
  perf: []
};
const READ = /^(app\.boot|siswa\.beranda|aktivitas\.baca|guru\.(overview|log|nilai|kunci))$/;
const _inflight = {}; let _epoch = 0;

async function api(action, data, opt) {
  opt = opt || {};
  if (API.demo) return Demo.handle(action, data || {});
  if (!API.ready()) return { success: false, message: 'Aplikasi belum terhubung ke server. Isi GAS_URL di js/config.js (lihat panduan), atau coba mode Pratinjau.' };
  const s = Sesi.get();
  const isRead = READ.test(action);
  if (!isRead) _epoch++;
  const k = _epoch + '|' + action + '|' + JSON.stringify(data || {});
  if (isRead && _inflight[k]) return _inflight[k];
  const p = (async () => {
    const t0 = performance.now();
    try {
      const res = await fetch(APP_CONFIG.GAS_URL, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },   // wajib text/plain: hindari preflight CORS
        body: JSON.stringify({ action, token: s ? s.token : '', data: data || {} })
      });
      const j = await res.json();
      API.perf.push({ action, total: Math.round(performance.now() - t0), server: j.ms, cached: !!j.cached });
      if (j.code === 'AUTH' && action.indexOf('auth.') !== 0) { Sesi.clear(); toast('Sesi berakhir, silakan masuk lagi.', 'err'); location.hash = '#/masuk'; }
      return j;
    } catch (e) { return { success: false, message: 'Gagal terhubung ke server. Periksa internet lalu coba lagi.' }; }
  })();
  if (isRead) { _inflight[k] = p; p.finally(() => delete _inflight[k]); }
  return p;
}
/** Stale-While-Revalidate: tampilkan cache dulu, segarkan di belakang layar. */
async function swr(action, data, cb, maxAge) {
  const s = Sesi.get(), key = 'ddd_c_' + (s ? s.me.id : 'tamu') + '_' + action + JSON.stringify(data || {});
  let cached = null;
  if (!API.demo) { try { cached = JSON.parse(localStorage.getItem(key)); } catch (e) {} }
  if (cached) { cb(cached.d, true); if (Date.now() - cached.t < (maxAge || 0)) return; }
  const r = await api(action, data);
  if (!r.success) { if (!cached) cb(null, false, r); return; }
  const h = JSON.stringify(r.data);
  if (!cached || JSON.stringify(cached.d) !== h) cb(r.data, false);
  if (!API.demo) { try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: r.data })); } catch (e) {} }
}
function dropCache() { Object.keys(localStorage).filter(k => k.indexOf('ddd_c_') === 0).forEach(k => localStorage.removeItem(k)); }
function warmUp() { if (!API.ready() || sessionStorage.getItem('ddd_warm')) return; sessionStorage.setItem('ddd_warm', '1'); fetch(APP_CONFIG.GAS_URL + '?w=1', { mode: 'no-cors' }).catch(() => {}); }
window.Perf = { table() { console.table(API.perf); } };
