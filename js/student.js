// ===== Tampilan SISWA (mobile-first, bottom nav → sidebar di layar lebar) =====
const Stu = { data: null };
const JI = { Materi: '📖', Lab: '🧪', Kegiatan: '🧩', Formatif: '📝', Sumatif: '🏆' };
const JN = { Materi: 'Materi', Lab: 'Lab Simulasi', Kegiatan: 'Kegiatan', Formatif: 'Asesmen Formatif', Sumatif: 'Asesmen Sumatif' };

Stu.shell = function (el, ctx, o) {
  const s = Sesi.get(), nama = API.demo ? 'Siswa Tamu' : (s ? s.me.nama : '');
  const nav = [['beranda', '🏠', 'Beranda'], ['peta', '🧭', 'Peta Belajar'], ['nilai', '✅', 'Nilai & Riwayat'], ['profil', '👤', 'Profil']];
  el.innerHTML = (API.demo ? `<div class="preview-bar">👀 Mode Pratinjau — data contoh, tidak bisa diubah <a href="#/masuk">Masuk</a> <a href="#/">Keluar</a></div>` : '') +
    `<header class="s-top"><div class="in">${o.back ? `<a class="back" href="${o.back}" aria-label="Kembali">←</a>` : `<img src="assets/img/logo.svg" width="40" height="40" alt="">`}
      <div class="grow" style="min-width:0"><h4 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(o.title || 'Dunia Digital Aman')}</h4><div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(o.sub || 'Koding & KA · Kelas VII · Fase D')}</div></div>
      ${sfxBtn()}<a class="avatar-sm" href="${ctx.base}/profil" title="${esc(nama)}">${nama ? esc(initials(nama)) : '🙂'}</a></div></header>
    <main class="s-main" id="sm"></main>
    <nav class="s-nav">${nav.map(n => `<a href="${ctx.base}/${n[0]}" class="${o.tab === n[0] ? 'on' : ''}"><span class="i">${n[1]}</span>${n[2]}</a>`).join('')}</nav>`;
  Stu.cur = { m: $('#sm', el), base: ctx.base };
  return Stu.cur.m;
};
Stu.skeleton = '<div class="skeleton"></div><div class="skeleton" style="height:140px"></div><div class="skeleton"></div>';
Stu.errCard = base => `<div class="card center pop"><div style="font-size:48px">😕</div><h3>Belum bisa memuat</h3><p class="muted mt">Server sedang lambat atau koneksi terputus. Data belajarmu aman.</p><div class="row mt2" style="justify-content:center"><button class="btn btn-primary" onclick="window.refresh()">↻ Coba lagi</button><a class="btn btn-ghost" href="${base}/beranda">Ke Beranda</a></div></div>`;
Stu.load = function (cb, onErr) {
  const cur = Stu.cur, ee = onErr; onErr = e => { if (cur && cur.m.isConnected) cur.m.innerHTML = Stu.errCard(cur.base); ee && ee(e); };
  swr('siswa.beranda', {}, (d, cached, r) => { if (!d) { toast((r && r.message) || 'Gagal memuat', 'err'); onErr && onErr(); return; } Stu.data = d; try { cb(d, cached); } catch (e) { console.error(e); onErr && onErr(e); } }, 15000);
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
      <div class="hr" style="background:rgba(255,255,255,.25)"></div><div class="small" style="opacity:.95;line-height:1.6">📚 ${esc(PV.bab.mapel)} · Kelas ${esc(PV.bab.kelas)} · Fase ${esc(PV.bab.fase)}<br>👩‍🏫 Guru: ${esc(PV.bab.guru)}</div><div class="hr" style="background:rgba(255,255,255,.25)"></div><div class="row between wrap"><span id="juara-mini">🏆 Juara sementara: <b>memuat…</b></span><span class="badge" style="background:#fff;color:var(--primary-d)">Bab 2: ${d.progres.persen}% Tuntas</span></div></div>
    <div class="mt">${Stu.identitas(PV.bab, false)}</div>
    ${d.bukaGuru ? `<div class="card warm mt fadeup"><div class="row" style="align-items:flex-start"><div class="icon-circle">🔓</div><div><span class="badge">Akses Dibuka Guru 🔓</span> <span class="small muted">${waktu(d.bukaGuru.waktu)}</span><p class="mt"><b>${esc(d.bukaGuru.oleh)}</b> telah membuka akses <b>${esc(d.bukaGuru.aktivitas.slice(0, 2).join(', '))}${d.bukaGuru.aktivitas.length > 2 ? ' dan lainnya' : ''}</b>. ${esc(d.bukaGuru.alasan)} Silakan lanjutkan belajar!</p><span class="badge b-ok mt">🛡️ Nilai tetap dihitung murni dari hasil pengerjaanmu</span></div></div></div>` : ''}
    ${d.tuntasBab ? `<div class="card mt" style="background:#e9f9e4;border-color:var(--green)"><div class="row"><div class="icon-circle" style="background:var(--green);color:#fff">🏅</div><div><b>Bab Tuntas — Semua Materi Terbuka untuk Dipelajari Ulang!</b><div class="small muted">Tidak ada lagi gembok. Buka aktivitas mana pun kapan saja.</div></div></div></div>` : ''}
    ${cur ? `<div class="card mt glow"><div class="row"><div class="icon-circle">${cur.ikon}</div><div class="grow"><h3 style="font-size:19px">${esc(cur.judul)}</h3><div class="small muted">${esc(cur.deskripsi)}</div></div><span class="badge">${pct}% Selesai</span></div><div class="bar mt"><i data-w="${pct}%"></i></div></div>
    <div class="row between mt2"><b class="small muted" style="letter-spacing:.08em">ALUR BELAJAR MANDIRI</b><span class="small muted">${cur.selesai} dari ${cur.total} Tuntas</span></div>
    <div class="timeline mt">${cur.aktivitas.map(a => Stu.actCard(a, ctx.base)).join('')}</div>` : ''}
    ${d.sumatif && d.sumatif.status !== 'terkunci' && (!cur || cur.id !== 'SUM') ? `<div class="mt">${Stu.actCard(d.sumatif, ctx.base)}</div>` : ''}
    <div class="card mt2" id="rankc"><h3>🏆 Papan Peringkat</h3><div class="mt" id="rank-box"></div></div>
    <div class="card mt row"><div class="icon-circle">🎧</div><div><b>Koneksi Tetap Stabil?</b><div class="small muted">Bila ada kendala teknis saat lab, lapor ke gurumu. Progresmu tersimpan otomatis.</div></div></div>
    ${nxt ? `<div class="sticky-cta no-print"><a class="btn btn-primary btn-lg shine pulse-glow" style="justify-content:space-between;width:100%;text-align:left" href="${ctx.base}/akt/${nxt.id}"><span>🚀 ${d.progres.persen === 0 ? 'Mulai Petualangan' : 'Lanjutkan'}<br><small style="font-weight:600;opacity:.9">${esc(nxt.judul)}</small></span><span>▶</span></a></div>` : ''}`;
    Stu.lockTap(m); afterRender(m);
    Rank.load($('#rank-box', m)).then(rk => { const j = $('#juara-mini', m); if (!j) return; const e = rk && !rk.kosong && rk.top[0]; j.innerHTML = e ? `🏆 Juara sementara: <b>${esc(e.nama)}</b> (${esc(e.kelas)}) · ${e.rata}` : '🏆 Belum ada juara — jadilah yang pertama!'; });
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
    <div class="mt">${Stu.identitas(d.bab, true)}</div>
    <div class="row between mt2"><h3>Alur Pembelajaran</h3><span class="small muted">Terbuka Bertahap</span></div>
    ${d.subbab.map((s, i) => `<div class="card mt ${s.status === 'berjalan' ? 'warm' : ''} glow rv"><div class="row"><span class="badge ${s.status === 'selesai' ? 'b-ok' : s.status === 'berjalan' ? 'b-amber' : 'b-lock'}">${s.status === 'selesai' ? 'Selesai ✓' : s.status === 'berjalan' ? 'Sedang Dikerjakan' : 'Terkunci 🔒'}</span><span class="small muted">Sub-bab ${i + 1} · ${s.total} Kegiatan</span></div>
      <div class="row mt"><div class="icon-circle" style="width:56px;height:56px;font-size:28px">${s.ikon}</div><div><h4>${esc(s.judul)}</h4><div class="small muted">${esc(s.deskripsi)}</div></div></div>
      ${s.tp ? `<div class="small mt" style="background:var(--lav2);border-radius:12px;padding:8px 12px">🎯 <b>Tujuan:</b> ${esc(s.tp)}</div>` : ''}
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
  const kunciCard = msg => `<div class="card center pop"><div style="font-size:56px">🔒</div><h3>Belum Bisa Dibuka</h3><p class="muted mt">${esc(msg)}</p><a class="btn btn-primary mt" href="${ctx.base}/peta">Kembali ke Peta Belajar</a></div>`;
  const lokal = PV.akt.find(a => a.id === id && ['Materi', 'Lab', 'Kegiatan'].indexOf(a.jenis) >= 0);
  let r;
  if (lokal) {                                   // materi/lab/kegiatan: tampil INSTAN dari berkas lokal
    const semua = Stu.data ? Stu.data.subbab.flatMap(s => s.aktivitas) : [], st = semua.find(a => a.id === id);
    if (st && st.status === 'terkunci') { m.innerHTML = kunciCard('Selesaikan aktivitas sebelumnya dulu ya.'); return; }
    const nx = PV.akt[PV.akt.indexOf(lokal) + 1];
    r = { success: true, data: { meta: { id: lokal.id, sub: lokal.sub, urut: lokal.urut, jenis: lokal.jenis, judul: lokal.judul, menit: lokal.menit }, data: lokal.data, status: 'terbuka', punyaResmi: false, selanjutnya: nx ? { id: nx.id, judul: nx.judul } : null } };
    if (!API.demo) api('aktivitas.baca', { id, ringan: true }).then(x => { if (!x.success && x.code === 'LOCKED' && location.hash.indexOf('/akt/' + id) > 0) { clearTimers(); m.innerHTML = kunciCard(x.message); } });   // server tetap menjaga kunci
  } else {
    r = await api('aktivitas.baca', { id });
    if (!r.success) { m.innerHTML = kunciCard(r.message) + '<div class="center mt"><button class="btn btn-ghost btn-sm" onclick="window.refresh()">↻ Coba lagi</button></div>'; return; }
  }
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
  const head = (step, total, label) => `<div class="card" style="padding:14px"><div class="row between wrap"><span class="badge">${sub.ikon} ${esc(sub.judul)}</span><span class="small muted">⏳ ${label || 'Langkah'} ${step} dari ${total}</span></div><div class="bar mt"><i style="width:${Math.round(step / total * 100)}%"></i></div></div>`;
  if (meta.jenis === 'Materi') Stu.materi(m, A, head, selesai);
  else if (meta.jenis === 'Lab') (A.data.mode === 'tantangan' ? Stu.tantangan : Stu.lab)(m, A, head, selesai);
  else if (meta.jenis === 'Kegiatan') Stu.kegiatan(m, A, head, selesai);
  else if (meta.jenis === 'Sumatif') Stu.tka(m, ctx, A, dur, r2 => Stu.hasil(m, ctx, A, r2));
  else Stu.asesmen(m, ctx, A, dur, r2 => Stu.hasil(m, ctx, A, r2));
};

