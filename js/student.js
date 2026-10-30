// ===== Tampilan SISWA (mobile-first, bottom nav → sidebar di layar lebar) =====
const Stu = { data: null };
const JI = { Materi: '📖', Lab: '🧪', Kegiatan: '🧩', Formatif: '📝', Sumatif: '🏆' };
const JN = { Materi: 'Materi', Lab: 'Lab Simulasi', Kegiatan: 'Kegiatan', Formatif: 'Asesmen Formatif', Sumatif: 'Asesmen Sumatif' };

Stu.shell = function (el, ctx, o) {
  const s = Sesi.get(), nama = API.demo ? 'Siswa Tamu' : (s ? s.me.nama : '');
  const nav = [['beranda', '🏠', 'Beranda'], ['peta', '🧭', 'Peta Belajar'], ['nilai', '✅', 'Nilai & Riwayat'], ['profil', '👤', 'Profil']];
  el.innerHTML = (API.demo ? `<div class="preview-bar">👀 Mode Pratinjau — data contoh, tidak bisa diubah <a href="#/masuk">Masuk</a> <a href="#/">Keluar</a></div>` : '') +
    `<header class="s-top"><div class="in">${o.back ? `<a class="back" href="${o.back}" aria-label="Kembali">←</a>` : `<img src="assets/img/logo.svg" width="40" height="40" alt="">`}
      <div class="grow" style="min-width:0"><h4 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(o.title || 'Dunia Digital Aman')}</h4><div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(o.sub || 'Koding Bab 2 · SMP VII')}</div></div>
      <a class="avatar-sm" href="${ctx.base}/profil" title="${esc(nama)}">${nama ? esc(initials(nama)) : '🙂'}</a></div></header>
    <main class="s-main" id="sm"></main>
    <nav class="s-nav">${nav.map(n => `<a href="${ctx.base}/${n[0]}" class="${o.tab === n[0] ? 'on' : ''}"><span class="i">${n[1]}</span>${n[2]}</a>`).join('')}</nav>`;
  return $('#sm', el);
};
Stu.skeleton = '<div class="skeleton"></div><div class="skeleton" style="height:140px"></div><div class="skeleton"></div>';
Stu.load = function (cb, onErr) {
  swr('siswa.beranda', {}, (d, cached, r) => { if (!d) { toast((r && r.message) || 'Gagal memuat', 'err'); onErr && onErr(); return; } Stu.data = d; cb(d, cached); }, 15000);
};
Stu.actCard = function (a, base) {
  const cls = a.status === 'selesai' ? 'selesai' : a.berikutnya ? 'next' : a.status === 'terkunci' ? 'terkunci' : '';
  const ic = a.status === 'selesai' ? '✓' : a.status === 'terkunci' ? '🔒' : JI[a.jenis];
  const right = a.status === 'selesai' ? '<span class="badge b-ok">Tuntas ✓</span>' : a.status === 'terkunci' ? '<span class="badge b-lock">Terkunci</span>' : a.berikutnya ? '<span class="badge b-amber">Siap ▶</span>' : '<span class="badge">Terbuka</span>';
  return `<div class="akt ${cls} ${a.status === 'terkunci' ? '' : 'glow'}" ${a.status === 'terkunci' ? 'data-act="lock"' : ''}>
    <div class="ic">${ic}</div><div class="grow" style="min-width:0"><div class="tiny muted" style="font-weight:800;letter-spacing:.05em;text-transform:uppercase">${JN[a.jenis]} · ~${a.menit} mnt${a.oleh ? ' · 🔓 dibuka guru' : ''}</div><b style="line-height:1.25;display:block">${esc(a.judul)}</b></div>${right}
    ${a.status === 'terkunci' ? '' : `<a class="stretch" href="${base}/akt/${a.id}" aria-label="${esc(a.judul)}"></a>`}</div>`;
};
Stu.lockTap = root => $$('[data-act=lock]', root).forEach(x => x.onclick = () => toast('Selesaikan aktivitas sebelumnya dulu ya 🔒'));
Stu.ring = (pct, size, color, sw) => { const r = (size - sw) / 2, c = 2 * Math.PI * r; return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="rgba(124,77,255,.15)" stroke-width="${sw}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color || 'url(#rg)'}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-ring="${c * (1 - pct / 100)}" style="transition:stroke-dashoffset 1.3s cubic-bezier(.2,.8,.2,1)"/><defs><linearGradient id="rg"><stop offset="0" stop-color="#7C4DFF"/><stop offset="1" stop-color="#EC4899"/></linearGradient></defs></svg><div class="v"><span style="font-size:${size / 3.4}px">${pct}%</span></div></div>`; };
Stu.animRings = root => setTimeout(() => $$('[data-ring]', root).forEach(c => c.style.strokeDashoffset = c.dataset.ring), 80);

// ---------------- BERANDA ----------------
Views.sBeranda = function (el, ctx) {
  const m = Stu.shell(el, ctx, { tab: 'beranda' }); m.innerHTML = Stu.skeleton;
  Stu.load(d => {
    const cur = d.subbab.find(s => s.status === 'berjalan') || d.subbab.find(s => s.status !== 'selesai') || d.subbab[d.subbab.length - 1];
    const nextId = d.berikut, all = d.subbab.flatMap(s => s.aktivitas).concat(d.sumatif ? [d.sumatif] : []), nxt = all.find(a => a.id === nextId);
    const pct = cur ? Math.round(cur.selesai / cur.total * 100) : 0;
    m.innerHTML = `
    <div class="hero-card pop"><div class="row between"><div><h2>Halo, ${esc(d.siswa.nama.split(' ')[0])}! 👋</h2><div style="opacity:.9">Kelas ${esc(d.siswa.kelas)} · ${esc(d.siswa.nis)}</div></div><span class="badge" style="background:rgba(255,255,255,.22);color:#fff">⭐ Level ${d.level}</span></div>
      <div class="hr" style="background:rgba(255,255,255,.25)"></div><div class="row between wrap"><span>🏆 Target Belajar Pekan Ini</span><span class="badge" style="background:#fff;color:var(--primary-d)">Bab 2: ${d.progres.persen}% Tuntas</span></div></div>
    ${d.bukaGuru ? `<div class="card warm mt fadeup"><div class="row" style="align-items:flex-start"><div class="icon-circle">🔓</div><div><span class="badge">Akses Dibuka Guru 🔓</span> <span class="small muted">${waktu(d.bukaGuru.waktu)}</span><p class="mt"><b>${esc(d.bukaGuru.oleh)}</b> telah membuka akses <b>${esc(d.bukaGuru.aktivitas.slice(0, 2).join(', '))}${d.bukaGuru.aktivitas.length > 2 ? ' dan lainnya' : ''}</b>. ${esc(d.bukaGuru.alasan)} Silakan lanjutkan belajar!</p><span class="badge b-ok mt">🛡️ Nilai tetap dihitung murni dari hasil pengerjaanmu</span></div></div></div>` : ''}
    ${d.tuntasBab ? `<div class="card mt" style="background:#e9f9e4;border-color:var(--green)"><div class="row"><div class="icon-circle" style="background:var(--green);color:#fff">🏅</div><div><b>Bab Tuntas — Semua Materi Terbuka untuk Dipelajari Ulang!</b><div class="small muted">Tidak ada lagi gembok. Buka aktivitas mana pun kapan saja.</div></div></div></div>` : ''}
    ${cur ? `<div class="card mt glow"><div class="row"><div class="icon-circle">${cur.ikon}</div><div class="grow"><h3 style="font-size:19px">${esc(cur.judul)}</h3><div class="small muted">${esc(cur.deskripsi)}</div></div><span class="badge">${pct}% Selesai</span></div><div class="bar mt"><i data-w="${pct}%"></i></div></div>
    <div class="row between mt2"><b class="small muted" style="letter-spacing:.08em">ALUR BELAJAR MANDIRI</b><span class="small muted">${cur.selesai} dari ${cur.total} Tuntas</span></div>
    <div class="timeline mt">${cur.aktivitas.map(a => Stu.actCard(a, ctx.base)).join('')}</div>` : ''}
    ${d.sumatif && d.sumatif.status !== 'terkunci' && (!cur || cur.id !== 'SUM') ? `<div class="mt">${Stu.actCard(d.sumatif, ctx.base)}</div>` : ''}
    <div class="card mt row"><div class="icon-circle">🎧</div><div><b>Koneksi Tetap Stabil?</b><div class="small muted">Bila ada kendala teknis saat lab, lapor ke gurumu. Progresmu tersimpan otomatis.</div></div></div>
    ${nxt ? `<div class="sticky-cta no-print"><a class="btn btn-primary btn-lg shine pulse-glow" style="justify-content:space-between;width:100%;text-align:left" href="${ctx.base}/akt/${nxt.id}"><span>🚀 ${d.progres.persen === 0 ? 'Mulai Petualangan' : 'Lanjutkan'}<br><small style="font-weight:600;opacity:.9">${esc(nxt.judul)}</small></span><span>▶</span></a></div>` : ''}`;
    Stu.lockTap(m); afterRender(m);
  }, () => { m.innerHTML = '<div class="card center"><p>Gagal memuat data.</p><a class="btn btn-primary mt" href="' + ctx.base + '/beranda">Coba lagi</a></div>'; });
};

// ---------------- PETA BELAJAR ----------------
Views.sPeta = function (el, ctx) {
  const m = Stu.shell(el, ctx, { tab: 'peta', title: 'Peta Belajar', sub: 'Dunia Digital Aman' }); m.innerHTML = Stu.skeleton;
  Stu.load(d => {
    const sum = d.sumatif;
    m.innerHTML = `
    <div class="card glow"><div class="row"><div class="icon-circle">🗺️</div><div class="grow"><h3>Peta Belajar Bab 2</h3><div class="small muted">${esc(d.bab.judul)}</div></div><span class="badge b-ok">${d.progres.selesai}/${d.progres.total} Aktivitas</span></div>
      <div class="row mt" style="background:var(--lav2);border-radius:18px;padding:14px">${Stu.ring(d.progres.persen, 92, null, 10)}<div class="grow"><div class="row between"><b>Total Capaian</b><b class="muted">${d.progres.selesai} / ${d.progres.total} Misi</b></div><div class="bar mt"><i data-w="${d.progres.persen}%"></i></div><div class="small mt" style="color:var(--green-d);font-weight:700">${d.tuntasBab ? '✓ Bab tuntas — semua terbuka!' : (d.progres.total - d.progres.selesai) + ' aktivitas lagi menuju sumatif!'}</div></div></div></div>
    <div class="row between mt2"><h3>Alur Pembelajaran</h3><span class="small muted">Terbuka Bertahap</span></div>
    ${d.subbab.map((s, i) => `<div class="card mt ${s.status === 'berjalan' ? 'warm' : ''} glow rv"><div class="row"><span class="badge ${s.status === 'selesai' ? 'b-ok' : s.status === 'berjalan' ? 'b-amber' : 'b-lock'}">${s.status === 'selesai' ? 'Selesai ✓' : s.status === 'berjalan' ? 'Sedang Dikerjakan' : 'Terkunci 🔒'}</span><span class="small muted">Sub-bab ${i + 1} · ${s.total} Kegiatan</span></div>
      <div class="row mt"><div class="icon-circle" style="width:56px;height:56px;font-size:28px">${s.ikon}</div><div><h4>${esc(s.judul)}</h4><div class="small muted">${esc(s.deskripsi)}</div></div></div>
      <div class="row between mt small"><span style="color:var(--green-d);font-weight:700">${s.selesai}/${s.total} Selesai Tuntas</span><span class="muted">${Math.round(s.selesai / s.total * 100)}%</span></div><div class="bar mt green"><i data-w="${Math.round(s.selesai / s.total * 100)}%"></i></div>
      <details class="mt" ${s.status === 'berjalan' ? 'open' : ''}><summary class="small" style="cursor:pointer;font-weight:800;color:var(--primary-d)">Daftar langkah aktivitas</summary><div class="timeline mt">${s.aktivitas.map(a => Stu.actCard(a, ctx.base)).join('')}</div></details></div>`).join('')}
    ${sum ? `<div class="card mt2 glow rv" style="background:linear-gradient(135deg,#fff7ec,#ffeaf4)"><span class="badge b-warm">🏆 UJI KOMPETENSI AKHIR</span> ${sum.status === 'terkunci' ? '<span class="badge b-lock">🔒 Terkunci hingga semua sub-bab selesai</span>' : ''}<h3 class="mt">${esc(sum.judul)}</h3><p class="muted small">10 soal pilihan ganda bernarasi. Nilai KKM minimum kelulusan: 72.</p>
      <div class="mt">${sum.status === 'terkunci' ? '<button class="btn btn-block off" data-act="lock">🔒 Mulai Tes Sumatif (Syarat Belum Terpenuhi)</button>' : `<a class="btn btn-primary btn-block btn-lg shine" href="${ctx.base}/akt/SUM">${sum.status === 'selesai' ? '↻ Buka Kembali Sumatif' : '▶ Mulai Tes Sumatif'}</a>`}</div></div>` : ''}
    <div class="card mt row"><div class="icon-circle">💡</div><div><b>Tips Penjelajah Koding:</b><div class="small muted">Periksa kembali catatan Lab Mesin Pencari sebelum lanjut ke Studi Kasus untuk meraih lencana emas!</div></div></div>`;
    Stu.lockTap(m); afterRender(m); Stu.animRings(m);
  });
};

// ---------------- NILAI & RIWAYAT ----------------
Views.sNilai = function (el, ctx) {
  const m = Stu.shell(el, ctx, { tab: 'nilai', title: 'Nilai & Riwayat', sub: 'Nilai Resmi Bab 2' }); m.innerHTML = Stu.skeleton;
  Stu.load(d => {
    const n = d.nilai, sub = d.subbab;
    m.innerHTML = `
    <div class="hero-card pop center"><span class="badge" style="background:rgba(255,255,255,.22);color:#fff">🏅 Ringkasan Nilai Resmi</span>
      <div class="grid g3 mt" style="gap:10px">${sub.map(s => `<div style="background:rgba(255,255,255,.16);border-radius:18px;padding:12px"><div class="tiny" style="opacity:.9">Sub-bab ${s.id.slice(1)}</div><div style="font:800 32px var(--ff-h)">${n.formatif[s.id] !== undefined ? n.formatif[s.id] : '—'}</div></div>`).join('')}</div>
      <div class="row between mt"><div class="center grow"><div class="tiny" style="opacity:.9">RATA-RATA FORMATIF</div><div style="font:800 36px var(--ff-h)">${n.rata !== null ? n.rata : '—'}</div></div><div class="center grow"><div class="tiny" style="opacity:.9">NILAI SUMATIF RESMI</div><div style="font:800 36px var(--ff-h)">${n.sumatif !== null ? n.sumatif : '—'}</div></div></div>
      ${n.sumatif !== null ? `<div class="mt"><span class="badge ${n.tuntas ? 'b-green' : 'b-red'}" style="font-size:14px;padding:6px 18px">${n.tuntas ? '✓ TUNTAS (≥72) — Hebat Sekali!' : 'Belum Tuntas (<72) — ikut remedial bersama gurumu'}</span></div>` : '<div class="small mt" style="opacity:.9">Nilai sumatif muncul setelah kamu mengerjakannya dan mengisi refleksi.</div>'}</div>
    <div class="card mt row" style="background:var(--lav2)"><div class="icon-circle" style="background:#fff">🔒</div><div><b>Rapor Sekolah Terjamin Aman</b><div class="small muted">Nilai resmi diambil dari pengerjaan pertama. Latihan ulang tidak pernah menurunkan atau menimpa nilai resmi.</div></div></div>
    <h3 class="mt2">Riwayat Percobaan</h3>
    ${d.riwayat.map(r => {
      const a = (d.subbab.flatMap(s => s.aktivitas).concat(d.sumatif ? [d.sumatif] : [])).find(x => x.id === r.asesmen) || {};
      return `<div class="card mt glow"><div class="row between wrap"><b>${esc(r.judul)}</b>${r.resmi ? '<span class="badge b-ok">Nilai Resmi tercatat</span>' : '<span class="badge b-lock">Belum dikerjakan</span>'}</div>
      ${r.resmi ? `<div class="row between mt" style="background:var(--lav2);border-radius:14px;padding:10px 14px"><div><b>Asesmen Utama (Resmi)</b><div class="tiny muted">${waktu(r.resmi.waktu)} · ${r.resmi.benar}/${r.resmi.total} benar</div></div><b style="font:800 28px var(--ff-h);color:${r.jenis === 'Sumatif' && r.resmi.skor < 72 ? 'var(--danger)' : 'var(--green-d)'}">${r.resmi.skor}</b></div>` : ''}
      ${r.latihan.map(l => `<div class="row between mt small" style="padding:6px 14px"><span>Latihan Ulang Mandiri #${l.no} <span class="muted">(tidak memengaruhi nilai resmi)</span></span><span class="badge">${l.skor}</span></div>`).join('')}
      <div class="mt">${a.status === 'terkunci' ? '<span class="small muted">🔒 Masih terkunci</span>' : `<a class="btn ${r.resmi ? 'btn-green' : 'btn-primary'} btn-sm shine" href="${ctx.base}/akt/${r.asesmen}">${r.resmi ? '↻ Coba Latihan Ulang (Bebas Beban)' : '▶ Kerjakan Sekarang'}</a>`}</div></div>`;
    }).join('')}
    ${d.catatan.length ? `<h3 class="mt2">Catatan dari Gurumu 💌</h3>${d.catatan.map(c => `<div class="card warm mt"><div class="small muted">${esc(c.guru)} · ${waktu(c.waktu)}</div><p class="mt">${esc(c.teks)}</p></div>`).join('')}` : ''}`;
    afterRender(m);
  });
};

// ---------------- PROFIL ----------------
Views.sProfil = function (el, ctx) {
  const m = Stu.shell(el, ctx, { tab: 'profil', title: 'Profil', sub: 'Pengaturan akun' }); m.innerHTML = Stu.skeleton;
  Stu.load(d => {
    m.innerHTML = `<div class="card center pop"><div class="avatar" style="width:84px;height:84px;font-size:32px;background:var(--grad);margin:0 auto">${esc(initials(d.siswa.nama))}</div><h3 class="mt">${esc(d.siswa.nama)}</h3><div class="muted">Kelas ${esc(d.siswa.kelas)} · NIS ${esc(d.siswa.nis)}</div>
      <div class="row mt" style="justify-content:center"><span class="badge">⭐ Level ${d.level}</span><span class="badge b-green">${d.xp} XP</span></div></div>
      <div class="card mt col"><button class="btn btn-soft" data-act="lup">🔍 Kursor Lup Hidup: nyala / mati</button><button class="btn btn-ghost" id="out">${API.demo ? '← Keluar dari Pratinjau' : '⎋ Keluar'}</button></div>`;
    $('[data-act=lup]', m).onclick = () => Lup.toggle();
    $('#out', m).onclick = () => { Sesi.clear(); API.demo = false; location.hash = '#/'; };
  });
};

// ---------------- AKTIVITAS ----------------
Views.sAkt = async function (el, ctx) {
  const id = ctx.params[0], m = Stu.shell(el, ctx, { tab: 'peta', title: 'Memuat…', back: ctx.base + '/peta' }); m.innerHTML = Stu.skeleton;
  const r = await api('aktivitas.baca', { id });
  if (!r.success) { m.innerHTML = `<div class="card center pop"><div style="font-size:56px">🔒</div><h3>Belum Bisa Dibuka</h3><p class="muted mt">${esc(r.message)}</p><a class="btn btn-primary mt" href="${ctx.base}/peta">Kembali ke Peta Belajar</a></div>`; return; }
  const A = r.data, meta = A.meta, sub = (Stu.data && Stu.data.subbab.find(s => s.id === meta.sub)) || (PV.subbab.find(s => s.id === meta.sub)) || { judul: 'Uji Kompetensi', ikon: '🏆' };
  $('.s-top h4', el).textContent = meta.judul; $('.s-top .muted', el).textContent = JN[meta.jenis] + ' · ' + (sub.judul || '');
  const t0 = Date.now(), dur = () => Math.round((Date.now() - t0) / 1000);
  const selesaiCard = (res, extra) => {
    dropCache(); const nx = A.selanjutnya;
    m.innerHTML = `<div class="hero-card center pop"><div style="font-size:60px">🎉</div><h2>Aktivitas Selesai!</h2><p style="opacity:.92">${esc(meta.judul)}</p><span class="badge mt" style="background:#fff;color:var(--primary-d)">+${res.xp} XP</span>${res.tuntasBab ? '<p class="mt"><b>🏅 Bab 2 tuntas! Semua materi kini terbuka untuk dipelajari ulang.</b></p>' : ''}</div>
      <div class="col mt2">${nx ? `<a class="btn btn-primary btn-lg shine" href="${ctx.base}/akt/${nx.id}">Lanjut: ${esc(nx.judul)} ▶</a>` : ''}<a class="btn btn-ghost" href="${ctx.base}/peta">🧭 Kembali ke Peta Belajar</a></div>`;
    Confetti.go(); scrollTo(0, 0);
  };
  const selesai = async (btn) => {
    if (API.demo) { toast('Mode pratinjau: progres tidak disimpan.'); setTimeout(() => location.hash = ctx.base + '/beranda', 900); return; }
    btn.disabled = true; btn.textContent = 'Menyimpan…';
    const x = await api('aktivitas.selesai', { id, durasi: dur() });
    if (!x.success) { toast(x.message, 'err'); btn.disabled = false; btn.textContent = 'Coba lagi'; return; }
    selesaiCard(x.data);
  };
  const head = (step, total) => `<div class="card" style="padding:14px"><div class="row between wrap"><span class="badge">${sub.ikon} ${esc(sub.judul)}</span><span class="small muted">⏳ Langkah ${step} dari ${total}</span></div><div class="bar mt"><i style="width:${Math.round(step / total * 100)}%"></i></div></div>`;
  if (meta.jenis === 'Materi') Stu.materi(m, A, head, selesai);
  else if (meta.jenis === 'Lab') Stu.lab(m, A, head, selesai);
  else if (meta.jenis === 'Kegiatan') Stu.kegiatan(m, A, head, selesai);
  else Stu.asesmen(m, ctx, A, dur, r2 => Stu.hasil(m, ctx, A, r2));
};

Stu.materi = function (m, A, head, selesai) {
  const P = A.data.halaman; let i = 0;
  const draw = () => {
    const p = P[i];
    m.innerHTML = head(i + 1, P.length) + `<div class="card warm mt fadeup"><div class="center float" style="font-size:64px">${p.ikon}</div><h2 class="center mt" style="font-size:26px">${esc(p.judul)}</h2><p class="mt" style="font-size:17px;line-height:1.75">${rich(p.teks)}</p>
      <div class="col mt">${p.poin.map((x, k) => `<div class="row fadeup" style="animation-delay:${k * 90}ms;background:#fff;border-radius:14px;padding:10px 14px;align-items:flex-start"><span style="color:var(--green)">✔</span><span>${rich(x)}</span></div>`).join('')}</div></div>
      <div class="row between mt2"><button class="btn btn-ghost" id="pv" ${i ? '' : 'disabled'}>← Sebelumnya</button>${i < P.length - 1 ? '<button class="btn btn-primary shine" id="nx">Lanjut →</button>' : '<button class="btn btn-green shine pulse-glow" id="fin">✓ Tandai Selesai</button>'}</div>`;
    $('#pv', m).onclick = () => { i--; draw(); scrollTo(0, 0); };
    const n = $('#nx', m); if (n) n.onclick = () => { i++; draw(); scrollTo(0, 0); };
    const f = $('#fin', m); if (f) f.onclick = () => selesai(f);
    afterRender(m);
  };
  draw();
};
Stu.lab = function (m, A, head, selesai) {
  const D = A.data, T = D.tampil, K = D.keputusan; let sudah = T.tipe === 'pesan', benar = false, cari = false;
  const draw = () => {
    m.innerHTML = head(benar ? 3 : sudah ? 2 : 1, 3) + `
    <div class="card warm mt"><div class="row" style="align-items:flex-start"><div class="avatar" style="background:var(--grad)">🧑‍🎓</div><div><div class="row"><h3 style="font-size:20px">${esc(D.kasus.judul)}</h3><span class="badge b-ok">SMP Kelas VII</span></div><p class="mt">${rich(D.kasus.narasi)}</p></div></div>
      ${D.kasus.tautan ? `<div class="mt" style="background:#fff;padding:12px 14px;border-radius:14px">💡 Tautan yang beredar: <b style="color:#b3125f;word-break:break-all">${esc(D.kasus.tautan)}</b></div>` : ''}</div>
    ${T.tipe === 'cari' ? `<div class="card mt"><div class="row between"><h3 style="font-size:19px">🔍 Simulasi Mesin Pencari</h3><span class="badge">Lab Mode</span></div>
      <div class="search-box mt"><span>🔎 ${esc(T.kueri)}</span><button class="btn btn-green btn-sm" id="cari" ${cari ? 'disabled' : ''}>Cari</button></div><p class="small muted mt">💡 Tips: ${esc(T.tips)}</p>
      <div class="mt" id="serp">${cari ? T.hasil.map((h, k) => `<div class="serp ${h.aman ? '' : 'bad'} fadeup" style="animation-delay:${k * 160}ms"><div class="row between wrap"><b class="small" style="color:${h.aman ? 'var(--green-d)' : '#b3125f'}">${h.aman ? '✅' : '⚠️'} ${esc(h.label)}</b><span class="badge ${h.aman ? 'b-ok' : 'b-red'}">Domain ${esc(h.domain)}</span></div><h4 class="mt" style="font-size:17px">${esc(h.judul)}</h4><div class="u ${h.aman ? 'g' : 'r'}">${esc(h.url)}</div><p class="small muted">${esc(h.ringkas)}</p></div>`).join('') : '<div class="center muted small" style="padding:16px">Tekan tombol <b>Cari</b> untuk melihat hasil pencarian…</div>'}</div></div>` :
      `<div class="card mt chat"><div class="row between"><div class="row"><span class="icon-circle" style="background:#d8f5cf">💬</span><b>${esc(T.dari)}</b></div><span class="small muted">${esc(T.jam)}</span></div><div class="bub">${rich(T.isi)}<div class="small mt" style="color:var(--danger);font-weight:700">⚠ ${esc(T.peringatan)}</div></div></div>`}
    ${sudah ? `<div class="card mt fadeup"><h3 style="font-size:19px">${T.tipe === 'cari' ? 'Keputusan' : 'Tindakanmu'}</h3><p class="muted small mt">${esc(K.tanya)}</p><div class="mt" id="ops">${K.opsi.map(o => `<button class="opt ${benar && o.benar ? 'ok' : ''}" data-id="${o.id}" ${benar ? 'disabled' : ''}><span class="dot">${benar && o.benar ? '✓' : o.id.toUpperCase()}</span><span><b>${esc(o.judul)}</b><br><span class="small muted">${esc(o.ket)}</span></span></button>`).join('')}</div><div id="fb"></div></div>` : ''}
    ${benar ? `<div class="card mt pop" style="background:var(--green-l);border-color:var(--green)"><div class="row"><div class="icon-circle" style="background:#fff">⭐</div><div><h3 style="font-size:20px">${esc(D.sukses.judul)}</h3><span class="badge b-ok">+${D.poin} Poin Literasi Digital</span></div></div><p class="mt">${rich(D.sukses.teks)}</p><div class="mt" style="background:#fff;border-radius:14px;padding:12px 14px">💡 ${esc(D.sukses.tip)}</div></div>
      <button class="btn btn-primary btn-block btn-lg shine pulse-glow mt2" id="fin">Tandai Selesai & Lanjutkan →</button>` : ''}`;
    const c = $('#cari', m); if (c) c.onclick = () => { cari = true; sudah = true; draw(); setTimeout(() => $('#ops', m) && $('#ops', m).scrollIntoView({ behavior: 'smooth', block: 'center' }), 600); };
    $$('.opt[data-id]', m).forEach(b => b.onclick = () => {
      const o = K.opsi.find(x => x.id === b.dataset.id);
      if (o.benar) { benar = true; draw(); Confetti.go(90); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }
      else { b.classList.add('bad', 'shake'); b.disabled = true; $('#fb', m).innerHTML = `<div class="card mt" style="background:var(--danger-s);border-color:#fca5a5">${esc(D.gagal)}</div>`; }
    });
    const f = $('#fin', m); if (f) f.onclick = () => selesai(f);
  };
  draw();
};
Stu.kegiatan = function (m, A, head, selesai) {
  const D = A.data, L = D.langkah; let i = 0, ok = false, salah = {};
  const draw = (selesaiSemua) => {
    if (selesaiSemua) { m.innerHTML = head(L.length, L.length) + `<div class="card mt pop" style="background:var(--green-l);border-color:var(--green)"><h2>🎉 Misi Selesai!</h2><p class="mt">${esc(D.penutup)}</p></div><button class="btn btn-primary btn-block btn-lg shine pulse-glow mt2" id="fin">Tandai Selesai & Lanjutkan →</button>`; $('#fin', m).onclick = e => selesai(e.currentTarget); Confetti.go(90); return; }
    const s = L[i];
    m.innerHTML = head(i + 1, L.length) + (i === 0 ? `<div class="card warm mt"><p>${rich(D.narasi)}</p></div>` : '') + `<div class="card mt fadeup"><span class="badge">Tantangan ${i + 1}</span><h3 class="mt" style="font-size:20px">${rich(s.narasi)}</h3><div class="mt">${s.opsi.map((o, k) => `<button class="opt ${ok && o.benar ? 'ok' : ''} ${salah[k] ? 'bad' : ''}" data-k="${k}" ${ok || salah[k] ? 'disabled' : ''}><span class="dot">${ok && o.benar ? '✓' : salah[k] ? '✕' : 'ABC'[k]}</span><span>${esc(o.t)}</span></button>`).join('')}</div><div id="fb"></div></div>`;
    $$('.opt', m).forEach(b => b.onclick = () => {
      const k = +b.dataset.k, o = s.opsi[k];
      if (o.benar) { ok = true; draw(); const fb = $('#fb', m); fb.innerHTML = `<div class="card mt pop" style="background:var(--green-l);border-color:var(--green)">${esc(o.umpan)}</div><button class="btn btn-primary btn-block mt shine" id="nx">${i < L.length - 1 ? 'Tantangan Berikutnya →' : 'Selesaikan Misi 🎉'}</button>`; $('#nx', m).onclick = () => { ok = false; salah = {}; if (i < L.length - 1) { i++; draw(); } else draw(true); }; }
      else { salah[k] = 1; draw(); $('#fb', m).innerHTML = `<div class="card mt shake" style="background:var(--danger-s);border-color:#fca5a5">${esc(o.umpan)} Coba pilihan lain!</div>`; }
    });
  };
  draw();
};

// ---------------- ASESMEN (soal + refleksi) ----------------
Stu.asesmen = function (m, ctx, A, dur, done) {
  const S = A.data.soal, meta = A.meta, jw = {}; let rasa = '', teks = '', sending = false;
  const RS = [['😄', 'Senang'], ['🔥', 'Tertantang'], ['💡', 'Paham'], ['🤝', 'Butuh Guru']];
  m.innerHTML = `<div class="card" style="padding:14px"><div class="row between"><div class="row" style="min-width:0"><span class="icon-circle">📝</span><div style="min-width:0"><b style="line-height:1.2;display:block">${esc(meta.judul)}</b><span class="small muted">${meta.jenis === 'Sumatif' ? 'Uji Kompetensi Akhir' : 'Penilaian Formatif'}</span></div></div><span class="badge b-amber" id="tm">⏱ 00:00</span></div>
      <div class="row between mt"><div class="bar grow"><i id="pb" style="width:0"></i></div><span class="badge" id="pc">Terjawab 0 dari ${S.length}</span></div></div>
    ${A.punyaResmi ? `<div class="card mt row" style="background:#e9f9e4;border-color:var(--green)"><span style="font-size:26px">🔁</span><div class="small"><b>Mode Latihan Ulang.</b> Kamu sudah punya Nilai Resmi. Hasil latihan ini <b>tidak mengubah</b> nilai resminya.</div></div>` : `<div class="card mt row" style="background:var(--lav2)"><span style="font-size:26px">⭐</span><div class="small"><b>Pengerjaan pertama = Nilai Resmi.</b> Kerjakan dengan teliti. Setelah itu kamu boleh latihan ulang sepuasnya.</div></div>`}
    ${S.map(q => `<section class="mt2" data-q="${q.no}">${q.kasus ? `<div class="card warm"><div class="row"><span class="icon-circle" style="background:#fff">📖</span><b class="small">Kasus Cerita: ${esc(q.topik)}</b></div><p class="mt">${rich(q.kasus)}</p></div>` : `<div class="small muted" style="font-weight:800;letter-spacing:.05em">SOAL ${q.no} · ${esc(q.topik.toUpperCase())}</div>`}
      <div class="card mt" style="padding:16px"><b style="font-size:16px">${q.no}. ${rich(q.tanya)}</b></div><div class="mt">${['A', 'B', 'C', 'D'].map(k => `<button class="opt" data-q="${q.no}" data-o="${k}"><span class="dot">${k}</span><span>${esc(q.opsi[k])}</span></button>`).join('')}</div></section>`).join('')}
    <div class="card mt2"><div class="row" style="background:var(--lav);border-radius:24px;padding:16px"><div class="icon-circle" style="background:#fff">💭</div><div><b>Tuliskan refleksimu dulu yuk!</b><div class="small" style="color:var(--primary-d)">Refleksi ini melatih sikap tanggapmu dan membuka nilai resmi di akhir.</div></div></div>
      <label class="mt">Bagaimana perasaan & pemahamanmu terkait materi ini?</label><div class="rf-opts">${RS.map(r => `<button class="rf-opt" data-r="${r[1]}"><span class="e">${r[0]}</span>${r[1]}</button>`).join('')}</div>
      <div class="row between mt"><label style="margin:0">Apa hal terpenting yang kamu pelajari?</label><span class="small muted" id="cc">0/20</span></div><textarea id="rt" placeholder="Contoh: Selalu waspada bila ada pesan hadiah mendadak dan tidak membagikan PIN/OTP ke siapapun…"></textarea>
      <div class="row mt small muted" id="lk" style="background:var(--lav2);border-radius:14px;padding:12px">🔒 <span>Pilih jawaban kuis dan isi refleksi (minimal 20 karakter) untuk melanjutkan.</span></div></div>
    <button class="btn btn-primary btn-block btn-lg mt2 off" id="kirim">${API.demo ? 'Mode pratinjau — pengiriman dinonaktifkan' : 'Kirim Refleksi & Lihat Nilai ' + (A.punyaResmi ? 'Latihan' : 'Resmi') + ' →'}</button>`;
  const upd = () => {
    const n = Object.keys(jw).length, ok = n === S.length && rasa && teks.trim().length >= 20 && !API.demo;
    $('#pb', m).style.width = Math.round(n / S.length * 100) + '%'; $('#pc', m).textContent = 'Terjawab ' + n + ' dari ' + S.length; $('#cc', m).textContent = Math.min(teks.trim().length, 999) + '/20';
    const k = $('#kirim', m); k.classList.toggle('off', !ok); k.classList.toggle('btn-primary', !!ok); k.classList.toggle('shine', !!ok); $('#lk', m).style.display = ok || API.demo ? 'none' : 'flex';
  };
  $$('.opt[data-q]', m).forEach(b => b.onclick = () => { jw[b.dataset.q] = b.dataset.o; $$('.opt[data-q="' + b.dataset.q + '"]', m).forEach(x => x.classList.toggle('on', x === b)); upd(); });
  $$('.rf-opt', m).forEach(b => b.onclick = () => { rasa = b.dataset.r; $$('.rf-opt', m).forEach(x => x.classList.toggle('on', x === b)); upd(); });
  $('#rt', m).oninput = e => { teks = e.target.value; upd(); };
  const t0 = Date.now(); _timers.push(setInterval(() => { const t = $('#tm', m); if (t) t.textContent = '⏱ ' + mmss(Math.round((Date.now() - t0) / 1000)); }, 1000));
  $('#kirim', m).onclick = async e => {
    const b = e.currentTarget; if (b.classList.contains('off') || sending) return; sending = true; b.textContent = 'Mengirim…'; b.classList.add('off');
    const r = await api('asesmen.kirim', { id: meta.id, jawaban: jw, refleksi: { perasaan: rasa, teks }, durasi: dur() });
    sending = false;
    if (!r.success) { toast(r.message, 'err'); b.textContent = 'Coba kirim lagi'; upd(); return; }
    done(r.data);
  };
  upd(); afterRender(m);
};
Stu.hasil = function (m, ctx, A, R) {
  dropCache(); const meta = A.meta, sum = meta.jenis === 'Sumatif', lulus = R.skor >= 72, d = Stu.data;
  const nama = d ? d.siswa.nama.split(' ')[0] : (Sesi.get() ? Sesi.get().me.nama.split(' ')[0] : '');
  const lab = R.resmi ? 'Nilai Resmi (Percobaan ke-1)' : 'Latihan ke-' + R.nomor + ' (tidak memengaruhi nilai resmi)';
  m.innerHTML = `<div class="hero-card center pop"><span class="badge" style="background:rgba(255,255,255,.2);color:#fff">${R.resmi ? '🏁 Hore! Tantangan Selesai' : '🔁 Latihan Selesai'}</span>
      <h2 class="mt">${lulus ? 'Luar Biasa' : 'Semangat'}, ${esc(nama)}! ${lulus ? '🎉' : '💪'}</h2><p style="opacity:.92">${lulus ? 'Kamu telah membuktikan pemahaman hebat!' : 'Pelajari analisis di bawah, lalu coba lagi.'}</p>
      <div style="display:grid;place-items:center;margin:14px 0"><div class="ring" style="width:170px;height:170px"><svg width="170" height="170"><circle cx="85" cy="85" r="74" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="14"/><circle cx="85" cy="85" r="74" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-dasharray="465" stroke-dashoffset="465" data-ring="${465 * (1 - R.skor / 100)}" style="transition:stroke-dashoffset 1.5s"/></svg><div class="v" style="color:#fff"><div style="font-size:54px;line-height:1">${R.skor}</div><div class="tiny" style="letter-spacing:.1em">SKOR AKHIR</div></div></div></div>
      <span class="badge" style="background:#fff;color:var(--primary-d)">✓ ${lab}</span>
      ${sum && R.resmi ? `<div class="mt"><span class="badge ${lulus ? 'b-green' : 'b-red'}" style="font-size:14px;padding:6px 18px">${lulus ? 'TUNTAS (≥72) — Hebat Sekali!' : 'Belum Tuntas (<72) — remedial bersama gurumu'}</span></div>` : ''}</div>
    <div class="grid g3 mt" style="gap:10px">${[['⏱', mmss(R.durasi), 'Durasi Tes'], ['✅', R.benar + '/' + R.total, 'Soal Benar'], ['🎖️', '+' + R.xp, 'XP Diperoleh']].map(x => `<div class="card center" style="padding:14px"><div style="font-size:24px">${x[0]}</div><b style="font:800 24px var(--ff-h)">${x[1]}</b><div class="small muted">${x[2]}</div></div>`).join('')}</div>
    ${R.tuntasBab ? '<div class="card mt center" style="background:#e9f9e4;border-color:var(--green)"><b>🏅 Bab 2 tuntas! Semua aktivitas kini terbuka untuk dipelajari ulang.</b></div>' : ''}
    ${R.pengayaan ? `<div class="card warm mt"><span class="badge b-warm">PENGAYAAN PILIHAN</span> <span class="small muted">⏱ ${R.pengayaan.menit} mnt</span><h3 class="mt">${esc(R.pengayaan.judul)}</h3><p class="muted small">${esc(R.pengayaan.ringkas)}</p><div class="col mt" style="gap:8px">${R.pengayaan.poin.map(p => `<div class="row" style="background:#fff;border-radius:12px;padding:8px 12px"><span style="color:var(--green)">✔</span>${esc(p)}</div>`).join('')}</div></div>` : ''}
    <h3 class="mt2">Analisis Jawabanmu</h3><div class="mt">${R.hasil.map(h => `<details class="review" ${h.benar ? '' : 'open'}><summary><span class="badge ${h.benar ? 'b-ok' : 'b-red'}">${h.benar ? '✓ Benar' : '✕ Perlu dievaluasi'}</span><span>${h.no}. ${esc(h.topik)}</span></summary><div class="inner">${h.kasus ? `<p class="small muted">${esc(h.kasus)}</p>` : ''}<p><b>${rich(h.tanya)}</b></p>
      <div class="mt">${['A', 'B', 'C', 'D'].map(k => `<div class="opt ${k === h.kunci ? 'ok' : k === h.jawab ? 'bad' : ''}" style="margin-bottom:6px;padding:10px 12px"><span class="dot">${k}</span><span>${esc(h.opsi[k])} ${k === h.kunci ? '<b>(kunci)</b>' : k === h.jawab ? '<b>(pilihanmu)</b>' : ''}</span></div>`).join('')}</div>
      <div class="card warm mt small"><b>Analisis:</b> ${esc(h.analisis)}</div></div></details>`).join('')}</div>
    <div class="col mt2">${R.selanjutnya ? `<a class="btn btn-primary btn-lg shine pulse-glow" href="${ctx.base}/akt/${R.selanjutnya.id}">Lanjut: ${esc(R.selanjutnya.judul)} →</a>` : ''}<a class="btn btn-green" href="${ctx.base}/akt/${meta.id}" id="ulang">↻ Coba Latihan Ulang (Bebas Beban)</a><a class="btn btn-ghost" href="${ctx.base}/nilai">Lihat Nilai & Riwayat</a></div>`;
  $('#ulang', m).onclick = e => { e.preventDefault(); Views.sAkt($('#app'), ctx); };
  scrollTo(0, 0); Stu.animRings(m); afterRender(m); if (lulus) Confetti.go(R.resmi ? 160 : 70);
};