Stu.kegiatan = function (m, A, head, selesai) {
  const D = A.data, L = D.langkah; let i = 0, ok = false, salah = {};
  const draw = (selesaiSemua) => {
    if (selesaiSemua) { m.innerHTML = head(L.length, L.length) + `<div class="card mt pop" style="background:var(--green-l);border-color:var(--green)"><h2>🎉 Misi Selesai!</h2><p class="mt">${esc(D.penutup)}</p></div><button class="btn btn-primary btn-block btn-lg shine pulse-glow mt2" id="fin">Tandai Selesai & Lanjutkan →</button>`; $('#fin', m).onclick = e => selesai(e.currentTarget); Confetti.go(90); return; }
    const s = L[i];
    m.innerHTML = head(i + 1, L.length) + (i === 0 ? `<div class="card warm mt"><p>${rich(D.narasi)}</p></div>` : '') + `<div class="card mt fadeup"><span class="badge">Tantangan ${i + 1}</span><h3 class="mt" style="font-size:20px">${rich(s.narasi)}</h3><div class="mt">${s.opsi.map((o, k) => `<button class="opt ${ok && o.benar ? 'ok' : ''} ${salah[k] ? 'bad' : ''}" data-k="${k}" ${ok || salah[k] ? 'disabled' : ''}><span class="dot">${ok && o.benar ? '✓' : salah[k] ? '✕' : 'ABC'[k]}</span><span>${esc(o.t)}</span></button>`).join('')}</div><div id="fb"></div></div>`;
    $$('.opt', m).forEach(b => b.onclick = () => {
      const k = +b.dataset.k, o = s.opsi[k];
      if (o.benar) { Sfx.skip = true; Sfx.play('ok'); ok = true; draw(); const fb = $('#fb', m); fb.innerHTML = `<div class="card mt pop" style="background:var(--green-l);border-color:var(--green)">${esc(o.umpan)}</div><button class="btn btn-primary btn-block mt shine" id="nx">${i < L.length - 1 ? 'Tantangan Berikutnya →' : 'Selesaikan Misi 🎉'}</button>`; $('#nx', m).onclick = () => { ok = false; salah = {}; if (i < L.length - 1) { i++; draw(); } else draw(true); }; }
      else { Sfx.skip = true; Sfx.play('bad'); salah[k] = 1; draw(); $('#fb', m).innerHTML = `<div class="card mt shake" style="background:var(--danger-s);border-color:#fca5a5">${esc(o.umpan)} Coba pilihan lain!</div>`; }
    });
  };
  draw();
};

// =====================================================================
//  Bagian bersama: gambar soal, tinjauan jawaban, identitas pelajaran
// =====================================================================
const Soal = {
  teks: [],
  teksHtml(T) {
    return `<div class="tka-teks"><div class="tt-h"><span class="badge">${esc(T.jenis)}</span> <b>${esc(T.judul)}</b></div>${T.bagian.map(b => `${b.label ? `<div class="tt-lab">${esc(b.label)}${b.judul ? ': ' + esc(b.judul) : ''}</div>` : ''}${b.gambar ? `<div class="soal-img"><img src="${esc(b.gambar)}" alt="Gambar pada teks" loading="lazy"></div>` : ''}${b.paragraf.map(p => `<p>${rich(p)}</p>`).join('')}`).join('<hr class="tt-hr">')}</div>`;
  },
  img: g => g ? `<div class="soal-img"><img src="${esc(g)}" alt="Gambar pendukung soal" loading="lazy"></div>` : '',
  jenisLabel: j => ({ PG: 'Pilihan Ganda', PGK: 'Pilihan Ganda Kompleks', KAT: 'Pilihan Ganda Kompleks (Kategori)' }[j || 'PG']),
  badge(h) { return h.kredit === 1 || (h.kredit === undefined && h.benar) ? '<span class="badge b-ok">✓ Benar</span>' : h.kredit > 0 ? `<span class="badge b-amber">◐ Sebagian (${h.kredit})</span>` : '<span class="badge b-red">✕ Perlu dievaluasi</span>'; },
  /** Tinjauan satu soal (dipakai siswa & guru). */
  review(h) {
    const j = h.jenis || 'PG'; let body = '';
    if (j === 'PG') {
      body = ['A', 'B', 'C', 'D'].map(k => `<div class="opt ${k === h.kunci ? 'ok' : k === h.jawab ? 'bad' : ''}" style="margin-bottom:6px;padding:10px 12px"><span class="dot">${k}</span><span class="grow">${esc(h.opsi[k])} ${k === h.kunci ? '<b>(kunci)</b>' : ''}${k === h.jawab ? '<b> (pilihan siswa)</b>' : ''}</span></div>`).join('');
    } else if (j === 'PGK') {
      const js = Array.isArray(h.jawab) ? h.jawab : [];
      body = Object.keys(h.opsi).map(k => { const kunci = h.kunci.indexOf(k) >= 0, pilih = js.indexOf(k) >= 0; return `<div class="opt ${kunci ? 'ok' : pilih ? 'bad' : ''}" style="margin-bottom:6px;padding:10px 12px"><span class="dot">${pilih ? '☑' : '☐'}</span><span class="grow">${esc(h.opsi[k])} ${kunci ? '<b>(jawaban benar)</b>' : ''}${pilih ? '<b> (dipilih)</b>' : ''}</span></div>`; }).join('');
    } else {
      const js = Array.isArray(h.jawab) ? h.jawab : [];
      body = `<div class="tb-wrap"><table class="tb"><thead><tr><th>Pernyataan</th><th>Jawaban siswa</th><th>Kunci</th></tr></thead><tbody>${h.pernyataan.map((p, i) => { const ok = js[i] === h.kunci[i]; return `<tr class="${ok ? '' : 'red'}"><td>${rich(p)}</td><td>${js[i] === null || js[i] === undefined ? '<i class="muted">kosong</i>' : esc(h.kolom[js[i]])} ${ok ? '✓' : '✕'}</td><td><b>${esc(h.kolom[h.kunci[i]])}</b></td></tr>`; }).join('')}</tbody></table></div>`;
    }
    const T = h.teksId ? (Soal.teks || []).find(x => x.id === h.teksId) : null;
    const meta = h.kompetensi ? `<div class="row wrap" style="margin-bottom:8px;gap:6px"><span class="badge">${esc(h.kompetensi)}</span><span class="badge b-warm">Level ${h.level}</span></div>` : '';
    return `${meta}${T ? `<details class="mb"><summary class="small" style="cursor:pointer;font-weight:800;color:var(--primary-d)">📄 Lihat teks bacaan: ${esc(T.judul)}</summary>${Soal.teksHtml(T)}</details>` : ''}${h.kasus ? `<p class="small muted">${rich(h.kasus)}</p>` : ''}${Soal.img(h.gambar)}<p><b>${rich(h.tanya)}</b></p><div class="mt">${body}</div><div class="card warm mt small"><b>Analisis:</b> ${rich(h.analisis)}</div>`;
  }
};
Stu.identitas = function (b, open) {
  b = PV.bab;                                   // identitas selalu dari berkas lokal (tidak bergantung isi Sheet)
  const row = (k, v) => `<div class="idc"><small>${k}</small><b>${esc(v)}</b></div>`;
  return `<details class="card" ${open ? 'open' : ''}><summary style="cursor:pointer;list-style:none"><div class="row between"><div class="row"><span class="icon-circle">🏫</span><div><h3 style="font-size:19px">Identitas Pembelajaran</h3><div class="small muted">${esc(b.mapel)} · Kelas ${esc(b.kelas)} · Fase ${esc(b.fase)}<br>Guru: ${esc(b.guru)}</div></div></div><span class="badge">Lihat / tutup ▾</span></div></summary>
    <div class="idgrid mt">${row('Mata Pelajaran', b.mapel)}${row('Kelas', b.kelas)}${row('Fase', 'Fase ' + b.fase + ' (' + b.jenjang + ')')}${row('Semester', b.semester)}${row('Bab', b.bab + ': ' + b.judul)}${row('Guru Pengampu', b.guru)}</div>
    <div class="mt"><b>🎯 Tujuan Pembelajaran</b><ol class="tp-list">${b.tujuan.map(t => `<li>${esc(t)}</li>`).join('')}</ol></div>
    <div class="card mt" style="background:var(--lav2);padding:14px"><b>📜 Capaian Pembelajaran — Elemen ${esc(b.cp.elemen)}</b><p class="small mt">${esc(b.cp.teks)}</p><div class="tiny muted mt">Sumber: ${esc(b.cp.sumber)}</div></div>
    <div class="row wrap mt"><span class="small muted" style="font-weight:800">KATA KUNCI:</span>${b.kata_kunci.map(k => `<span class="badge">${esc(k)}</span>`).join('')}<span class="small muted" style="font-weight:800;margin-left:8px">PROFIL LULUSAN:</span>${b.profil.map(k => `<span class="badge b-ok">${esc(k)}</span>`).join('')}</div></details>`;
};

// =====================================================================
//  MATERI (gaya buku: judul, paragraf, daftar bernomor, kotak Kamus Pintar / Tech Talk / dst.)
// =====================================================================
Stu.blok = function (b) {
  switch (b.t) {
    case 'p': return `<p>${rich(b.x)}</p>`;
    case 'h': return `<h4 class="sub">${rich(b.x)}</h4>`;
    case 'ul': return `<ul>${b.x.map(i => `<li>${rich(i)}</li>`).join('')}</ul>`;
    case 'ol': return `<ol>${b.x.map(i => `<li>${rich(i)}</li>`).join('')}</ol>`;
    case 'abc': return `<ol class="abc">${b.x.map(i => `<li>${rich(i)}</li>`).join('')}</ol>`;
    case 'kamus': return `<div class="box kamus"><span class="bt">📘 Kamus Pintar</span><div>${rich(b.x)}</div></div>`;
    case 'tech': return `<div class="box tech"><span class="bt">💬 Tech Talk</span><div><b>${rich(b.j)}</b><br>${rich(b.x)}</div></div>`;
    case 'eksplor': return `<div class="box eksplor"><span class="bt">🖥️ Eksplora!</span><div>${rich(b.x)}</div></div>`;
    case 'aktif': return `<div class="box aktif"><span class="bt">📗 Aktivitas Sederhana</span><div><b>${rich(b.j)}</b><p>${rich(b.x)}</p>${b.l.length ? `<ol>${b.l.map(i => `<li>${rich(i)}</li>`).join('')}</ol>` : ''}</div></div>`;
    case 'perc': return `<div class="box perc"><span class="bt">🧪 Percobaan</span><div><b>${rich(b.j)}</b><p>${rich(b.x)}</p><b>Pertanyaan Refleksi:</b><ol>${b.q.map(i => `<li>${rich(i)}</li>`).join('')}</ol></div></div>`;
    case 'tab': return `<div class="tbwrap"><table><caption>${rich(b.c)}</caption><thead><tr>${b.k.map(h => `<th>${rich(h)}</th>`).join('')}</tr></thead><tbody>${b.b.map(r => `<tr>${r.map(c => `<td>${rich(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    case 'video': return `<figure class="vid ${b.short ? 'short' : ''}"><div class="vwrap"><iframe src="https://www.youtube-nocookie.com/embed/${esc(b.id)}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3" title="${esc(b.c)}" loading="lazy" sandbox="allow-scripts allow-same-origin allow-presentation" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><figcaption>🎬 ${rich(b.c)}</figcaption></figure>`;
    case 'fungsi': return `<ol class="abc fsim">${b.items.map((it, i) => `<li><div class="row between wrap" style="gap:8px"><b>${esc(it.judul)}.</b><button class="btn btn-soft btn-sm" data-fsim="${esc(JSON.stringify(it))}">▶ Coba simulasi</button></div><div class="msim hide"></div></li>`).join('')}</ol>`;
    case 'kasus': return `<div class="kasus"><h4 class="sub">🇮🇩 ${rich(b.j)}</h4>${b.items.map(k => `<div class="kcase"><img src="${esc(k.gambar)}" alt="Ilustrasi: ${esc(k.judul)}" loading="lazy"><div><span class="badge ${k.jenis === 'Hoaks' ? 'b-red' : k.jenis === 'Misinformasi' ? 'b-warm' : ''}">${esc(k.jenis)}</span><h4>${rich(k.judul)}</h4><p>${rich(k.cerita)}</p><p><b>Mengapa termasuk ${esc(k.jenis.toLowerCase())}?</b> ${rich(k.mengapa)}</p><p class="cek">🔎 <b>Cara memeriksa:</b> ${rich(k.cek)}</p></div></div>`).join('')}</div>`;
    case 'img': return `<figure><img src="${esc(b.s)}" alt="${esc(b.c)}" loading="lazy"><figcaption>${rich(b.c)}</figcaption></figure>`;
  }
  return '';
};

// ---- simulasi "fungsi mesin pencari": ketik kueri → tekan Cari → contoh hasil ----
Stu.simHasil = h => {
  const lab = '<div class="tiny muted" style="margin-bottom:6px">Contoh tampilan hasil (simulasi)</div>';
  if (h.tipe === 'definisi') return lab + `<div class="sr def"><b style="font-size:20px">${esc(h.kata)}</b> <i class="muted">${esc(h.jenis)}</i><p>${esc(h.arti)}</p><p class="muted small">Contoh: ${esc(h.contoh)}</p></div>`;
  if (h.tipe === 'situs') return lab + h.daftar.map((d, i) => `<div class="sr"><div class="u">${esc(d.url)}</div><b class="jd">${esc(d.judul)}</b><p class="small">${esc(d.ket)}</p></div>`).join('');
  if (h.tipe === 'media') return lab + `<div class="tiles">${h.gambar.map((g, i) => `<div class="tile t${i % 4}"><span>${g[0]}</span><small>${esc(g[1])}</small></div>`).join('')}</div><div class="vrow">${h.video.map(v => `<div class="vtile"><span class="pl">▶</span><div><b class="small">${esc(v[0])}</b><div class="tiny muted">Video · ${esc(v[1])}</div></div></div>`).join('')}</div>`;
  if (h.tipe === 'berita') return lab + h.daftar.map(d => `<div class="sr"><div class="tiny muted">${esc(d.sumber)} · ${esc(d.waktu)}</div><b class="jd">${esc(d.judul)}</b></div>`).join('');
  if (h.tipe === 'peta') return lab + `<svg viewBox="0 0 400 170" class="minimap"><rect width="400" height="170" rx="14" fill="#e8f3e4"/><path d="M0 110 L400 70" stroke="#fff" stroke-width="14"/><path d="M150 0 L210 170" stroke="#fff" stroke-width="12"/><path d="M0 40 L400 140" stroke="#f6f0d8" stroke-width="8"/>${[[120, 80], [250, 58], [320, 118]].map((p, i) => `<g transform="translate(${p[0]},${p[1]})"><path d="M0 0 C-14 -20 -14 -38 0 -38 C14 -38 14 -20 0 0z" fill="#EF4444"/><circle cx="0" cy="-27" r="5" fill="#fff"/><text x="0" y="14" font-size="11" font-weight="800" text-anchor="middle" fill="#22223B">${i + 1}</text></g>`).join('')}<circle cx="190" cy="105" r="9" fill="#5B8DEF" stroke="#fff" stroke-width="3"/></svg><ol class="small" style="margin:8px 0 0 18px">${h.daftar.map(d => `<li>${esc(d[0])} <b>· ${esc(d[1])}</b></li>`).join('')}</ol>`;
  if (h.tipe === 'harga') return lab + `<div class="tb-wrap"><table class="tb small"><thead><tr><th>Toko</th><th>Harga</th><th>Rating</th></tr></thead><tbody>${h.daftar.map((d, i) => `<tr><td>${esc(d[0])}</td><td><b ${i === 2 ? 'style="color:var(--green-d)"' : ''}>${esc(d[1])}</b>${i === 2 ? ' <span class="badge b-ok">termurah</span>' : ''}</td><td>${esc(d[2])}</td></tr>`).join('')}</tbody></table></div>`;
  if (h.tipe === 'tutorial') return lab + `<div class="sr"><div class="vtile" style="margin-bottom:8px"><span class="pl">▶</span><b class="small">Video tutorial: ${esc(h.judul)}</b></div><b>${esc(h.judul)}</b><ol class="small" style="margin:6px 0 0 18px">${h.langkah.map(l => `<li>${esc(l)}</li>`).join('')}</ol></div>`;
  return '';
};
Stu.bindMat = root => $$('[data-fsim]', root).forEach(btn => btn.onclick = () => {
  const it = JSON.parse(btn.dataset.fsim), panel = btn.closest('li').querySelector('.msim');
  if (!panel.classList.contains('hide')) { panel.classList.add('hide'); btn.textContent = '▶ Coba simulasi'; return; }
  btn.textContent = '✕ Tutup simulasi'; panel.classList.remove('hide');
  panel.innerHTML = `<div class="search-box"><span class="qv">🔎 </span><button class="btn btn-green btn-sm" disabled>Cari</button></div><div class="res"></div>`;
  const qv = $('.qv', panel), go = $('.btn', panel), res = $('.res', panel); let i = 0;
  const iv = setInterval(() => { Sfx.play('type'); qv.textContent = '🔎 ' + it.kueri.slice(0, ++i) + (i < it.kueri.length ? '▏' : ''); if (i >= it.kueri.length) { clearInterval(iv); go.disabled = false; go.classList.add('pulse-glow'); } }, 55); _timers.push(iv);
  go.onclick = () => { go.classList.remove('pulse-glow'); res.innerHTML = '<div class="fadeup">' + Stu.simHasil(it.hasil) + '</div>'; };
});
Stu.materi = function (m, A, head, selesai) {
  const P = A.data.halaman; let i = 0;
  const draw = () => {
    const p = P[i];
    m.innerHTML = head(i + 1, P.length, 'Halaman') + `<div class="card warm mt fadeup"><div class="mat-head"><span class="ik float">${p.ikon}</span><h2>${rich(p.judul)}</h2></div><div class="mat">${p.blok.map(Stu.blok).join('')}</div></div>
      <div class="row between mt2"><button class="btn btn-ghost" id="pv" ${i ? '' : 'disabled'}>← Sebelumnya</button><span class="small muted">${i + 1} / ${P.length}</span>${i < P.length - 1 ? '<button class="btn btn-primary shine" id="nx">Lanjut →</button>' : '<button class="btn btn-green shine pulse-glow" id="fin">✓ Selesai Membaca</button>'}</div>`;
    $('#pv', m).onclick = () => { i--; draw(); scrollTo(0, 0); };
    const n = $('#nx', m); if (n) n.onclick = () => { i++; draw(); scrollTo(0, 0); };
    const f = $('#fin', m); if (f) f.onclick = () => selesai(f);
    Stu.bindMat(m); afterRender(m);
  };
  draw();
};

// =====================================================================
//  LAB: 3 simulasi berurutan
// =====================================================================
Stu.lab = function (m, A, head, selesai) {
  const SIMS = A.data.simulasi; let si = 0;
  const run = () => {
    const D = SIMS[si], T = D.tampil, K = D.keputusan, last = si === SIMS.length - 1;
    let sudah = T.tipe !== 'cari', benar = false, cari = false;
    const steps = `<div class="sim-steps">${SIMS.map((_, k) => `<i class="${k < si ? 'done' : k === si ? 'on' : ''}"></i>`).join('')}</div>`;
    const tampil = () => {
      if (T.tipe === 'cari') return `<div class="card mt"><div class="row between"><h3 style="font-size:19px">🔍 Simulasi Mesin Pencari</h3><span class="badge">Lab Mode</span></div>
        <div class="search-box mt"><span>🔎 ${esc(T.kueri)}</span><button class="btn btn-green btn-sm" id="cari" ${cari ? 'disabled' : ''}>Cari</button></div><p class="small muted mt">💡 Tips: ${esc(T.tips)}</p>
        <div class="mt">${cari ? T.hasil.map((h, k) => `<div class="serp ${h.aman ? '' : 'bad'} fadeup" style="animation-delay:${k * 160}ms"><div class="row between wrap"><b class="small" style="color:${h.aman ? 'var(--green-d)' : '#b3125f'}">${h.aman ? '✅' : '⚠️'} ${esc(h.label)}</b><span class="badge ${h.aman ? 'b-ok' : 'b-red'}">Domain ${esc(h.domain)}</span></div><h4 class="mt" style="font-size:17px">${esc(h.judul)}</h4><div class="u ${h.aman ? 'g' : 'r'}">${esc(h.url)}</div><p class="small muted">${esc(h.ringkas)}</p></div>`).join('') : '<div class="center muted small" style="padding:16px">Tekan tombol <b>Cari</b> untuk melihat hasil pencarian…</div>'}</div></div>`;
      if (T.tipe === 'pesan') return `<div class="card mt chat"><div class="row between"><div class="row"><span class="icon-circle" style="background:#d8f5cf">💬</span><b>${esc(T.dari)}</b></div><span class="small muted">${esc(T.jam)}</span></div><div class="bub">${rich(T.isi)}<div class="small mt" style="color:var(--danger);font-weight:700">⚠ ${esc(T.peringatan)}</div></div></div>`;
      if (T.tipe === 'info') return `<div class="info-card mt">${T.gambar ? `<img src="${esc(T.gambar)}" alt="Foto yang beredar">` : ''}<div class="in"><h3 style="font-size:19px">${rich(T.judul)}</h3><p class="mt">${rich(T.isi)}</p><dl class="meta">${T.meta.map(x => `<dt>${esc(x.k)}</dt><dd>${esc(x.v)}</dd>`).join('')}</dl></div></div>`;
      return `<div class="card mt"><h3 style="font-size:19px">📌 ${esc(T.judul)}</h3><p class="mt">${rich(T.isi)}</p></div>`;
    };
    const draw = () => {
      m.innerHTML = head(si + 1, SIMS.length, 'Simulasi') + steps + `
      <div class="card warm mt"><span class="badge b-warm">${esc(D.judul)}</span><div class="row mt" style="align-items:flex-start"><div class="avatar" style="background:var(--grad)">🧑‍🎓</div><div><h3 style="font-size:20px">${esc(D.kasus.judul)}</h3><p class="mt">${rich(D.kasus.narasi)}</p></div></div>
        ${D.kasus.tautan ? `<div class="mt" style="background:#fff;padding:12px 14px;border-radius:14px">💡 Tautan yang beredar: <b style="color:#b3125f;word-break:break-all">${esc(D.kasus.tautan)}</b></div>` : ''}</div>
      ${tampil()}
      ${sudah ? `<div class="card mt fadeup"><h3 style="font-size:19px">Keputusan</h3><p class="muted small mt">${esc(K.tanya)}</p><div class="mt" id="ops">${K.opsi.map(o => `<button class="opt ${benar && o.benar ? 'ok' : ''}" data-id="${o.id}" ${benar ? 'disabled' : ''}><span class="dot">${benar && o.benar ? '✓' : o.id.toUpperCase()}</span><span><b>${esc(o.judul)}</b><br><span class="small muted">${esc(o.ket)}</span></span></button>`).join('')}</div><div id="fb"></div></div>` : ''}
      ${benar ? `<div class="card mt pop" style="background:var(--green-l);border-color:var(--green)"><div class="row"><div class="icon-circle" style="background:#fff">⭐</div><div><h3 style="font-size:20px">${esc(D.sukses.judul)}</h3><span class="badge b-ok">+${D.poin} Poin Literasi Digital</span></div></div><p class="mt">${rich(D.sukses.teks)}</p><div class="mt" style="background:#fff;border-radius:14px;padding:12px 14px">💡 ${esc(D.sukses.tip)}</div></div>
        <button class="btn btn-primary btn-block btn-lg shine pulse-glow mt2" id="fin">${last ? 'Tandai Lab Selesai & Lanjutkan →' : 'Lanjut ke Simulasi ' + (si + 2) + ' dari ' + SIMS.length + ' →'}</button>` : ''}`;
      const c = $('#cari', m); if (c) c.onclick = () => { cari = true; sudah = true; draw(); setTimeout(() => $('#ops', m) && $('#ops', m).scrollIntoView({ behavior: 'smooth', block: 'center' }), 600); };
      $$('.opt[data-id]', m).forEach(b => b.onclick = () => {
        const o = K.opsi.find(x => x.id === b.dataset.id);
        if (o.benar) { Sfx.skip = true; benar = true; draw(); Confetti.go(90); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }
        else { Sfx.skip = true; Sfx.play('bad'); b.classList.add('bad', 'shake'); b.disabled = true; $('#fb', m).innerHTML = `<div class="card mt" style="background:var(--danger-s);border-color:#fca5a5">${esc(D.gagal)}</div>`; }
      });
      const f = $('#fin', m); if (f) f.onclick = () => { if (last) selesai(f); else { si++; run(); scrollTo(0, 0); } };
    };
    draw();
  };
  run();
};


// =====================================================================
//  LAB: TANTANGAN KODE MINI (skenario + aturan logika + Perisai Digital)
// =====================================================================
Stu.tantangan = function (m, A, head, selesai) {
  const D = A.data, SK = D.skenario, N = SK.length, TOT = N + 2;
  let step = 0, shield = 100, pertama = SK.map(() => null), salahIni = {};
  const meter = () => `<div class="shield ${shield < 40 ? 'low' : ''}"><span>🛡️ Perisai Digital</span><div class="bar ${shield < 40 ? 'red' : 'green'}"><i style="width:${shield}%"></i></div><b>${shield}%</b></div>`;
  const tampil = T => T.tipe === 'pesan' ? `<div class="card mt chat"><div class="row between"><div class="row"><span class="icon-circle" style="background:#d8f5cf">💬</span><b>${esc(T.dari)}</b></div></div><div class="bub">${rich(T.isi)}</div></div>` : `<div class="info-card mt"><div class="in"><h3 style="font-size:18px">${rich(T.judul)}</h3><p class="mt">${rich(T.isi)}</p></div></div>`;
  const peta = () => `<details class="card mt"><summary style="cursor:pointer;font-weight:800">🗺️ Peta Keputusan (tambahan tantangan) — ketuk untuk membuka</summary><div class="peta mt">${D.peta.map((n, i) => `<div class="pn"><div class="pq">${i + 1}. ${esc(n.q)}</div><div class="pbr"><span class="b-ya">Ya → ${esc(n.ya)}</span><span class="b-tidak">Tidak → ${esc(n.tidak)}</span></div></div>`).join('<div class="pdn">▼</div>')}</div></details>`;
  const intro = () => {
    step = 0; m.innerHTML = head(1, TOT, 'Tahap') + `<div class="card warm mt"><span class="badge b-warm">🧩 Tantangan Kode Mini</span><h3 class="mt">${esc(D.judul)}</h3><p class="mt">${rich(D.narasi)}</p></div>
      <div class="card mt"><h3 style="font-size:19px">🧠 Aturan Logika</h3><p class="small muted">Gunakan pengetahuanmu tentang literasi dan etika digital. Ingat aturan berikut sebagai “kode” keputusanmu:</p><ol class="mat" style="margin:10px 0 0 22px;line-height:1.8">${D.aturan.map(a => `<li>${rich(a)}</li>`).join('')}</ol></div>
      ${peta()}<div class="card mt">${meter()}<p class="small muted mt">Setiap pilihan yang kurang tepat mengurangi Perisai Digital. Kamu boleh mencoba lagi sampai benar.</p></div>
      <button class="btn btn-primary btn-block btn-lg shine pulse-glow mt2" id="go">▶ Mulai Tantangan (${N} skenario)</button>`;
    $('#go', m).onclick = () => { shield = 100; pertama = SK.map(() => null); scen(0); };
    afterRender(m);
  };
  const scen = i => {
    step = i + 1; const S = SK[i]; let ok = false; salahIni = {};
    const draw = () => {
      m.innerHTML = head(i + 2, TOT, 'Tahap') + `<div class="card mt" style="padding:14px">${meter()}</div>
      <div class="card warm mt"><div class="row"><span class="icon-circle" style="font-size:26px">${S.ikon}</span><div><span class="badge b-warm">Skenario ${i + 1} dari ${N}</span><h3 style="font-size:20px">${esc(S.judul)}</h3></div></div><p class="mt">${esc(S.situasi)}</p></div>${tampil(S.tampil)}
      <div class="card mt"><h3 style="font-size:18px">${esc(S.tanya)}</h3><div class="mt">${S.opsi.map((o, k) => `<button class="opt ${ok && o.benar ? 'ok' : ''} ${salahIni[k] ? 'bad' : ''}" data-k="${k}" ${ok || salahIni[k] ? 'disabled' : ''}><span class="dot">${ok && o.benar ? '✓' : salahIni[k] ? '✕' : 'ABCD'[k]}</span><span>${esc(o.t)}</span></button>`).join('')}</div><div id="fb"></div></div>`;
      $$('.opt', m).forEach(b => b.onclick = () => {
        const k = +b.dataset.k, o = S.opsi[k];
        if (o.benar) { Sfx.skip = true; Sfx.play('ok'); ok = true; if (pertama[i] === null) pertama[i] = true; draw(); const r = D.aturan[S.aturan]; $('#fb', m).innerHTML = `<div class="card mt pop" style="background:var(--green-l);border-color:var(--green)">${esc(o.umpan)}<div class="mt small">🧠 <b>Aturan yang dipakai:</b> ${rich(r)}</div></div><button class="btn btn-primary btn-block mt shine" id="nx">${i < N - 1 ? 'Skenario Berikutnya →' : 'Lihat Refleksi & Evaluasi →'}</button>`; $('#nx', m).onclick = () => { i < N - 1 ? scen(i + 1) : akhir(); scrollTo(0, 0); }; }
        else { Sfx.skip = true; Sfx.play('bad'); salahIni[k] = 1; if (pertama[i] === null) pertama[i] = false; shield = Math.max(0, shield - 15); draw(); $('#fb', m).innerHTML = `<div class="card mt shake" style="background:var(--danger-s);border-color:#fca5a5">${esc(o.umpan)} <b>(−15% Perisai)</b> Coba pilihan lain!</div>`; }
      });
    };
    draw();
  };
  const akhir = () => {
    step = N + 1; const benar = pertama.filter(x => x === true).length, bd = D.badge.find(b => shield >= b[0]);
    m.innerHTML = head(TOT, TOT, 'Tahap') + `<div class="hero-card center pop"><div style="font-size:60px">${bd[1].split(' ')[0]}</div><h2>${esc(bd[1].replace(/^\S+\s/, ''))}</h2><p style="opacity:.92">${esc(bd[2])}</p><div class="mt">${meter().replace('class="shield', 'class="shield on-dark')}</div></div>
      <div class="card mt"><h3 style="font-size:19px">💭 Refleksi dan Evaluasi</h3><p class="muted small">Setiap keputusan membawa dampak. Evaluasi apakah kamu sudah melindungi diri secara digital.</p>
      <div class="mt">${SK.map((s, i) => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--border)"><span>${s.ikon} ${esc(s.judul)}</span><span class="badge ${pertama[i] ? 'b-ok' : 'b-amber'}">${pertama[i] ? '✓ Tepat di percobaan pertama' : '↻ Perlu belajar lagi'}</span></div>`).join('')}</div>
      <p class="mt"><b>${benar} dari ${N}</b> skenario langsung kamu jawab dengan tepat.</p></div>
      <div class="col mt2"><button class="btn btn-primary btn-lg shine pulse-glow" id="fin">Tandai Selesai & Lanjutkan →</button><button class="btn btn-ghost" id="ulang">↻ Ulangi skenario untuk hasil yang lebih baik</button></div>`;
    $('#fin', m).onclick = e => selesai(e.currentTarget); $('#ulang', m).onclick = () => { shield = 100; pertama = SK.map(() => null); intro(); scrollTo(0, 0); }; Confetti.go(70);
  };
  intro();
};

// =====================================================================
//  Refleksi (dipakai asesmen formatif & simulasi TKA)
// =====================================================================
Stu.reflHtml = () => {
  const RS = [['😄', 'Senang'], ['🔥', 'Tertantang'], ['💡', 'Paham'], ['🤝', 'Butuh Guru']];
  return `<div class="row" style="background:var(--lav);border-radius:24px;padding:16px"><div class="icon-circle" style="background:#fff">💭</div><div><b>Tuliskan refleksimu dulu yuk!</b><div class="small" style="color:var(--primary-d)">Refleksi ini melatih sikap tanggapmu dan membuka nilai resmi di akhir.</div></div></div>
    <label class="mt">Bagaimana perasaan & pemahamanmu terkait materi ini?</label><div class="rf-opts">${RS.map(r => `<button class="rf-opt" data-r="${r[1]}"><span class="e">${r[0]}</span>${r[1]}</button>`).join('')}</div>
    <div class="row between mt"><label style="margin:0">Apa hal terpenting yang kamu pelajari?</label><span class="small muted" id="cc">0/20</span></div><textarea id="rt" placeholder="Contoh: Selalu waspada bila ada pesan hadiah mendadak dan tidak membagikan PIN/OTP ke siapapun…"></textarea>`;
};
Stu.reflBind = (root, st, upd) => {
  $$('.rf-opt', root).forEach(b => b.onclick = () => { st.rasa = b.dataset.r; $$('.rf-opt', root).forEach(x => x.classList.toggle('on', x === b)); upd(); });
  $('#rt', root).oninput = e => { st.teks = e.target.value; upd(); };
};

// ---- komponen jawaban bersama (formatif & TKA) ----
Stu.qBody = (q, v) => {
  const j = q.jenis || 'PG'; let h = '';
  if (j === 'PG') h = Object.keys(q.opsi).map(k => `<button class="tka-opt ${v === k ? 'on' : ''}" data-k="${k}"><span class="mk">${k}</span><span>${rich(q.opsi[k])}</span></button>`).join('');
  else if (j === 'PGK') h = Object.keys(q.opsi).map(k => `<button class="tka-opt cb ${v && v.indexOf(k) >= 0 ? 'on' : ''}" data-k="${k}"><span class="mk">${v && v.indexOf(k) >= 0 ? '✓' : ''}</span><span>${rich(q.opsi[k])}</span></button>`).join('');
  else h = `<div class="tb-wrap"><table class="tka-tb"><thead><tr><th>Pernyataan</th>${q.kolom.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${q.pernyataan.map((p, i) => `<tr><td>${rich(p)}</td>${[0, 1].map(c => `<td class="c"><button class="tka-rad ${v && v[i] === c ? 'on' : ''}" data-i="${i}" data-c="${c}" aria-label="${esc(q.kolom[c])}">${v && v[i] === c ? '●' : ''}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return h;
};
Stu.qBind = (root, q, ans, rerender) => {
  const j = q.jenis || 'PG';
  $$('.tka-opt', root).forEach(b => b.onclick = () => { const k = b.dataset.k; if (j === 'PG') ans[q.no] = k; else { const a = (ans[q.no] || []).slice(); const ix = a.indexOf(k); ix >= 0 ? a.splice(ix, 1) : a.push(k); ans[q.no] = a.sort(); } rerender(); });
  $$('.tka-rad', root).forEach(b => b.onclick = () => { const a = (ans[q.no] || q.pernyataan.map(() => null)).slice(); a[+b.dataset.i] = +b.dataset.c; ans[q.no] = a; rerender(); });
};
Stu.qLengkap = (q, v) => { const j = q.jenis || 'PG'; if (v === undefined || v === null) return false; if (j === 'PG') return !!v; if (j === 'PGK') return v.length > 0; return v.length === q.pernyataan.length && v.every(x => x === 0 || x === 1); };

// =====================================================================
//  ASESMEN FORMATIF (semua bentuk soal + refleksi)
// =====================================================================
Stu.asesmen = function (m, ctx, A, dur, done) {
  const S = A.data.soal, meta = A.meta, jw = {}, st = { rasa: '', teks: '' }; let sending = false;
  m.innerHTML = `<div class="card" style="padding:14px"><div class="row between"><div class="row" style="min-width:0"><span class="icon-circle">📝</span><div style="min-width:0"><b style="line-height:1.2;display:block">${esc(meta.judul)}</b><span class="small muted">Penilaian Formatif</span></div></div><span class="badge b-amber" id="tm">⏱ 00:00</span></div>
      <div class="row between mt"><div class="bar grow"><i id="pb" style="width:0"></i></div><span class="badge" id="pc">Terjawab 0 dari ${S.length}</span></div></div>
    ${A.punyaResmi ? `<div class="card mt row" style="background:#e9f9e4;border-color:var(--green)"><span style="font-size:26px">🔁</span><div class="small"><b>Mode Latihan Ulang.</b> Kamu sudah punya Nilai Resmi. Hasil latihan ini <b>tidak mengubah</b> nilai resminya.</div></div>` : `<div class="card mt row" style="background:var(--lav2)"><span style="font-size:26px">⭐</span><div class="small"><b>Pengerjaan pertama = Nilai Resmi.</b> Kerjakan dengan teliti. Setelah itu kamu boleh latihan ulang sepuasnya.</div></div>`}
    ${S.map(q => `<section class="mt2" data-q="${q.no}">${q.kasus ? `<div class="card warm"><div class="row"><span class="icon-circle" style="background:#fff">📖</span><b class="small">Kasus Cerita: ${esc(q.topik)}</b></div><p class="mt">${rich(q.kasus)}</p></div>` : `<div class="small muted" style="font-weight:800;letter-spacing:.05em">SOAL ${q.no} · ${esc(q.topik.toUpperCase())}</div>`}${Soal.img(q.gambar)}
      <div class="card mt" style="padding:16px"><b style="font-size:16px">${q.no}. ${rich(q.tanya)}</b></div><p class="small muted mt">${({ PG: 'Pilih satu jawaban yang paling tepat.', PGK: 'Pilih semua jawaban yang benar.', KAT: 'Tentukan jawaban untuk setiap pernyataan.' })[q.jenis || 'PG']}</p><div class="mt" data-box="${q.no}"></div></section>`).join('')}
    <div class="card mt2">${Stu.reflHtml()}<div class="row mt small muted" id="lk" style="background:var(--lav2);border-radius:14px;padding:12px">🔒 <span>Pilih jawaban kuis dan isi refleksi (minimal 20 karakter) untuk melanjutkan.</span></div></div>
    <button class="btn btn-primary btn-block btn-lg mt2 off" id="kirim">${API.demo ? 'Mode pratinjau — pengiriman dinonaktifkan' : 'Kirim Refleksi & Lihat Nilai ' + (A.punyaResmi ? 'Latihan' : 'Resmi') + ' →'}</button>`;
  const upd = () => {
    const n = S.filter(q => Stu.qLengkap(q, jw[q.no])).length, ok = n === S.length && st.rasa && st.teks.trim().length >= 20 && !API.demo;
    $('#pb', m).style.width = Math.round(n / S.length * 100) + '%'; $('#pc', m).textContent = 'Terjawab ' + n + ' dari ' + S.length; $('#cc', m).textContent = Math.min(st.teks.trim().length, 999) + '/20';
    const k = $('#kirim', m); k.classList.toggle('off', !ok); k.classList.toggle('btn-primary', !!ok); k.classList.toggle('shine', !!ok); $('#lk', m).style.display = ok || API.demo ? 'none' : 'flex';
  };
  const drawQ = q => { const box = $('[data-box="' + q.no + '"]', m); box.innerHTML = Stu.qBody(q, jw[q.no]); Stu.qBind(box, q, jw, () => { drawQ(q); upd(); }); };
  S.forEach(drawQ);
  Stu.reflBind(m, st, upd);
  const t0 = Date.now(); _timers.push(setInterval(() => { const t = $('#tm', m); if (t) t.textContent = '⏱ ' + mmss(Math.round((Date.now() - t0) / 1000)); }, 1000));
  $('#kirim', m).onclick = async e => {
    const b = e.currentTarget; if (b.classList.contains('off') || sending) return; sending = true; b.textContent = 'Mengirim…'; b.classList.add('off');
    const r = await api('asesmen.kirim', { id: meta.id, jawaban: jw, refleksi: { perasaan: st.rasa, teks: st.teks }, durasi: dur() });
    sending = false;
    if (!r.success) { toast(r.message, 'err'); b.textContent = 'Coba kirim lagi'; upd(); return; }
    done(r.data);
  };
  upd(); afterRender(m);
};

// =====================================================================
//  SIMULASI TKA (tampilan ujian berbasis komputer)
// =====================================================================
Stu.tka = function (m, ctx, A, dur, done) {
  const S = A.data.soal, meta = A.meta, MENIT = A.data.waktuMenit || meta.menit || 40, TOTAL = MENIT * 60;
  const ans = {}, ragu = {}, st = { rasa: '', teks: '' }; let cur = 0, fs = 17, endAt = 0, phase = 'intro', tick = null, sending = false, timeUp = false, w5 = false, w1 = false;
  const s = Sesi.get(), d = Stu.data || {}, nama = API.demo ? 'Siswa Tamu' : ((d.siswa && d.siswa.nama) || (s && s.me.nama) || ''), nis = API.demo ? 'CONTOH' : ((d.siswa && d.siswa.nis) || (s && s.me.nis) || ''), kelas = API.demo ? '7A' : ((d.siswa && d.siswa.kelas) || (s && s.me.kelas) || '');
  const bab = (d.bab) || PV.bab;
  document.body.classList.add('tka-mode'); window.onbeforeunload = () => phase === 'exam' ? 'Ujian sedang berlangsung.' : undefined;
  const terjawab = q => Stu.qLengkap(q, ans[q.no]);
  const jumlah = () => S.filter(terjawab).length;
  const bar = (timer) => `<div class="tka-bar"><div class="in"><img src="assets/img/logo.svg" width="38" height="38" alt=""><div class="ttl">SIMULASI TKA · ${esc(bab.mapel.replace(/\s*\(.*\)/, ''))}<small>${esc(meta.judul)} · Bab 2 Kelas VII Fase D</small></div><div class="tka-peserta"><b>${esc(nama)}</b><br>NIS ${esc(nis)} · Kelas ${esc(kelas)}</div>${timer ? `<div class="tka-timer" id="tkat"><div><small>SISA WAKTU</small><span id="tkav">--:--</span></div></div>` : ''}</div></div>`;
  const stopTick = () => { if (tick) { clearInterval(tick); tick = null; } };
  const keluar = () => { stopTick(); window.onbeforeunload = null; document.body.classList.remove('tka-mode'); };
  // ---------- 1. petunjuk ----------
  const intro = () => {
    phase = 'intro';
    m.innerHTML = `<div class="tka">${bar(false)}<div class="tka-center"><div class="tka-card pop"><h2 style="font-size:26px">Petunjuk Pengerjaan</h2>
      <table class="tka-tb mt"><tbody>${[['Nama Peserta', nama], ['NIS / Kelas', nis + ' / ' + kelas], ['Mata Pelajaran', bab.mapel], ['Materi', bab.bab + ': ' + bab.judul], ['Jumlah Soal', S.length + ' soal (' + (A.data.teks || []).length + ' teks bacaan)'], ['Alokasi Waktu', MENIT + ' menit (±' + (Math.round(MENIT / S.length * 10) / 10) + ' menit per soal)']].map(r => `<tr><td style="width:170px;background:#f3f4f8"><b>${r[0]}</b></td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table>
      <div class="card mt2" style="background:var(--lav2);padding:12px 14px"><b>📖 Soal berbasis bacaan.</b> Baca teks dengan teliti, lalu jawab soal tentang isi teks: memahami informasi, menyimpulkan, dan menilai. Satu teks dapat dipakai untuk beberapa soal.</div><h4 class="mt2">Bentuk soal</h4><ol class="tka-rules" style="margin:8px 0 0 20px"><li><b>Pilihan Ganda</b> — pilih <u>satu</u> jawaban yang paling tepat.</li><li><b>Pilihan Ganda Kompleks</b> — pilih <u>semua</u> jawaban yang benar (bisa lebih dari satu).</li><li><b>Pilihan Ganda Kompleks (Kategori)</b> — tentukan setiap pernyataan <i>Benar/Salah</i> atau <i>Sesuai/Tidak Sesuai</i>.</li></ol>
      <h4 class="mt2">Ketentuan</h4><ol class="tka-rules" style="margin:8px 0 0 20px"><li>Waktu berjalan mundur. Saat waktu habis, ujian otomatis diakhiri.</li><li>Soal boleh dilewati dan ditandai <b>Ragu-ragu</b>. Gunakan <b>Daftar Soal</b> untuk berpindah nomor.</li><li><b>Semua soal harus dijawab</b> sebelum jawaban dapat dikirim (kecuali waktu habis). Pilihan ganda kompleks dan kategori dinilai sebagian.</li><li>Pengerjaan pertama menjadi <b>Nilai Resmi</b>. Jangan menutup halaman saat ujian berlangsung.</li><li>Setelah selesai, kamu mengisi refleksi singkat sebelum nilai ditampilkan.</li></ol>
      ${A.punyaResmi ? '<div class="card mt row" style="background:#e9f9e4;border-color:var(--green)"><span style="font-size:24px">🔁</span><div class="small"><b>Mode Latihan Ulang.</b> Hasilnya tidak mengubah nilai resmi.</div></div>' : ''}
      <label class="row mt2" style="color:var(--text);cursor:pointer;font-size:14px"><input type="checkbox" id="ok" style="width:20px;height:20px"> Saya telah membaca petunjuk dan siap mengerjakan.</label>
      <div class="row mt2" style="justify-content:flex-end"><a class="btn btn-ghost" href="${ctx.base}/peta" id="bk">← Kembali</a><button class="btn btn-primary btn-lg off" id="go">▶ Mulai Mengerjakan</button></div></div></div></div>`;
    $('#ok', m).onchange = e => { $('#go', m).classList.toggle('off', !e.target.checked); $('#go', m).classList.toggle('shine', e.target.checked); };
    $('#bk', m).onclick = () => keluar();
    $('#go', m).onclick = e => { if (e.currentTarget.classList.contains('off')) return; endAt = Date.now() + TOTAL * 1000; phase = 'exam'; exam(); startTick(); scrollTo(0, 0); };
  };
  const sisa = () => Math.max(0, Math.round((endAt - Date.now()) / 1000));
  const startTick = () => { tick = setInterval(() => {
      const x = sisa(), v = $('#tkav', m); if (v) { v.textContent = mmss(x); $('#tkat', m).classList.toggle('warn', x <= 300); }
      if (x <= 300 && !w5) { w5 = true; Sfx.play('warn'); toast('Sisa waktu 5 menit ⏰'); } if (x <= 60 && !w1) { w1 = true; Sfx.play('warn'); }
      if (x <= 0) { stopTick(); timeUp = true; phase = 'refleksi'; Sfx.play('alarm'); const lengkap = S.every(q => terjawab(q)); modal(`<h3>⏰ Waktu Habis</h3><p class="mt">${lengkap ? 'Semua soal sudah terjawab.' : 'Jawaban yang sudah kamu isi akan dikumpulkan.'} Lanjutkan dengan mengisi refleksi.</p><div class="mt2" style="text-align:right"><button class="btn btn-primary" id="mo">Lanjut ke Refleksi</button></div>`, () => refl()); $('#mo').onclick = () => $('.modal-x').click(); }
    }, 1000); _timers.push(tick); };
  // ---------- 2. ujian ----------
  const body = q => Stu.qBody(q, ans[q.no]);
  const exam = () => {
    const q = S[cur], j = q.jenis || 'PG', T = q.teksId ? (A.data.teks || []).find(x => x.id === q.teksId) : null;
    const info = { PG: 'Pilih satu jawaban yang paling tepat.', PGK: 'Pilih semua jawaban yang benar (lebih dari satu).', KAT: 'Tentukan jawaban untuk setiap pernyataan.' }[j];
    m.innerHTML = `<div class="tka" style="--fs:${fs}px">${bar(true)}<div class="tka-wrap"><div class="tka-q">
      <div class="tka-qh"><span>Soal nomor ${q.no} dari ${S.length}</span><span class="badge">${Soal.jenisLabel(j)}</span></div>
      <div class="tka-qb ${T ? 'split' : ''}">${T ? `<details class="tka-text" open><summary>📄 Teks bacaan — ${esc(T.judul)}</summary>${Soal.teksHtml(T)}</details>` : ''}<div class="tka-qside">${q.kasus ? `<div class="tka-stim">${rich(q.kasus)}</div>` : ''}${Soal.img(q.gambar)}<p><b>${rich(q.tanya)}</b></p><p class="small muted" style="margin:4px 0 12px;font-size:13px">${info}</p>${body(q)}</div></div>
      <div class="tka-foot"><button class="btn btn-ghost btn-sm" id="pv" ${cur ? '' : 'disabled'}>← Sebelumnya</button><label class="row" style="cursor:pointer;font-weight:800;color:#8a5a00;margin:0"><input type="checkbox" id="rg" style="width:20px;height:20px" ${ragu[q.no] ? 'checked' : ''}> Ragu-ragu</label><button class="btn btn-ghost btn-sm tka-sheet-btn" id="sh">☰ Daftar Soal</button>${cur < S.length - 1 ? '<button class="btn btn-primary btn-sm" id="nx">Selanjutnya →</button>' : '<button class="btn btn-green btn-sm" id="fn">Selesai ✓</button>'}</div></div>
      <aside class="tka-nav" id="nav"><div class="row between"><b>Daftar Soal</b><span class="small muted">${jumlah()}/${S.length} terjawab</span></div><div class="tka-grid">${S.map((x, i) => `<button class="tka-n ${i === cur ? 'cur' : ''} ${ragu[x.no] ? 'ragu' : terjawab(x) ? 'ans' : ''}" data-n="${i}">${x.no}</button>`).join('')}</div>
        <div class="tka-leg"><span><i style="background:var(--green)"></i>Sudah dijawab</span><span><i style="background:var(--amber)"></i>Ragu-ragu</span><span><i style="background:#fff"></i>Belum dijawab</span></div>
        <div class="tka-fs">Ukuran huruf: <button id="fm">A−</button><button id="fp">A+</button></div><button class="btn btn-green btn-block mt2" id="fn2">Selesai & Kirim</button></aside></div></div>`;
    const v = sisa(); $('#tkav', m).textContent = mmss(v); $('#tkat', m).classList.toggle('warn', v <= 300);
    Stu.qBind(m, q, ans, exam);
    $('#rg', m).onchange = e => { e.target.checked ? ragu[q.no] = 1 : delete ragu[q.no]; exam(); };
    $('#pv', m).onclick = () => { cur--; exam(); scrollTo(0, 0); }; const nx = $('#nx', m); if (nx) nx.onclick = () => { cur++; exam(); scrollTo(0, 0); };
    $$('.tka-n', m).forEach(b => b.onclick = () => { cur = +b.dataset.n; exam(); scrollTo(0, 0); });
    $('#sh', m).onclick = () => $('#nav', m).classList.toggle('open');
    $('#fm', m).onclick = () => { fs = Math.max(14, fs - 2); exam(); }; $('#fp', m).onclick = () => { fs = Math.min(24, fs + 2); exam(); };
    const fin = () => { phase = 'konfirmasi'; konfirmasi(); }; const f1 = $('#fn', m); if (f1) f1.onclick = fin; $('#fn2', m).onclick = fin;
  };
  // ---------- 3. konfirmasi ----------
  const konfirmasi = () => {
    const kosong = S.filter(q => !terjawab(q)).map(q => q.no), rg = S.filter(q => ragu[q.no]).map(q => q.no);
    m.innerHTML = `<div class="tka">${bar(true)}<div class="tka-center"><div class="tka-card pop"><h2 style="font-size:24px">Konfirmasi Selesai</h2><p class="muted mt">${kosong.length ? 'Kamu belum bisa mengirim jawaban.' : 'Periksa kembali sebelum mengakhiri ujian. Setelah dilanjutkan, jawaban tidak dapat diubah.'}</p>
      <div class="grid g3 mt" style="gap:10px"><div class="card center" style="padding:14px;background:#e9f9e4"><b style="font:800 30px var(--ff-h);color:var(--green-d)">${jumlah()}</b><div class="small">Terjawab</div></div><div class="card center" style="padding:14px;background:var(--danger-s)"><b style="font:800 30px var(--ff-h);color:var(--danger)">${kosong.length}</b><div class="small">Belum dijawab</div></div><div class="card center" style="padding:14px;background:#fff3c4"><b style="font:800 30px var(--ff-h);color:#8a5a00">${rg.length}</b><div class="small">Ragu-ragu</div></div></div>
      ${kosong.length ? `<div class="card mt" style="background:var(--danger-s);border-color:#fca5a5"><b>⛔ Semua soal harus dijawab dulu.</b><div class="small mt">Ketuk nomor soal untuk langsung menjawabnya:</div><div class="chips mt">${kosong.map(n => `<button class="chip" data-go="${n}">Soal ${n}</button>`).join('')}</div></div>` : ''}${rg.length ? `<p class="mt small"><b>Ragu-ragu:</b> soal ${rg.join(', ')}</p>` : ''}
      <div class="row mt2" style="justify-content:flex-end"><button class="btn ${kosong.length ? 'btn-primary shine' : 'btn-ghost'}" id="bk">← Kembali ke Soal</button>${kosong.length ? '' : '<button class="btn btn-primary btn-lg shine" id="ok">Akhiri & Lanjut ke Refleksi →</button>'}</div></div></div></div>`;
    $('#bk', m).onclick = () => { phase = 'exam'; exam(); }; const ok = $('#ok', m); if (ok) ok.onclick = () => { stopTick(); phase = 'refleksi'; refl(); };
    $$('[data-go]', m).forEach(b => b.onclick = () => { cur = S.findIndex(q => q.no === +b.dataset.go); phase = 'exam'; exam(); scrollTo(0, 0); });
  };
  // ---------- 4. refleksi & kirim ----------
  const refl = () => {
    stopTick(); phase = 'refleksi';
    m.innerHTML = `<div class="tka">${bar(false)}<div class="tka-center"><div class="tka-card pop"><h3>Ujian telah diakhiri ✔</h3><p class="muted small">Terjawab ${jumlah()} dari ${S.length} soal. Isi refleksi untuk mengirim jawaban dan melihat nilaimu.</p><div class="mt">${Stu.reflHtml()}</div>
      <div class="row mt small muted" id="lk" style="background:var(--lav2);border-radius:14px;padding:12px">🔒 <span>Pilih perasaanmu dan isi refleksi (minimal 20 karakter).</span></div>
      <button class="btn btn-primary btn-block btn-lg mt2 off" id="kirim">${API.demo ? 'Mode pratinjau — pengiriman dinonaktifkan' : 'Kirim Jawaban & Lihat Nilai ' + (A.punyaResmi ? 'Latihan' : 'Resmi') + ' →'}</button></div></div></div>`;
    const upd = () => { const ok = st.rasa && st.teks.trim().length >= 20 && !API.demo; $('#cc', m).textContent = Math.min(st.teks.trim().length, 999) + '/20'; const k = $('#kirim', m); k.classList.toggle('off', !ok); k.classList.toggle('btn-primary', !!ok); k.classList.toggle('shine', !!ok); $('#lk', m).style.display = ok || API.demo ? 'none' : 'flex'; };
    Stu.reflBind(m, st, upd); upd();
    $('#kirim', m).onclick = async e => {
      const b = e.currentTarget; if (b.classList.contains('off') || sending) return; sending = true; b.textContent = 'Mengirim…'; b.classList.add('off');
      const jw = {}; S.forEach(q => { if (terjawab(q)) jw[q.no] = ans[q.no]; });
      const r = await api('asesmen.kirim', { id: meta.id, jawaban: jw, refleksi: { perasaan: st.rasa, teks: st.teks }, durasi: timeUp ? TOTAL : Math.min(TOTAL - 20, dur()), waktuHabis: timeUp });
      sending = false;
      if (!r.success) { toast(r.message, 'err'); b.textContent = 'Coba kirim lagi'; b.classList.remove('off'); return; }
      keluar(); done(r.data);
    };
  };
  intro();
};

// =====================================================================
//  HASIL
// =====================================================================
Stu.hasil = function (m, ctx, A, R) {
  dropCache(); document.body.classList.remove('tka-mode'); window.onbeforeunload = null; Soal.teks = R.teks || [];
  const meta = A.meta, sum = meta.jenis === 'Sumatif', lulus = R.skor >= 72, d = Stu.data;
  const nama = d ? d.siswa.nama.split(' ')[0] : (Sesi.get() ? Sesi.get().me.nama.split(' ')[0] : '');
  const lab = R.resmi ? 'Nilai Resmi (Percobaan ke-1)' : 'Latihan ke-' + R.nomor + ' (tidak memengaruhi nilai resmi)';
  m.innerHTML = `<div class="hero-card center pop"><span class="badge" style="background:rgba(255,255,255,.2);color:#fff">${R.resmi ? '🏁 Hore! Tantangan Selesai' : '🔁 Latihan Selesai'}</span>
      <h2 class="mt">${lulus ? 'Luar Biasa' : 'Semangat'}, ${esc(nama)}! ${lulus ? '🎉' : '💪'}</h2><p style="opacity:.92">${lulus ? 'Kamu telah membuktikan pemahaman hebat!' : 'Pelajari analisis di bawah, lalu coba lagi.'}</p>
      <div style="display:grid;place-items:center;margin:14px 0"><div class="ring" style="width:170px;height:170px"><svg width="170" height="170"><circle cx="85" cy="85" r="74" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="14"/><circle cx="85" cy="85" r="74" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-dasharray="465" stroke-dashoffset="465" data-ring="${465 * (1 - R.skor / 100)}" style="transition:stroke-dashoffset 1.5s"/></svg><div class="v" style="color:#fff"><div style="font-size:54px;line-height:1">${R.skor}</div><div class="tiny" style="letter-spacing:.1em">SKOR AKHIR</div></div></div></div>
      <span class="badge" style="background:#fff;color:var(--primary-d)">✓ ${lab}</span>
      ${sum && R.resmi ? `<div class="mt"><span class="badge ${lulus ? 'b-green' : 'b-red'}" style="font-size:14px;padding:6px 18px">${lulus ? 'TUNTAS (≥72) — Hebat Sekali!' : 'Belum Tuntas (<72) — remedial bersama gurumu'}</span></div>` : ''}</div>
    <div class="grid g3 mt" style="gap:10px">${[['⏱', mmss(R.durasi), 'Durasi Tes'], ['✅', R.benar + '/' + R.total, 'Skor Soal'], ['🎖️', '+' + R.xp, 'XP Diperoleh']].map(x => `<div class="card center" style="padding:14px"><div style="font-size:24px">${x[0]}</div><b style="font:800 24px var(--ff-h)">${x[1]}</b><div class="small muted">${x[2]}</div></div>`).join('')}</div>
    ${R.tuntasBab ? '<div class="card mt center" style="background:#e9f9e4;border-color:var(--green)"><b>🏅 Bab 2 tuntas! Semua aktivitas kini terbuka untuk dipelajari ulang.</b></div>' : ''}
    ${R.pengayaan ? `<div class="card warm mt"><span class="badge b-warm">PENGAYAAN PILIHAN</span> <span class="small muted">⏱ ${R.pengayaan.menit} mnt</span><h3 class="mt">${esc(R.pengayaan.judul)}</h3><p class="muted small">${esc(R.pengayaan.ringkas)}</p><div class="mat mt"><ul>${R.pengayaan.poin.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div></div>` : ''}
    <h3 class="mt2">Analisis Jawabanmu</h3><div class="mt">${R.hasil.map(h => `<details class="review" ${h.benar ? '' : 'open'}><summary>${Soal.badge(h)}<span>${h.no}. ${esc(h.topik)}</span></summary><div class="inner">${Soal.review(h)}</div></details>`).join('')}</div>
    <div class="col mt2">${R.selanjutnya ? `<a class="btn btn-primary btn-lg shine pulse-glow" href="${ctx.base}/akt/${R.selanjutnya.id}">Lanjut: ${esc(R.selanjutnya.judul)} →</a>` : ''}<a class="btn btn-green" href="${ctx.base}/akt/${meta.id}" id="ulang">↻ Coba Latihan Ulang (Bebas Beban)</a><a class="btn btn-ghost" href="${ctx.base}/nilai">Lihat Nilai & Riwayat</a></div>`;
  $('#ulang', m).onclick = e => { e.preventDefault(); Views.sAkt($('#app'), ctx); };
  scrollTo(0, 0); Stu.animRings(m); afterRender(m); if (lulus) Confetti.go(R.resmi ? 160 : 70);
};

// =====================================================================
//  PAPAN PERINGKAT (teaser sebelum ada nilai; otomatis berubah ketika nilai masuk)
// =====================================================================
const Rank = {
  LABEL: ['Asesmen Formatif Sub-bab 1', 'Asesmen Formatif Sub-bab 2', 'Asesmen Formatif Sub-bab 3', 'Asesmen Sumatif (Simulasi TKA)'],
  teaser(masuk) {
    return `<div class="rank-grid"><div><div class="podium"><div class="pod p2 lock"><div class="md">🥈</div><b>Juara 2</b><div class="small muted">menunggu…</div></div><div class="pod p1 lock"><div class="md">🥇</div><b>Juara 1</b><div class="small muted">siapa dia?</div></div><div class="pod p3 lock"><div class="md">🥉</div><b>Juara 3</b><div class="small muted">menunggu…</div></div></div>
      <p class="center small muted mt">Belum ada yang mengerjakan asesmen. Kerjakan asesmenmu dan <b>namamu bisa jadi yang pertama</b> di sini! ✨</p></div>
      <div class="col"><div class="jr kosong"><span class="tr">🏆</span><div><b>Juara Kelas 7A</b><div class="small muted">Belum ada — jadilah yang pertama!</div></div></div><div class="jr kosong"><span class="tr">🏆</span><div><b>Juara Kelas 7B</b><div class="small muted">Belum ada — jadilah yang pertama!</div></div></div>
      <div class="best">${Rank.LABEL.map(l => `<div class="b kosong"><div class="tiny" style="font-weight:800;letter-spacing:.05em">NILAI TERTINGGI</div><b class="small">${l}</b><div class="small">Belum ada yang mengerjakan</div></div>`).join('')}</div></div></div>
      <p class="center small muted mt2">🔒 Demi privasi, nama dan nilai siswa hanya tampil setelah masuk. Tampilan ini otomatis berubah saat nilai pertama masuk.</p>
      ${masuk ? '' : '<div class="center mt"><a class="btn btn-primary shine" href="#/masuk">Masuk untuk melihat peringkat ▶</a></div>'}`;
  },
  html(d) {
    if (!d || d.kosong) return Rank.teaser(true);
    const med = ['🥇', '🥈', '🥉'], top = d.top, pod = i => { const e = top[i]; return e ? `<div class="pod p${i + 1}"><div class="md">${med[i]}</div><b>${esc(e.nama)}</b><div class="tiny muted">Kelas ${esc(e.kelas)}</div><div class="sc">${e.rata}</div></div>` : `<div class="pod p${i + 1} lock"><div class="md">${med[i]}</div><b>Juara ${i + 1}</b><div class="small muted">menunggu…</div></div>`; };
    return `<p class="small muted" style="margin-bottom:12px">Peringkat dihitung dari <b>rata-rata nilai resmi</b> asesmen yang sudah dikerjakan (sampai <b>${esc(d.sampai)}</b>). ${d.jumlahBernilai} dari ${d.jumlahSiswa} siswa sudah punya nilai.</p>
      <div class="rank-grid"><div><div class="podium">${pod(1)}${pod(0)}${pod(2)}</div>${top.slice(3).map(e => `<div class="rk"><span class="n">${e.urut}</span><div class="grow"><b>${esc(e.nama)}</b> <span class="small muted">· Kelas ${esc(e.kelas)} · ${e.n} asesmen</span><div class="bar"><i data-w="${e.rata}%"></i></div></div><span class="sc">${e.rata}</span></div>`).join('')}</div>
      <div class="col">${d.juaraKelas.map(j => j.kosong ? `<div class="jr kosong"><span class="tr">🏆</span><div><b>Juara Kelas ${esc(j.kelas)}</b><div class="small muted">Belum ada — jadilah yang pertama!</div></div></div>` : `<div class="jr"><span class="tr">🏆</span><div class="grow"><b>Juara Kelas ${esc(j.kelas)}</b><div>${esc(j.nama)}</div><div class="tiny muted">${j.n} asesmen dikerjakan</div></div><span class="sc" style="font:800 26px var(--ff-h);color:var(--primary-d)">${j.rata}</span></div>`).join('')}
      <div class="best">${d.perAsesmen.map(p => p.kosong ? `<div class="b kosong"><div class="tiny" style="font-weight:800;letter-spacing:.05em">NILAI TERTINGGI</div><b class="small">${esc(p.label)}</b><div class="small">Belum ada yang mengerjakan</div></div>` : `<div class="b"><div class="tiny muted" style="font-weight:800;letter-spacing:.05em">NILAI TERTINGGI</div><b class="small">${esc(p.label)}</b><div class="row between"><span>${esc(p.nama)} <span class="tiny muted">(${esc(p.kelas)})</span></span><b style="font:800 20px var(--ff-h);color:var(--green-d)">${p.skor}</b></div></div>`).join('')}</div></div></div>
      <p class="center tiny muted mt">Nama disingkat demi privasi · Kelas uji coba tidak ikut peringkat.</p>`;
  },
  async load(box) {
    if (!box) return;
    if (!Sesi.get() && !API.demo) { box.innerHTML = Rank.teaser(false); return; }
    box.innerHTML = Rank.teaser(true);
    const r = await api('app.peringkat'); if (!box.isConnected) return;
    box.innerHTML = r.success ? Rank.html(r.data) : Rank.teaser(!!Sesi.get()); afterRender(box);
    return r.success ? r.data : null;
  }
};
