// ===== Dashboard GURU: overview, log jawaban, nilai & rekap, buka kunci, impor =====
const Gur = { kelas: localStorage.getItem('ddd_kelas') || '7A', kelasList: [{ kelas: '7A' }, { kelas: '7B' }, { kelas: '7C' }] };
const STATUS = { TUNTAS: ['b-green', '✓ TUNTAS'], REMEDIAL: ['b-red', '⚠ REMEDIAL (<72)'], SEDANG: ['b-amber', 'Sedang Dikerjakan'], MACET: ['', 'Terkendala'], BELUM: ['b-lock', 'Belum Mulai'] };
const pctBar = (p, cls) => `<div class="bar ${cls || ''}" style="height:8px"><i data-w="${p}%"></i></div>`;

Gur.shell = function (el, ctx, tab, title, extra) {
  const s = Sesi.get(), nama = API.demo ? PV.bab.guru : (s ? s.me.nama : 'Guru');
  const nav = [['overview', '▦', 'Overview Dashboard'], ['log', '🗂', 'Log Aktivitas & Jawaban'], ['nilai', '✅', 'Nilai Resmi & Rekap'], ['kunci', '🔓', 'Buka Kunci Manual'], ['soal', '✍️', 'Bank Soal'], ['impor', '⚙️', 'Impor & Pengaturan']];
  el.innerHTML = (API.demo ? `<div class="preview-bar">👀 Pratinjau Dashboard Guru — data contoh, read-only <a href="#/masuk?t=guru">Masuk Guru</a> <a href="#/">Keluar</a></div>` : '') +
    `<div class="g-shell"><aside class="g-side"><a class="logo" href="#/" style="margin-bottom:6px"><span class="icon-circle" style="background:var(--grad);color:#fff">🎓</span><span>SMP Koding<br><small class="muted" style="font-weight:600;font-size:12px">Portal Guru · Bab 2</small></span></a>
      <div class="topic"><small>MATA PELAJARAN</small><div><b>Koding & Kecerdasan Artifisial</b><div class="tiny muted">Kelas VII · Fase D · Bab 2</div></div></div>
      <nav>${nav.map(n => `<a href="${ctx.base}/${n[0]}" class="${tab === n[0] ? 'on' : ''}"><span>${n[1]}</span>${n[2]}</a>`).join('')}</nav>
      <div class="grow hide-m"></div>
      <div class="topic hide-m" style="background:var(--warm)"><b>🎧 Bantuan Lab</b><div class="small muted">Panduan guru & rubrik</div></div>
      <button class="btn btn-sm hide-m" style="background:var(--danger-s);color:var(--danger)" id="gout">⎋ Keluar Sesi</button></aside>
    <div><div class="g-top no-print"><div class="kelas-tabs" id="kt">${Gur.kelasList.map(k => `<button data-k="${k.kelas}" class="${k.kelas === Gur.kelas ? 'on' : ''}">Kelas ${k.kelas}</button>`).join('')}</div>
      <div class="row">${sfxBtn()}<span class="badge b-ok">● Lab Virtual Aktif</span><button class="btn btn-ghost btn-sm" data-act="lup">🔍</button><div style="text-align:right;line-height:1.2"><b class="small">${esc(nama)}</b><div class="tiny muted">Guru KKA · Kelas VII · Fase D</div></div><span class="avatar-i" style="background:var(--primary);color:#fff">👤</span></div></div>
      <main class="g-main" id="gm"></main></div></div>`;
  $$('#kt button', el).forEach(b => b.onclick = () => { Gur.kelas = b.dataset.k; localStorage.setItem('ddd_kelas', Gur.kelas); window.refresh(); });
  $('#gout', el).onclick = () => { Sesi.clear(); API.demo = false; location.hash = '#/'; };
  $('[data-act=lup]', el).onclick = () => Lup.toggle();
  return $('#gm', el);
};
Gur.setKelas = d => { if (d && d.kelasList && d.kelasList.length) { if (!d.kelasList.some(k => k.kelas === Gur.kelas)) { Gur.kelas = d.kelasList[0].kelas; localStorage.setItem('ddd_kelas', Gur.kelas); } const same = JSON.stringify(d.kelasList.map(k => k.kelas)) === JSON.stringify(Gur.kelasList.map(k => k.kelas)); Gur.kelasList = d.kelasList; if (!same) { const kt = $('#kt'); if (kt) { kt.innerHTML = Gur.kelasList.map(k => `<button data-k="${k.kelas}" class="${k.kelas === Gur.kelas ? 'on' : ''}">Kelas ${k.kelas}</button>`).join(''); $$('#kt button').forEach(b => b.onclick = () => { Gur.kelas = b.dataset.k; localStorage.setItem('ddd_kelas', Gur.kelas); window.refresh(); }); } } } };
Gur.idStrip = () => `<div class="row wrap mt"><span class="badge">📚 ${esc(PV.bab.mapel)}</span><span class="badge">Kelas ${esc(PV.bab.kelas)}</span><span class="badge">Fase ${esc(PV.bab.fase)}</span><span class="badge b-ok">👩‍🏫 ${esc(PV.bab.guru)}</span><span class="badge b-warm">Semester ${esc(PV.bab.semester)}</span></div>`;
Gur.head = (crumb, title, sub, btns) => `<div class="crumb">KKA › Bab 2: Menjelajahi Dunia Digital dengan Aman › <b>${crumb}</b></div><div class="row between wrap" style="align-items:flex-start"><div style="max-width:760px"><h1 style="font-size:34px">${title}</h1>${sub ? `<p class="muted mt">${sub}</p>` : ''}${Gur.idStrip()}</div><div class="row wrap no-print">${btns || ''}</div></div>`;
Gur.err = (m, r) => { m.innerHTML = `<div class="card center"><div style="font-size:48px">😕</div><p class="mt">${esc((r && r.message) || 'Gagal memuat data.')}</p><button class="btn btn-primary mt" onclick="window.refresh()">Coba lagi</button></div>`; };
Gur.load = (m, action, data, cb, age) => { if (!m.dataset.l) { m.innerHTML = Stu.skeleton + Stu.skeleton; m.dataset.l = 1; } swr(action, data, (d, cached, r) => { if (!d) return Gur.err(m, r); Gur.setKelas(d); cb(d); afterRender(m); }, age || 20000); };
Gur.donut = (parts, size) => { const r = size / 2 - 12, c = 2 * Math.PI * r, tot = parts.reduce((a, p) => a + p[0], 0) || 1; let off = 0; return parts.map(p => { const l = p[0] / tot * c, s = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${p[1]}" stroke-width="22" stroke-dasharray="${l} ${c - l}" stroke-dashoffset="${-off}"/>`; off += l; return s; }).join(''); };
Gur.avatar = n => `<span class="avatar-i">${esc(initials(n))}</span>`;
Gur.xlsx = async function (rows, sheet, file) {
  const toCsv = () => { const csv = rows.map(r => r.map(c => '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"').join(',')).join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv' })); a.download = file.replace('.xlsx', '.csv'); a.click(); };
  try {
    if (!window.XLSX) await new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
    const wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(rows); ws['!cols'] = rows[0].map(() => ({ wch: 18 })); XLSX.utils.book_append_sheet(wb, ws, sheet); XLSX.writeFile(wb, file); toast('Excel diunduh ✓', 'ok');
  } catch (e) { toCsv(); toast('Pustaka Excel tidak terjangkau — diunduh sebagai CSV.'); }
};
Gur.badge = s => { const b = STATUS[s.status]; return `<span class="badge ${b[0]}" ${s.status === 'MACET' ? '' : ''}>${s.status === 'MACET' && s.macet ? 'Terkendala di ' + esc(s.macet.jenis) : b[1]}</span>`; };

// ---------------- OVERVIEW ----------------
Views.gOverview = function (el, ctx) {
  const m = Gur.shell(el, ctx, 'overview'); let page = 1, cari = '', filt = 'ALL';
  Gur.load(m, 'guru.overview', { kelas: Gur.kelas }, d => {
    const k = d.kpi, S = d.siswa, PER = 5;
    const dist = d.distribusi, totD = dist.tuntas + dist.remedial + dist.belum || 1;
    m.innerHTML = Gur.head('Ringkasan Nilai & Progres', 'Overview Dashboard Kelas <span class="badge b-ok" style="vertical-align:middle;font-size:12px">● Semester ${esc(PV.bab.semester)}</span>', '',
      `<button class="btn btn-ghost" id="dx">📗 Unduh Excel Rekap</button><button class="btn btn-ghost" id="dp">📄 Unduh PDF Laporan</button>`) + `
    <div class="grid g4 mt">
      <div class="card kpi glow"><small>Total Partisipasi</small><div class="big">${k.total} <span class="small muted" style="font-weight:600">Siswa Terdaftar</span></div><div class="row small"><b>${k.selesaiPenuh}%</b><span class="muted">Selesai Penuh semua modul</span></div></div>
      <div class="card kpi glow"><small>Rerata Formatif Resmi</small><div class="big" style="color:var(--primary)">${k.rerataFormatif === null ? '—' : k.rerataFormatif} <span class="small muted">/ 100</span></div>${k.selisihKKM !== null ? `<span class="badge ${k.selisihKKM >= 0 ? 'b-ok' : 'b-red'}">${k.selisihKKM >= 0 ? '↗ +' : '↘ '}${k.selisihKKM} pts vs Target KKM</span>` : ''}</div>
      <div class="card kpi glow"><small>Nilai Sumatif Resmi</small><div class="big">${k.rerataSumatif === null ? '—' : k.rerataSumatif} <span class="small muted">(KKM: ${k.kkm})</span></div><div class="small"><span style="color:var(--green)">●</span> <b>${k.tuntasN} dari ${k.total}</b> Tuntas</div></div>
      <div class="card kpi red glow"><small style="color:var(--danger)">Perlu Perhatian Khusus</small><div class="big">${k.perhatian.n} <span class="small">Siswa</span></div><div class="small">🔒 ${k.perhatian.macet} Terkendala · ${k.perhatian.remedial} Nilai &lt; ${k.kkm}</div></div></div>
    <div class="grid mt2" style="grid-template-columns:1.6fr 1fr">
      <div class="card"><div class="row between wrap"><h3>📊 Performa & Nilai Antar Sub-bab</h3><span class="badge b-red">Target KKM: ${k.kkm}</span></div><p class="small muted">Capaian rata-rata formatif dan asesmen sumatif resmi untuk Kelas ${d.kelas}.</p>
        ${d.subbab.map((s, i) => `<div class="mt2"><div class="row between"><span class="row"><span class="badge">${i + 1}</span><b>${esc(s.judul)}</b></span><span class="small">Selesai: <b>${s.selesaiPct}%</b> &nbsp; <b style="color:var(--primary)">${s.rata === null ? '—' : s.rata}</b></span></div><div class="hbar"><div class="bar"><i data-w="${s.rata || 0}%"></i></div><span class="kkm" style="left:${k.kkm}%"></span></div></div>`).join('')}
        <div class="card warm" style="padding:14px"><div class="row between"><b>⭐ Asesmen Sumatif Bab 2 (Resmi)</b><span class="small">Tuntas: <b style="color:var(--green-d)">${d.sumatif.tuntasPct}%</b> &nbsp; <b style="color:var(--primary)">${d.sumatif.rata === null ? '—' : d.sumatif.rata}</b></span></div><div class="hbar" style="margin-bottom:0"><div class="bar"><i data-w="${d.sumatif.rata || 0}%"></i></div><span class="kkm" style="left:${k.kkm}%"></span></div></div></div>
      <div class="card"><div class="row between"><h3>◔ Distribusi Kelulusan</h3><span class="badge b-ok">N = ${k.total}</span></div><p class="small muted">Proporsi kelulusan KKM ${k.kkm} dan status pengerjaan.</p>
        <div class="row mt wrap" style="background:var(--lav2);border-radius:20px;padding:14px"><div class="ring" style="width:150px;height:150px"><svg width="150" height="150" viewBox="0 0 150 150">${Gur.donut([[dist.tuntas, '#5FA052'], [dist.remedial, '#EF4444'], [dist.belum, '#B0B0C3']], 150)}</svg><div class="v"><div style="font-size:26px;color:var(--green-d)">${Math.round(dist.tuntas / totD * 100)}%</div><div class="tiny muted">Tuntas</div></div></div>
          <div class="col grow" style="gap:8px"><div class="card" style="padding:10px"><span style="color:#5FA052">●</span> <b>${dist.tuntas} Siswa (Tuntas)</b><div class="tiny muted">Nilai Sumatif ≥ ${k.kkm}</div></div><div class="card" style="padding:10px;background:var(--danger-s)"><span style="color:#EF4444">●</span> <b>${dist.remedial} Siswa (Remedial)</b><div class="tiny muted">Nilai &lt; ${k.kkm}</div></div>${dist.belum ? `<div class="card" style="padding:10px"><span style="color:#B0B0C3">●</span> <b>${dist.belum} Belum sumatif</b></div>` : ''}</div></div>
        <div class="small muted mt2" style="font-weight:800;letter-spacing:.06em">RINCIAN KOMPONEN AKTIVITAS</div><div class="grid g3 mt" style="gap:8px">${[['Materi & Bacaan', d.komponen.materi, 'var(--green-d)', 'var(--lav2)'], ['Lab Simulasi', d.komponen.lab, 'var(--green-d)', 'var(--warm)'], ['Refleksi Terisi', d.komponen.refleksi, 'var(--primary)', 'var(--lav2)']].map(c => `<div class="center" style="background:${c[3]};border-radius:14px;padding:12px 4px"><b style="font:800 24px var(--ff-h);color:${c[2]}" data-count="${c[1]}" data-suf="%">0%</b><div class="tiny muted">${c[0]}</div></div>`).join('')}</div></div></div>
    <div class="card mt2"><h3>📋 Daftar Progres Siswa & Aksi Cepat Buka Kunci</h3><p class="small muted">Rekapitulasi nilai formatif sub-bab, nilai asesmen sumatif resmi, serta kontrol intervensi manual guru.</p>
      <div class="row wrap mt no-print"><input id="q" placeholder="🔎 Cari nama siswa atau NIS…" style="max-width:300px"><select id="fs" style="max-width:220px"><option value="ALL">Filter: Semua Status</option><option value="REMEDIAL">Remedial (&lt;72)</option><option value="MACET">Terkendala</option><option value="SEDANG">Sedang Dikerjakan</option><option value="TUNTAS">Tuntas</option></select><span class="badge b-red">● Merah = Nilai &lt; ${k.kkm} (Perlu Remedial)</span></div>
      <div class="tb-wrap mt"><table class="tb"><thead><tr><th>NIS & Nama Siswa</th><th>Progres Bab</th><th class="num">Sub 1</th><th class="num">Sub 2</th><th class="num">Sub 3</th><th class="num">Rerata Formatif</th><th class="num">Sumatif Resmi</th><th>Status</th><th>Aksi Cepat</th></tr></thead><tbody id="tb"></tbody></table></div>
      <div class="row between wrap mt"><span class="small muted" id="ft"></span><div class="pager no-print" id="pg"></div></div></div>`;
    const draw = () => {
      let L = S.filter(s => (filt === 'ALL' || s.status === filt) && (!cari || (s.nama + ' ' + s.nis).toLowerCase().includes(cari)));
      const pages = Math.max(1, Math.ceil(L.length / PER)); page = Math.min(page, pages);
      $('#tb', m).innerHTML = L.slice((page - 1) * PER, page * PER).map(s => `<tr class="${s.status === 'REMEDIAL' ? 'red' : ''}"><td><div class="row">${Gur.avatar(s.nama)}<div><b>${esc(s.nama)}</b><div class="tiny muted">NIS: ${esc(s.nis)}</div></div></div></td>
        <td style="min-width:150px"><div class="row between tiny"><b>${s.progres}%</b><span class="${s.progres === 100 ? '' : 'muted'}" style="${s.progres === 100 ? 'color:var(--green-d)' : ''}">${s.progres === 100 ? 'Tuntas' : s.macet ? esc(s.macet.jenis) + ' Stuck' : esc(s.fase)}</span></div>${pctBar(s.progres, s.progres === 100 ? 'green' : s.macet ? '' : 'amber')}</td>
        ${[0, 1, 2].map(i => `<td class="num">${s.sub[i] === null ? '-' : s.sub[i]}</td>`).join('')}<td class="num" style="color:var(--primary)">${s.rata === null ? '-' : s.rata.toFixed(1)}</td>
        <td class="num">${s.sumatif === null ? '<span class="muted small">🔒 Terkunci</span>' : s.sumatif < k.kkm ? `<span class="cell-red">${s.sumatif}</span>` : `<b style="font-size:18px">${s.sumatif}</b>`}</td><td>${Gur.badge(s)}</td>
        <td>${s.status === 'TUNTAS' || s.status === 'REMEDIAL' ? `<a class="btn btn-soft btn-sm" href="${ctx.base}/log?siswa=${s.id}">🗂 Log & Jawaban</a>` : `<a class="btn btn-primary btn-sm" href="${ctx.base}/kunci?siswa=${s.id}">🔓 Buka Kunci</a>`}</td></tr>`).join('') || '<tr><td colspan="9" class="center muted">Tidak ada siswa yang cocok.</td></tr>';
      $('#ft', m).innerHTML = `Menampilkan <b>${Math.min(PER, L.length - (page - 1) * PER)} dari ${L.length} Siswa</b> Kelas ${d.kelas} (status khusus disematkan di atas)`;
      $('#pg', m).innerHTML = Array.from({ length: pages }, (_, i) => `<button class="${i + 1 === page ? 'on' : ''}" data-p="${i + 1}">${i + 1}</button>`).join('');
      $$('#pg button', m).forEach(b => b.onclick = () => { page = +b.dataset.p; draw(); }); $$('#tb .bar i', m).forEach(i => i.style.width = i.dataset.w);
    };
    $('#q', m).oninput = e => { cari = e.target.value.toLowerCase(); page = 1; draw(); }; $('#fs', m).onchange = e => { filt = e.target.value; page = 1; draw(); }; draw();
    $('#dx', m).onclick = () => Gur.xlsx([['NIS', 'Nama', 'Progres %', 'Sub 1', 'Sub 2', 'Sub 3', 'Rerata Formatif', 'Sumatif Resmi', 'Status']].concat(S.map(s => [s.nis, s.nama, s.progres, ...s.sub.map(x => x === null ? '' : x), s.rata === null ? '' : s.rata, s.sumatif === null ? '' : s.sumatif, s.status])), 'Kelas ' + d.kelas, 'Overview-Kelas-' + d.kelas + '.xlsx');
    $('#dp', m).onclick = () => print();
  });
};

// ---------------- LOG AKTIVITAS & JAWABAN ----------------
Views.gLog = function (el, ctx) {
  const m = Gur.shell(el, ctx, 'log'); let st = { siswaId: ctx.q.siswa || '', asesmen: ctx.q.asesmen || '', percobaan: 0 };
  const muat = () => Gur.load(m, 'guru.log', { kelas: Gur.kelas, siswaId: st.siswaId, asesmen: st.asesmen, percobaan: st.percobaan }, d => {
    st.siswaId = d.siswa ? d.siswa.id : ''; st.asesmen = d.pilih; Soal.teks = d.teks || [];
    if (!d.siswa) { m.innerHTML = Gur.head('Log Aktivitas & Jawaban', 'Log Aktivitas & Detail Jawaban', '') + '<div class="card center mt">Belum ada siswa di kelas ini. Tambahkan lewat menu Impor.</div>'; return; }
    const pc = d.pcSel, asm = d.asesmenList.find(a => a.id === d.pilih) || {};
    m.innerHTML = Gur.head('Log Aktivitas', `Log Aktivitas & Detail Jawaban <span class="badge" style="font-size:12px;vertical-align:middle">Siswa: ${esc(d.siswa.nama)} (NIS: ${esc(d.siswa.nis)})</span>`, '', `<a class="btn btn-soft" href="${ctx.base}/overview">← Kembali ke Overview</a><button class="btn btn-primary" onclick="print()">📄 Unduh Riwayat (PDF)</button>`) + `
    <div class="card mt"><div class="grid g2"><div><label>PILIH SISWA</label><select id="ss">${d.siswaList.map(s => `<option value="${s.id}" ${s.id === d.siswa.id ? 'selected' : ''}>${esc(s.nama)} (NIS: ${esc(s.nis)})</option>`).join('')}</select></div>
      <div><label>MODUL & ASESMEN KURIKULUM</label><select id="sa">${d.asesmenList.map(a => `<option value="${a.id}" ${a.id === d.pilih ? 'selected' : ''}>${esc(a.judul)}${a.ada ? '' : ' (belum dikerjakan)'}</option>`).join('')}</select></div></div>
      <div class="row wrap mt"><span class="small muted" style="font-weight:800">RIWAYAT PENGERJAAN:</span>${d.percobaan.length ? d.percobaan.map(p => `<button class="chip ${p.no === d.tampil ? 'on' : ''}" data-pc="${p.no}">${p.no === 0 ? 'Percobaan 1 (Nilai Resmi)' : 'Latihan #' + p.no} · Skor: ${p.skor}</button>`).join('') : '<span class="small muted">Belum ada pengerjaan.</span>'}<span class="badge" style="margin-left:auto">ℹ Nilai resmi diambil murni dari pengerjaan ke-1</span></div></div>
    ${!pc ? '<div class="card center mt2">Siswa belum mengerjakan asesmen ini.</div>' : `
    <div class="grid mt2" style="grid-template-columns:1.7fr 1fr;align-items:start"><div>
      <div class="card"><div class="row between wrap"><div><h3>Analisis Jawaban Soal</h3><div class="small muted">${pc.total} soal pilihan ganda bernarasi</div></div><div class="row wrap"><span class="badge b-ok">✔ Benar: ${pc.benar} / ${pc.total}</span><span class="badge">⏱ ${Math.floor(pc.durasi / 60)}m ${pc.durasi % 60}s</span><span class="badge">📅 ${waktu(pc.waktu)}</span></div></div></div>
      ${d.soal.map(q => `<div class="card mt"><div class="row between wrap"><div class="row"><span class="icon-circle" style="${q.benar ? '' : 'background:var(--danger-s)'}">${q.no}</span><div><b>${esc(q.topik)}</b><div class="tiny muted">${Soal.jenisLabel(q.jenis)}</div></div></div>${Soal.badge(q)}</div><div class="mt">${Soal.review(q)}</div>
        <div class="mt"><label>📝 CATATAN KHUSUS GURU UNTUK SOAL INI</label><div class="row"><input data-cat="${q.no}" value="${esc(q.catatan)}" placeholder="Tulis catatan untuk soal ini…"><button class="btn btn-soft btn-sm" data-sv="${q.no}">Simpan</button></div></div></div>`).join('')}</div>
    <div class="col">
      <div class="card"><div class="row between"><h3 style="font-size:19px">💭 Refleksi Belajar Siswa</h3><span class="badge ${d.refleksi ? 'b-ok' : ''}">${d.refleksi ? '✓ Terisi Lengkap' : 'Kosong'}</span></div>
        ${d.refleksi ? `<div class="row mt small" style="background:var(--lav2);border-radius:12px;padding:8px 12px"><span class="muted" style="font-weight:800">PERASAAN SISWA:</span><span class="badge b-warm">${esc(d.refleksi.perasaan)}</span></div><p class="mt" style="background:var(--lav2);border-radius:14px;padding:12px">“${esc(d.refleksi.isi)}”</p>
        <div class="card warm mt"><div class="row between"><b class="small">Umpan Balik Guru untuk ${esc(d.siswa.nama.split(' ')[0])}</b><span class="tiny" style="color:var(--green-d)">Tampil di portal siswa</span></div><textarea id="fb" class="mt" style="min-height:70px" placeholder="Tulis umpan balik…">${esc(d.refleksi.catatan)}</textarea><button class="btn btn-primary btn-sm mt" id="sfb">➤ Kirim Catatan Guru</button></div>` : '<p class="muted mt">Belum ada refleksi.</p>'}</div>
      <div class="card"><div class="row between"><h3 style="font-size:19px">🕘 Audit Trail Aktivitas</h3></div><div class="tl mt">${d.audit.map(a => `<div class="${a.tipe}"><div class="tiny muted">${waktu(a.waktu)}</div><b class="small">${esc(a.judul)}</b><div class="tiny muted">${esc(a.detail)}</div></div>`).join('') || '<span class="muted small">Belum ada aktivitas.</span>'}</div>
        <a class="btn btn-soft btn-block no-print" href="${ctx.base}/kunci?siswa=${d.siswa.id}">🔓 Buka Kunci Aktivitas Berikutnya Manual</a><p class="tiny muted center mt">Gunakan jika siswa terkendala jaringan saat lab kelas.</p></div></div></div>`}`;
    $('#ss', m).onchange = e => { st.siswaId = e.target.value; st.percobaan = 0; muat(); }; $('#sa', m).onchange = e => { st.asesmen = e.target.value; st.percobaan = 0; muat(); };
    $$('[data-pc]', m).forEach(b => b.onclick = () => { st.percobaan = +b.dataset.pc; muat(); });
    const simpan = async (nomor, teks) => { const r = await api('guru.catatan', { siswaId: d.siswa.id, asesmen: d.pilih, nomor, teks }); toast(r.message, r.success ? 'ok' : 'err'); };
    $$('[data-sv]', m).forEach(b => b.onclick = () => simpan(+b.dataset.sv, $('[data-cat="' + b.dataset.sv + '"]', m).value));
    const f = $('#sfb', m); if (f) f.onclick = () => simpan(0, $('#fb', m).value);
  }, 15000);
  muat();
};

// ---------------- NILAI RESMI & REKAP ----------------
Views.gNilai = function (el, ctx) {
  const m = Gur.shell(el, ctx, 'nilai'); let cari = '', filt = 'ALL', urut = 'nis', page = 1;
  Gur.load(m, 'guru.nilai', { kelas: Gur.kelas }, d => {
    const k = d.kpi, S = d.siswa, PER = 7;
    m.innerHTML = Gur.head('Rekap Nilai Resmi & Laporan', 'Rekap Nilai Resmi & Evaluasi Belajar Siswa', 'Sinkronisasi otomatis pengerjaan evaluasi resmi. Dokumen siap diekspor ke format E-Rapor Dapodik Kurikulum Merdeka.',
      `<div class="col"><button class="btn btn-green" id="dx">📗 Unduh (.xlsx)<br><small style="font-weight:600;opacity:.9">Format Dapodik / E-Rapor</small></button><button class="btn btn-primary" id="dp">📄 Cetak PDF (.pdf)</button></div>`) + `
    <div class="row wrap mt"><span class="badge">Semester ${esc(PV.bab.semester)}</span><span class="badge b-red">◎ Standar Kelulusan KKM: ${k.kkm}</span></div>
    <div class="grid g4 mt">
      <div class="card kpi glow"><small>Rerata Formatif Resmi</small><div class="big">${k.rerataFormatif === null ? '—' : k.rerataFormatif}<span class="small muted"> / 100</span></div>${pctBar(k.rerataFormatif || 0)}</div>
      <div class="card kpi glow"><small>Ketuntasan Sumatif</small><div class="big" style="color:var(--green)">${k.total ? Math.round(k.tuntasN / k.total * 100) : 0}%<span class="small muted"> (${k.tuntasN}/${k.total})</span></div><div class="row"><span class="badge b-ok">${k.tuntasN} Tuntas KKM</span><span class="badge b-red">${k.remedial} Perlu Remedial</span></div></div>
      <div class="card kpi warm glow"><small>Rerata Formatif Bab 2</small><div class="mt">${d.perSub.map((s, i) => `<div class="row between small"><span>Sub ${i + 1}${d.subJudul && d.subJudul[i] ? ' (' + esc(d.subJudul[i].split(' ').slice(0, 2).join(' ')) + ')' : ''}</span><b>${s.rata === null ? '—' : s.rata}</b></div>`).join('')}</div></div>
      <div class="card kpi glow"><small>Jurnal & Refleksi</small><div class="big" style="color:var(--primary)">${k.jurnal}<span class="small muted"> / ${k.jurnalTotal}</span></div>${pctBar(k.jurnalTotal ? Math.round(k.jurnal / k.jurnalTotal * 100) : 0)}</div></div>
    <div class="card mt2"><div class="row wrap no-print"><div class="chips">${Gur.kelasList.map(x => `<button class="chip ${x.kelas === Gur.kelas ? 'on' : ''}" data-kk="${x.kelas}">Kelas ${x.kelas}${x.n ? ' · ' + x.n + ' Siswa' : ''}</button>`).join('')}</div></div>
      <div class="badge mt">ℹ Nilai Resmi diambil dari pengerjaan ke-1 (riwayat latihan tidak menimpa nilai resmi rapor)</div>
      <div class="row wrap mt no-print"><input id="q" placeholder="🔎 Cari nama siswa atau NIS (contoh: 7A-04)" style="max-width:340px"><select id="fs" style="max-width:200px"><option value="ALL">Status: Semua Status</option><option value="TUNTAS">Tuntas</option><option value="REMEDIAL">Remedial</option><option value="SEDANG">Sedang dikerjakan</option><option value="MACET">Terkendala</option><option value="BELUM">Belum mulai</option></select><select id="us" style="max-width:170px"><option value="nis">Urut: NIS</option><option value="nama">Urut: Nama A-Z</option><option value="sumatif">Urut: Sumatif ↓</option></select><button class="btn btn-ghost btn-sm" id="rs">Reset Filter</button></div>
      <div class="row wrap mt small"><b>Indikator Evaluasi:</b><span><span style="color:var(--green)">●</span> Tuntas (Sumatif ≥ ${k.kkm})</span><span><span style="color:var(--danger)">●</span> Perlu Remedial (Sumatif &lt; ${k.kkm})</span><span><span style="color:var(--amber)">●</span> Belum Selesai Seluruh Asesmen</span></div></div>
    <div class="card mt"><div class="row between wrap"><div class="row"><span class="icon-circle">📖</span><div><h3 style="font-size:19px">Buku Rekap Nilai Resmi · Kelas ${d.kelas}</h3><div class="tiny muted">Kurikulum Merdeka Informatika • Modul 2.1 s/d 2.3 & Ujian Komprehensif</div></div></div><span class="small muted">Terakhir disinkronkan: <b style="color:var(--primary)">${waktu(d.sync)}</b></span></div>
      <div class="tb-wrap mt"><table class="tb"><thead><tr><th>No & Nama Siswa</th><th class="num">Sub 1: Mesin Cari</th><th class="num">Sub 2: Literasi</th><th class="num">Sub 3: Keamanan</th><th class="num" style="color:var(--primary)">Rerata Formatif</th><th class="num">Sumatif Resmi (KKM ${k.kkm})</th></tr></thead><tbody id="tb"></tbody></table></div>
      <div class="row between wrap mt"><span class="small">Rerata Formatif: <b>${k.rerataFormatif === null ? '—' : k.rerataFormatif}</b> • Rerata Sumatif: <b>${k.rerataSumatif === null ? '—' : k.rerataSumatif}</b> • <span style="color:var(--green-d)">Tuntas: ${k.tuntasN} Siswa</span> • <span style="color:var(--danger)">Remedial: ${k.remedial} Siswa</span></span><span class="small muted" id="ft"></span><div class="pager no-print" id="pg"></div></div></div>
    <div class="card warm mt2"><div class="row" style="align-items:flex-start"><span class="icon-circle" style="background:#fff">🛡️</span><div><h3 style="font-size:19px">Catatan Protokol Penilaian & Remedial</h3><p class="muted mt small">Rekapitulasi otomatis diselaraskan dengan Google Sheets Master Nilai. Sesuai panduan asesmen Bab 2, pengerjaan pertama tercatat sebagai <b>Nilai Resmi Sumatif</b>. Sesi remedial yang terjadwal akan dicatat sebagai <i>catatan suplemen</i> berpredikat maksimal sesuai KKM (${k.kkm}).</p></div></div></div>`;
    const draw = () => {
      let L = S.filter(s => (filt === 'ALL' || s.status === filt) && (!cari || (s.nama + ' ' + s.nis).toLowerCase().includes(cari)));
      L = L.slice().sort((a, b) => urut === 'nama' ? a.nama.localeCompare(b.nama) : urut === 'sumatif' ? (b.sumatif === null ? -1 : b.sumatif) - (a.sumatif === null ? -1 : a.sumatif) : a.nis.localeCompare(b.nis));
      const pages = Math.max(1, Math.ceil(L.length / PER)); page = Math.min(page, pages);
      $('#tb', m).innerHTML = L.slice((page - 1) * PER, page * PER).map((s, i) => {
        const merah = s.sumatif !== null && s.sumatif < k.kkm, no = (s.nis.split('-').pop() || '').padStart(2, '0');
        return `<tr class="${merah ? 'red' : ''}"><td><div class="row"><span class="avatar-i">${esc(no)}</span><div><b style="${merah ? 'color:var(--danger)' : ''}">${esc(s.nama)}</b><div class="tiny muted">NIS: ${esc(s.nis)}</div></div></div></td>
          ${[0, 1, 2].map(j => `<td class="num" style="${merah && j === 2 && s.sub[2] < 70 ? 'color:var(--danger)' : ''}">${s.sub[j] === null ? '<span class="badge b-amber">Sedang Pengerjaan</span>' : s.sub[j]}</td>`).join('')}
          <td class="num" style="background:#f6f2ff;color:var(--primary)">${s.rata === null ? '-' : s.rata.toFixed(1)}</td><td class="num">${s.sumatif === null ? '<span class="badge b-lock">🔒 Belum Dikerjakan</span>' : merah ? `<span class="cell-red">❗ ${s.sumatif}</span>` : `<span class="cell-ok">${s.sumatif}</span>`}</td></tr>`;
      }).join('') || '<tr><td colspan="6" class="center muted">Tidak ada data.</td></tr>';
      $('#ft', m).textContent = 'Menampilkan ' + Math.min(PER, L.length) + ' dari ' + L.length + ' Siswa';
      $('#pg', m).innerHTML = Array.from({ length: pages }, (_, i) => `<button class="${i + 1 === page ? 'on' : ''}" data-p="${i + 1}">${i + 1}</button>`).join(''); $$('#pg button', m).forEach(b => b.onclick = () => { page = +b.dataset.p; draw(); });
    };
    $('#q', m).oninput = e => { cari = e.target.value.toLowerCase(); page = 1; draw(); }; $('#fs', m).onchange = e => { filt = e.target.value; page = 1; draw(); }; $('#us', m).onchange = e => { urut = e.target.value; draw(); };
    $('#rs', m).onclick = () => { cari = ''; filt = 'ALL'; urut = 'nis'; $('#q', m).value = ''; $('#fs', m).value = 'ALL'; $('#us', m).value = 'nis'; draw(); }; draw();
    $$('[data-kk]', m).forEach(b => b.onclick = () => { Gur.kelas = b.dataset.kk; localStorage.setItem('ddd_kelas', Gur.kelas); window.refresh(); });
    $('#dx', m).onclick = () => Gur.xlsx([['NIS', 'Nama', 'Sub-bab 1', 'Sub-bab 2', 'Sub-bab 3', 'Rerata Formatif Resmi', 'Sumatif Resmi', 'Status']].concat(S.map(s => [s.nis, s.nama, ...s.sub.map(x => x === null ? '' : x), s.rata === null ? '' : s.rata, s.sumatif === null ? '' : s.sumatif, s.status === 'TUNTAS' ? 'Tuntas' : s.status === 'REMEDIAL' ? 'Remedial' : 'Belum selesai'])), 'Rekap ' + d.kelas, 'Rekap-Nilai-Resmi-Kelas-' + d.kelas + '.xlsx');
    $('#dp', m).onclick = () => print();
  });
};

// ---------------- BUKA KUNCI MANUAL ----------------
Views.gKunci = function (el, ctx) {
  const m = Gur.shell(el, ctx, 'kunci'); const F = { mode: 'siswa', siswaId: ctx.q.siswa || '', pilih: new Set(), beruntun: true, kategori: '', alasan: '' }; let filtKelas = 'ALL', cariR = '';
  const KAT = ['Kendala Perangkat / Jaringan', 'Siswa Izin / Sakit', 'Remedial Mandiri', 'Penugasan Khusus'];
  const muat = (keep) => Gur.load(m, 'guru.kunci', { kelas: Gur.kelas, siswaId: F.siswaId }, d => {
    F.siswaId = d.detail ? d.detail.id : ''; if (!keep) F.pilih = new Set(); const dt = d.detail, S = d.stat;
    const grup = d.subbab.concat([{ id: 'SUM', judul: 'Uji Kompetensi Akhir' }]);
    m.innerHTML = Gur.head('Buka Kunci Aktivitas Manual', 'Buka Kunci Aktivitas Manual <span class="badge" style="font-size:12px;vertical-align:middle">🛡 W-19 Admin</span>', 'Intervensi guru untuk membuka akses modul, lab simulasi, atau asesmen yang terkunci berurutan. Pembukaan kunci tidak mengubah nilai resmi dan seluruh riwayat intervensi dicatat ke lembar audit trail.') + `
    <div class="card warm mt"><div class="row"><span class="icon-circle" style="background:#fff">⚖️</span><div><b style="font-size:17px">Aturan Kepatuhan & Integritas Penilaian Siswa</b><div class="small">Pembukaan manual hanya melompati gerbang gembok aktivitas agar siswa dapat melanjutkan belajar. <b>Skor nilai formatif dan sumatif tetap nol</b> hingga siswa menyelesaikan lembar aktivitas, tes kuis, atau simulasi secara valid.</div></div></div></div>
    <div class="grid mt2" style="grid-template-columns:1.6fr 1fr;align-items:start"><div class="card"><div class="row"><span class="icon-circle" style="background:var(--grad);color:#fff">🔓</span><div><h3>Formulir Intervensi Guru</h3><div class="tiny muted" style="font-weight:700">KONFIGURASI HAK AKSES MODUL KHUSUS</div></div></div>
      <div class="hr"></div><label>① PILIH CAKUPAN INTERVENSI</label><div class="tabs"><button data-md="siswa" class="${F.mode === 'siswa' ? 'on' : ''}">👤 Per Siswa (Individual)</button><button data-md="kelas" class="${F.mode === 'kelas' ? 'on' : ''}">👥 Per Kelas (Massal) <span class="badge b-red" style="font-size:10px">Butuh Konfirmasi</span></button></div>
      <label class="mt2">② TENTUKAN KELAS & IDENTITAS SISWA</label><div class="grid g2" style="gap:12px"><div><label>Tingkat Kelas</label><input value="Kelas ${d.kelas} (${d.siswa.length} Siswa)" disabled></div><div ${F.mode === 'kelas' ? 'class="hide"' : ''}><label>Cari Siswa Terkendala</label><select id="sv">${d.siswa.map(s => `<option value="${s.id}" ${s.id === F.siswaId ? 'selected' : ''}>${esc(s.nama)} (NIS: ${esc(s.nis)})${s.macet ? ' ⚠' : ''}</option>`).join('')}</select></div></div>
      ${F.mode === 'siswa' && dt ? `<div class="row mt" style="background:var(--lav2);border-radius:16px;padding:12px">${Gur.avatar(dt.nama)}<div class="grow"><b>${esc(dt.nama)}</b> <span class="badge">NIS: ${esc(dt.nis)}</span><div class="small" style="color:${dt.macet ? 'var(--danger)' : 'var(--text2)'}">${dt.macet ? '🔄 Terkunci di ' + esc(dt.macet.jenis) + ' (' + esc(dt.macet.judul) + ')' : 'Tidak ada kendala terdeteksi'}</div></div><div style="text-align:right"><div class="tiny muted">Progres Bab 2</div><b style="color:var(--primary)">${dt.progres}%</b></div></div>` : F.mode === 'kelas' ? `<div class="card mt" style="background:var(--danger-s);border-color:#fca5a5"><b>⚠ Pembukaan massal untuk seluruh ${d.siswa.length} siswa Kelas ${d.kelas}.</b><div class="small">Akan diminta konfirmasi sebelum disimpan.</div></div>` : ''}
      <label class="mt2">③ PILIH AKTIVITAS YANG INGIN DIBUKA AKSESNYA</label>
      ${grup.map(g => { const L = d.aktivitas.filter(a => a.sub === g.id); return `<div class="small muted mt" style="font-weight:800">${esc(g.judul)}</div>${L.map(a => { const s = F.mode === 'siswa' && dt ? dt.status[a.id] : 'terkunci'; const sel = F.pilih.has(a.id); return `<label class="akt ${s === 'selesai' ? 'selesai' : sel ? 'next' : ''}" style="margin:6px 0;cursor:pointer"><input type="checkbox" data-a="${a.id}" style="width:20px;height:20px;flex:none" ${sel ? 'checked' : ''} ${s === 'selesai' ? 'disabled' : ''}><div class="grow"><b class="small">${JI[a.jenis]} ${esc(a.judul)}</b><div class="tiny muted">${JN[a.jenis]} · ~${a.menit} mnt</div></div>${s === 'selesai' ? '<span class="badge b-ok">Selesai Tuntas</span>' : s === 'terbuka' ? '<span class="badge">Sudah terbuka</span>' : sel ? '<span class="badge b-warm">🔓 Akan Dibuka</span>' : '<span class="badge b-lock">🔒 Terkunci</span>'}</label>`; }).join('')}`; }).join('')}
      <label class="row mt" style="cursor:pointer;font-weight:600;color:var(--text)"><input type="checkbox" id="br" style="width:20px;height:20px;flex:none" ${F.beruntun ? 'checked' : ''}>Buka juga aktivitas berikutnya dalam sub-bab ini secara beruntun jika prasyarat terhubung</label>
      <div class="row between mt2"><label style="margin:0">④ ALASAN PEMBUKAAN KUNCI *</label><span class="tiny" style="color:var(--danger);font-weight:800">Wajib Diisi (Audit Trail)</span></div>
      <div class="chips mt">${KAT.map(k => `<button class="chip ${F.kategori === k ? 'on' : ''}" data-kat="${k}">+ ${k}</button>`).join('')}</div>
      <textarea id="al" class="mt" placeholder="Contoh: Siswa mengalami kendala koneksi internet dan peramban browser tertutup mendadak saat sesi lab di kelas.">${esc(F.alasan)}</textarea><div class="tiny muted mt">Dicatat atas nama autentikasi: <b>${esc(Sesi.get() ? Sesi.get().me.nama : PV.bab.guru)}</b></div>
      <div class="row mt2"><button class="btn btn-primary btn-lg shine grow" id="go">🔓 Buka Kunci Aktivitas Sekarang →</button><button class="btn btn-soft" id="rs">Reset Formulir</button></div></div>
    <div class="col">
      <div class="card kpi glow"><small>Buka Manual Minggu Ini</small><div class="row between"><div class="big">${S.minggu} Kali</div><span class="badge b-ok">Stabil</span></div><div class="tiny muted">${Object.keys(S.perKelas).sort().map(k => k + ': ' + S.perKelas[k]).join(' • ') || 'Belum ada'}</div></div>
      <div class="card kpi glow"><small>Perlu Intervensi (${d.kelas})</small><div class="row between"><div class="big">${S.perluIntervensi.length} Siswa</div>${S.perluIntervensi.length ? '<span class="badge b-red">Perlu Aksi</span>' : '<span class="badge b-ok">Aman</span>'}</div><div class="tiny muted">${esc(S.perluIntervensi.join(', ')) || 'Tidak ada siswa terkendala'}</div></div>
      <div class="card kpi glow"><small>Integritas Sistem Nilai</small><div class="row between"><div class="big" style="color:var(--green-d)">100%</div><span class="badge b-ok">Aman</span></div><div class="tiny muted">0 Bypass Nilai Formatif</div></div>
      <div class="card warm"><h3 style="font-size:18px">💡 Panduan Pelaksanaan Buka Kunci</h3>${[['Sinkronisasi Instan', 'Setiap penekanan tombol tercatat real-time di sheet LogBukaKunci.'], ['Siswa Cukup Refresh Halaman', 'Akses langsung terbuka tanpa siswa perlu logout. Minta siswa menekan F5.'], ['Otomasi Pasca-Asesmen Sumatif', 'Setelah sumatif selesai, seluruh konten menjadi arsip bebas tanpa kunci.']].map((g, i) => `<div class="guide-step mt"><b class="n">${i + 1}</b><div><b class="small">${g[0]}</b><div class="tiny muted">${g[1]}</div></div></div>`).join('')}</div>
      <div class="card"><b class="small">Distribusi Alasan Intervensi Minggu Ini</b>${Object.keys(S.kategori).map(k => `<div class="mt"><div class="row between tiny"><span>${esc(k)}</span><b>${S.kategori[k]}</b></div>${pctBar(Math.round(S.kategori[k] / (S.minggu || 1) * 100))}</div>`).join('') || '<div class="tiny muted mt">Belum ada data.</div>'}</div></div></div>
    <div class="mt2"><h2 style="font-size:26px">📜 Riwayat Audit Trail Pembukaan Kunci Terkini</h2><p class="muted small">Catatan resmi seluruh pembukaan kunci modul untuk pengawasan kepala laboratorium dan kurikulum.</p></div>
    <div class="card mt"><div class="row wrap no-print"><b class="small">Filter Kelas:</b><div class="chips"><button class="chip ${filtKelas === 'ALL' ? 'on' : ''}" data-fk="ALL">Semua Kelas</button>${d.kelasList.map(k => `<button class="chip ${filtKelas === k.kelas ? 'on' : ''}" data-fk="${k.kelas}">Kelas ${k.kelas}</button>`).join('')}</div><input id="cr" placeholder="🔎 Cari nama siswa / guru…" style="max-width:260px;margin-left:auto" value="${esc(cariR)}"><button class="btn btn-soft btn-sm" id="xr">📥 Unduh Rekap (.xlsx)</button></div>
      <div class="tb-wrap mt"><table class="tb"><thead><tr><th>Waktu & Tanggal</th><th>Nama Siswa & Kelas</th><th>Aktivitas Dibuka</th><th>Guru Pengesah</th><th>Alasan Intervensi</th></tr></thead><tbody>${(() => { const R = d.riwayat.filter(r => (filtKelas === 'ALL' || r.kelas === filtKelas) && (!cariR || (r.siswa + r.guru).toLowerCase().includes(cariR))); return R.map(r => `<tr><td><b class="small">${waktu(r.waktu)}</b><div class="tiny muted">${lalu(r.waktu)}</div></td><td><b>${esc(r.siswa)}</b><div class="tiny muted">Kelas ${esc(r.kelas)} · ${esc(r.cakupan)}</div></td><td class="small">${r.aktivitas.map(esc).join('<br>')}</td><td class="small">${esc(r.guru)}</td><td class="small"><span class="badge">${esc(r.kategori)}</span><br>${esc(r.alasan)}</td></tr>`).join('') || '<tr><td colspan="5" class="center muted">Belum ada riwayat.</td></tr>'; })()}</tbody></table></div></div>`;
    $$('[data-md]', m).forEach(b => b.onclick = () => { F.mode = b.dataset.md; F.alasan = $('#al', m).value; muat(true); });
    const sv = $('#sv', m); if (sv) sv.onchange = e => { F.siswaId = e.target.value; F.alasan = $('#al', m).value; muat(true); };
    $$('[data-a]', m).forEach(c => c.onchange = () => { c.checked ? F.pilih.add(c.dataset.a) : F.pilih.delete(c.dataset.a); F.alasan = $('#al', m).value; muat(true); });
    $('#br', m).onchange = e => F.beruntun = e.target.checked; $('#al', m).oninput = e => F.alasan = e.target.value;
    $$('[data-kat]', m).forEach(b => b.onclick = () => { F.kategori = b.dataset.kat; if (!$('#al', m).value.trim()) F.alasan = b.dataset.kat + ': '; else F.alasan = $('#al', m).value; muat(true); });
    $('#rs', m).onclick = () => { F.pilih = new Set(); F.alasan = ''; F.kategori = ''; muat(true); };
    $$('[data-fk]', m).forEach(b => b.onclick = () => { filtKelas = b.dataset.fk; muat(true); }); $('#cr', m).onchange = e => { cariR = e.target.value.toLowerCase(); muat(true); };
    $('#xr', m).onclick = () => Gur.xlsx([['Waktu', 'Siswa', 'Kelas', 'Aktivitas', 'Cakupan', 'Guru', 'Kategori', 'Alasan']].concat(d.riwayat.map(r => [r.waktu, r.siswa, r.kelas, r.aktivitas.join('; '), r.cakupan, r.guru, r.kategori, r.alasan])), 'Audit', 'Audit-Buka-Kunci.xlsx');
    $('#go', m).onclick = async e => {
      F.alasan = $('#al', m).value;
      if (!F.pilih.size) return toast('Pilih minimal satu aktivitas yang ingin dibuka.', 'err');
      if (F.alasan.trim().length < 10) return toast('Alasan wajib diisi (minimal 10 karakter) untuk audit trail.', 'err');
      if (F.mode === 'kelas' && !(await confirmBox('Buka kunci untuk seluruh kelas ' + d.kelas + '?', 'Aktivitas terpilih akan dibuka untuk ' + d.siswa.length + ' siswa. Nilai resmi tidak berubah dan tindakan ini dicatat di audit trail.', 'Ya, buka untuk semua'))) return;
      const b = e.currentTarget; b.disabled = true; b.textContent = 'Menyimpan…';
      const r = await api('guru.kunciBuka', { mode: F.mode, kelas: d.kelas, siswaId: F.siswaId, aktivitas: Array.from(F.pilih), beruntun: F.beruntun, alasan: F.alasan, kategori: F.kategori, konfirmasi: F.mode === 'kelas' });
      if (!r.success) { toast(r.message, 'err'); b.disabled = false; b.textContent = '🔓 Buka Kunci Aktivitas Sekarang →'; return; }
      toast(r.message, 'ok'); Confetti.go(60); dropCache(); F.pilih = new Set(); F.alasan = ''; F.kategori = ''; muat(true);
    };
  }, 5000);
  muat(false);
};

// ---------------- IMPOR & PENGATURAN ----------------
Views.gImpor = function (el, ctx) {
  const m = Gur.shell(el, ctx, 'impor');
  const tabel = (rep) => `<table class="tb mt"><thead><tr><th>Data</th><th class="num">Di sumber</th><th class="num">Ditambah</th><th class="num">Diperbarui</th><th class="num">Dilewati</th></tr></thead><tbody>${Object.keys(rep.laporan).map(k => { const x = rep.laporan[k]; return `<tr><td><b>${k}</b></td><td class="num">${x.sumber}</td><td class="num" style="color:var(--green-d)">${x.inserted}</td><td class="num">${x.updated}</td><td class="num muted">${x.skipped}</td></tr>`; }).join('')}</tbody></table>${(rep.peringatan || []).map(w => `<div class="card warm mt small">⚠ ${esc(w)}</div>`).join('')}`;
  m.innerHTML = Gur.head('Impor & Pengaturan', 'Impor Data & Pengaturan Akun', 'Pindahkan data siswa/nilai dari spreadsheet lama dengan aman (dry-run dulu, aman diulang), tambah siswa lewat CSV, dan ganti kata sandi guru.') + `
  <div class="grid g2 mt2" style="align-items:start">
    <div class="card"><h3>📥 Impor dari Spreadsheet Lama</h3><p class="small muted mt">Spreadsheet lama <b>hanya dibaca</b>, tidak pernah diubah. Gunakan akun Google yang sama. Aman diulang (tanpa data dobel) — jalankan sekali lagi sebelum cutover untuk menangkap data terbaru.</p>
      <label class="mt">URL / ID Spreadsheet lama</label><input id="src" placeholder="https://docs.google.com/spreadsheets/d/…">
      <div class="row wrap mt"><label class="row" style="margin:0;color:var(--text)"><input type="checkbox" class="sh" value="Siswa" checked style="width:18px;height:18px"> Siswa</label><label class="row" style="margin:0;color:var(--text)"><input type="checkbox" class="sh" value="NilaiSubbab" style="width:18px;height:18px"> NilaiSubbab</label><label class="row" style="margin:0;color:var(--text)"><input type="checkbox" class="sh" value="NilaiBab" style="width:18px;height:18px"> NilaiBab</label></div>
      <label class="row mt" style="color:var(--text);cursor:pointer"><input type="checkbox" id="tm" style="width:18px;height:18px"> Timpa data yang sudah ada (nama/kelas/status siswa)</label>
      <div class="row mt2"><button class="btn btn-soft" id="p1">🔍 Pindai (Dry-run)</button><button class="btn btn-primary shine" id="p2">▶ Jalankan Impor</button></div><div id="r1"></div></div>
    <div class="card"><h3>📄 Tambah Siswa via CSV</h3><p class="small muted mt">Tempel data: <code>Nama,Kelas,NIS,KodeAkses</code> (KodeAkses boleh kosong → dibuat otomatis). Satu siswa per baris.</p>
      <textarea id="csv" class="mt" style="min-height:130px" placeholder="Nama,Kelas,NIS,KodeAkses&#10;Anisa Rahma,7A,7A-40&#10;Bima Sakti,7B,7B-22"></textarea><div class="row mt"><button class="btn btn-soft" id="c1">🔍 Pindai</button><button class="btn btn-primary shine" id="c2">▶ Impor Siswa</button></div><div id="r2"></div></div>
    <div class="card"><h3>🔐 Ganti Kata Sandi Guru</h3><p class="small muted mt">Sandi minimal 10 karakter, memuat huruf dan angka. Setelah diganti, semua sesi guru berakhir.</p>
      <label class="mt">Nama tampilan guru (opsional)</label><input id="nm" placeholder="Zulfa Dianti, S.Pd., M.Pd., Gr."><label class="mt">Kata sandi lama</label><input id="pl" type="password" autocomplete="current-password"><label class="mt">Kata sandi baru</label><input id="pb" type="password" autocomplete="new-password"><button class="btn btn-primary mt2 shine" id="gs">Simpan Kata Sandi</button></div>
    <div class="card warm"><h3>ℹ️ Catatan Keamanan</h3><div class="col mt small"><div>• Rahasia aplikasi (kunci sesi, hash sandi) hanya di <b>Script Properties</b>, tidak pernah dikirim ke browser.</div><div>• Jangan bagikan spreadsheet database: sheet <b>Siswa</b> memuat kode akses.</div><div>• Batasi jumlah editor proyek Apps Script.</div><div>• Sesi tidak ikut pindah saat migrasi — siswa cukup masuk ulang.</div></div>
      <button class="btn btn-ghost mt" data-act="lup">🔍 Kursor Lup: nyala / mati</button></div></div>`;
  const jalan = async (act, dry, id) => { const r = await api(act === 'csv' ? 'guru.imporCsv' : 'guru.impor', act === 'csv' ? { csv: $('#csv', m).value, dryRun: dry, timpa: $('#tm', m).checked } : { source: $('#src', m).value, sheets: $$('.sh', m).filter(x => x.checked).map(x => x.value), dryRun: dry, timpa: $('#tm', m).checked }); if (!r.success) { toast(r.message, 'err'); $(id, m).innerHTML = ''; return; } toast(r.message, 'ok'); $(id, m).innerHTML = tabel(r.data); if (!dry) dropCache(); };
  $('#p1', m).onclick = () => jalan('src', true, '#r1'); $('#c1', m).onclick = () => jalan('csv', true, '#r2');
  $('#p2', m).onclick = async () => { if (await confirmBox('Jalankan impor?', 'Data dari spreadsheet lama akan ditambahkan ke database ini. Aman diulang.', 'Ya, impor')) jalan('src', false, '#r1'); };
  $('#c2', m).onclick = async () => { if (await confirmBox('Impor siswa dari CSV?', 'Siswa baru akan ditambahkan ke sheet Siswa.', 'Ya, impor')) jalan('csv', false, '#r2'); };
  $('#gs', m).onclick = async () => { const r = await api('guru.sandi', { lama: $('#pl', m).value, baru: $('#pb', m).value, nama: $('#nm', m).value }); toast(r.message, r.success ? 'ok' : 'err'); if (r.success) { Sesi.clear(); setTimeout(() => location.hash = '#/masuk?t=guru', 1200); } };
  $('[data-act=lup]', m).onclick = () => Lup.toggle(); afterRender(m);
};

// ---------------- BANK SOAL: guru menambah / mengubah soal langsung dari dashboard ----------------
Views.gSoal = function (el, ctx) {
  const m = Gur.shell(el, ctx, 'soal'); const S = { id: ctx.q.id || '', list: [], teks: [], dirty: false, edit: null, waktu: 0, d: null }; let E = null, TE = null, uploading = false;
  const JL = { PG: 'Pilihan Ganda', PGK: 'Pilihan Ganda Kompleks', KAT: 'Kategori (Benar/Salah)' };
  const blank = j => j === 'PG' ? { jenis: 'PG', teksId: '', kompetensi: '', level: '', topik: '', kasus: '', gambar: '', tanya: '', opsi: { A: '', B: '', C: '', D: '' }, kunci: '', analisis: '' }
    : j === 'PGK' ? { jenis: 'PGK', teksId: '', kompetensi: '', level: '', topik: '', kasus: '', gambar: '', tanya: 'Pilih semua jawaban yang benar. ', opsi: { A: '', B: '', C: '', D: '', E: '' }, kunci: [], analisis: '' }
    : { jenis: 'KAT', teksId: '', kompetensi: '', level: '', topik: '', kasus: '', gambar: '', tanya: 'Tentukan apakah setiap pernyataan berikut benar atau salah.', pernyataan: ['', ''], kolom: ['Benar', 'Salah'], kunci: [0, 0], analisis: '' };
  const clone = o => JSON.parse(JSON.stringify(o));
  const ringkasKunci = q => q.jenis === 'PG' ? 'Kunci: ' + q.kunci : q.jenis === 'PGK' ? 'Kunci: ' + (q.kunci || []).join(', ') : 'Kunci: ' + (q.kunci || []).map((k, i) => (i + 1) + '=' + q.kolom[k]).join(' · ');
  const muat = async id => {
    m.innerHTML = Stu.skeleton + Stu.skeleton; const r = await api('guru.soalAmbil', { id: id || S.id });
    if (!r.success) return Gur.err(m, r);
    S.d = r.data; S.teks = clone(r.data.teks || []); TE = null; S.id = r.data.id; S.list = r.data.soal.map(q => { const o = clone(q); delete o.no; o.jenis = o.jenis || 'PG'; o.topik = o.topik || ''; o.kasus = o.kasus || ''; o.gambar = o.gambar || ''; o.teksId = o.teksId || ''; o.kompetensi = o.kompetensi || ''; o.level = o.level || ''; return o; }); S.waktu = r.data.waktuMenit; S.dirty = false; S.edit = null; E = null; window.onbeforeunload = null; draw();
  };
  const tandai = () => { S.dirty = true; window.onbeforeunload = () => 'Perubahan soal belum disimpan.'; };
  const editorHtml = () => {
    const q = E, j = q.jenis;
    let jenisHtml = '', kunciHtml = '';
    if (j === 'PG') kunciHtml = ['A', 'B', 'C', 'D'].map(L => `<div class="bs-opt"><span class="lt">${L}</span><input type="text" data-o="${L}" value="${esc(q.opsi[L])}" placeholder="Isi pilihan ${L}"><label class="row" style="margin:0;gap:4px;color:var(--green-d)"><input class="k" type="radio" name="kk" data-kunci="${L}" ${q.kunci === L ? 'checked' : ''}> kunci</label></div>`).join('');
    else if (j === 'PGK') kunciHtml = ['A', 'B', 'C', 'D', 'E'].map(L => `<div class="bs-opt"><span class="lt">${L}</span><input type="text" data-o="${L}" value="${esc(q.opsi[L])}" placeholder="Isi pilihan ${L}${L > 'C' ? ' (boleh dikosongkan)' : ''}"><label class="row" style="margin:0;gap:4px;color:var(--green-d)"><input class="k" type="checkbox" data-kunci="${L}" ${q.kunci.indexOf(L) >= 0 ? 'checked' : ''}> benar</label></div>`).join('');
    else kunciHtml = `<div class="row wrap" style="margin-bottom:10px"><label style="margin:0">Pilihan kolom:</label><select id="kol" style="max-width:260px"><option ${q.kolom[0] === 'Benar' ? 'selected' : ''} value="Benar">Benar / Salah</option><option ${q.kolom[0] === 'Sesuai' ? 'selected' : ''} value="Sesuai">Sesuai / Tidak Sesuai</option></select></div>
      <div class="bs-pern"><span class="h" style="text-align:left">PERNYATAAN</span><span class="h">${esc(q.kolom[0])}</span><span class="h">${esc(q.kolom[1])}</span><span></span></div>
      ${q.pernyataan.map((p, i) => `<div class="bs-pern"><input type="text" data-p="${i}" value="${esc(p)}" placeholder="Tulis pernyataan ${i + 1}"><label class="center" style="margin:0"><input class="k" type="radio" name="kp${i}" data-kp="${i}" data-v="0" ${q.kunci[i] === 0 ? 'checked' : ''}></label><label class="center" style="margin:0"><input class="k" type="radio" name="kp${i}" data-kp="${i}" data-v="1" ${q.kunci[i] === 1 ? 'checked' : ''}></label><button class="btn btn-sm btn-ghost" data-rp="${i}" title="Hapus pernyataan" ${q.pernyataan.length <= 2 ? 'disabled' : ''}>✕</button></div>`).join('')}
      <button class="btn btn-soft btn-sm" id="ap" ${q.pernyataan.length >= 8 ? 'disabled' : ''}>＋ Tambah pernyataan</button>`;
    return `<div class="bs-ed fadeup" id="bsq"><div class="row between wrap"><h3>${S.edit === 'baru' ? '＋ Soal Baru' : '✎ Ubah Soal ' + (S.edit + 1)}</h3><div class="chips">${['PG', 'PGK', 'KAT'].map(x => `<button class="chip ${x === j ? 'on' : ''}" data-j="${x}">${JL[x]}</button>`).join('')}</div></div>
      <div class="grid g2 mt" style="gap:12px"><div><label>Topik / judul singkat</label><input id="ft" value="${esc(q.topik)}" placeholder="contoh: Cek fakta"></div><div><label>Gambar pendukung (opsional)</label><div class="bs-img">${q.gambar ? `<img src="${esc(q.gambar)}" alt="">` : ''}<label class="btn btn-soft btn-sm" style="margin:0;cursor:pointer">📷 ${q.gambar ? 'Ganti' : 'Pilih'} gambar<input type="file" id="fg" accept="image/*" class="hide"></label>${q.gambar ? '<button class="btn btn-sm btn-ghost" id="hg">Hapus gambar</button>' : ''}<span class="tiny muted" id="ug">${uploading ? '⏳ mengunggah…' : ''}</span></div></div></div>
      <div class="grid g3 mt" style="gap:12px"><div><label>Teks bacaan (stimulus)</label><select id="fx"><option value="">— tanpa teks bacaan —</option>${S.teks.map(x => `<option value="${x.id}" ${E.teksId === x.id ? 'selected' : ''}>${esc(x.id)} · ${esc(x.judul)}</option>`).join('')}</select></div><div><label>Kompetensi</label><select id="fkm"><option value="">—</option>${['Pemahaman Tekstual', 'Pemahaman Inferensial', 'Evaluasi dan Apresiasi'].map(k => `<option ${E.kompetensi === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div><div><label>Level kognitif</label><select id="flv"><option value="">—</option>${[1, 2, 3].map(k => `<option value="${k}" ${+E.level === k ? 'selected' : ''}>Level ${k}${k === 1 ? ' (pemahaman)' : k === 2 ? ' (penerapan)' : ' (penalaran)'}</option>`).join('')}</select></div></div>
      <label class="mt">Teks cerita / stimulus tambahan (opsional)</label><textarea id="fk" style="min-height:70px" placeholder="Tulis kasus atau bacaan singkat jika diperlukan.">${esc(q.kasus)}</textarea>
      <label class="mt">Pertanyaan *</label><textarea id="fq" style="min-height:80px" placeholder="Tulis pertanyaan di sini">${esc(q.tanya)}</textarea>
      <label class="mt">${j === 'PG' ? 'Pilihan jawaban — pilih satu kunci' : j === 'PGK' ? 'Pilihan jawaban — centang SEMUA yang benar' : 'Pernyataan — tentukan kuncinya'}</label>${kunciHtml}
      <label class="mt">Pembahasan / analisis (tampil setelah siswa mengirim)</label><textarea id="fa" style="min-height:70px" placeholder="Jelaskan mengapa jawabannya demikian.">${esc(q.analisis)}</textarea>
      <div class="row mt2" style="justify-content:flex-end"><button class="btn btn-ghost" id="bt">Batal</button><button class="btn btn-primary shine" id="sp">✓ Simpan Soal ke Daftar</button></div></div>`;
  };
  const cek = q => {
    if (q.tanya.trim().length < 5) return 'Pertanyaan belum diisi.';
    if (q.jenis === 'PG') { if (['A', 'B', 'C', 'D'].some(L => !q.opsi[L].trim())) return 'Keempat pilihan jawaban harus diisi.'; if (!q.kunci) return 'Pilih satu kunci jawaban.'; }
    if (q.jenis === 'PGK') { const isi = ['A', 'B', 'C', 'D', 'E'].filter(L => q.opsi[L].trim()); if (isi.length < 3) return 'Minimal 3 pilihan jawaban.'; const kk = q.kunci.filter(L => isi.indexOf(L) >= 0); if (!kk.length) return 'Centang minimal satu jawaban yang benar.'; if (kk.length === isi.length) return 'Tidak semua pilihan boleh benar.'; }
    if (q.jenis === 'KAT') { if (q.pernyataan.some(p => !p.trim())) return 'Semua pernyataan harus diisi.'; if (q.kunci.length !== q.pernyataan.length || q.kunci.some(k => k !== 0 && k !== 1)) return 'Tentukan kunci tiap pernyataan.'; }
    return '';
  };
  const bindEditor = () => {
    const box = $('#bsq', m); if (!box) return;
    $$('[data-j]', box).forEach(b => b.onclick = () => { if (b.dataset.j === E.jenis) return; const keep = { topik: E.topik, kasus: E.kasus, gambar: E.gambar, analisis: E.analisis, teksId: E.teksId, kompetensi: E.kompetensi, level: E.level }; E = Object.assign(blank(b.dataset.j), keep); draw(); });
    $('#fx', box).onchange = e => E.teksId = e.target.value; $('#fkm', box).onchange = e => E.kompetensi = e.target.value; $('#flv', box).onchange = e => E.level = e.target.value ? +e.target.value : '';
    $('#ft', box).oninput = e => E.topik = e.target.value; $('#fk', box).oninput = e => E.kasus = e.target.value; $('#fq', box).oninput = e => E.tanya = e.target.value; $('#fa', box).oninput = e => E.analisis = e.target.value;
    $$('[data-o]', box).forEach(i => i.oninput = e => E.opsi[i.dataset.o] = e.target.value);
    $$('[data-kunci]', box).forEach(i => i.onchange = () => { const L = i.dataset.kunci; if (E.jenis === 'PG') E.kunci = L; else { i.checked ? (E.kunci.indexOf(L) < 0 && E.kunci.push(L)) : (E.kunci = E.kunci.filter(x => x !== L)); } });
    $$('[data-p]', box).forEach(i => i.oninput = e => E.pernyataan[+i.dataset.p] = e.target.value);
    $$('[data-kp]', box).forEach(i => i.onchange = () => E.kunci[+i.dataset.kp] = +i.dataset.v);
    $$('[data-rp]', box).forEach(b => b.onclick = () => { const i = +b.dataset.rp; E.pernyataan.splice(i, 1); E.kunci.splice(i, 1); draw(); });
    const ap = $('#ap', box); if (ap) ap.onclick = () => { E.pernyataan.push(''); E.kunci.push(0); draw(); };
    const kol = $('#kol', box); if (kol) kol.onchange = e => { E.kolom = e.target.value === 'Benar' ? ['Benar', 'Salah'] : ['Sesuai', 'Tidak Sesuai']; draw(); };
    const hg = $('#hg', box); if (hg) hg.onclick = () => { E.gambar = ''; draw(); };
    $('#fg', box).onchange = async e => {
      const f = e.target.files[0]; if (!f) return; if (API.demo) { toast('Mode pratinjau: unggah gambar dinonaktifkan.', 'err'); return; }
      uploading = true; $('#ug', box).textContent = '⏳ mengunggah…';
      try {
        const url = await new Promise((ok, no) => { const fr = new FileReader(); fr.onload = () => { const im = new Image(); im.onload = () => { const sc = Math.min(1, 1280 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', .82)); }; im.onerror = no; im.src = fr.result; }; fr.onerror = no; fr.readAsDataURL(f); });
        const r = await api('guru.unggahGambar', { mime: 'image/jpeg', data: url }, { timeout: 60000 });
        if (!r.success) throw new Error(r.message); E.gambar = r.data.url; toast('Gambar terunggah ✓', 'ok');
      } catch (er) { toast('Gagal mengunggah gambar: ' + (er.message || 'coba gambar lain'), 'err'); }
      uploading = false; draw();
    };
    $('#bt', box).onclick = () => { S.edit = null; E = null; draw(); };
    $('#sp', box).onclick = () => { const msg = cek(E); if (msg) return toast(msg, 'err'); const q = clone(E); if (q.jenis === 'PG') { delete q.pernyataan; delete q.kolom; } else if (q.jenis === 'PGK') { delete q.pernyataan; delete q.kolom; q.opsi = Object.fromEntries(Object.entries(q.opsi)); } else delete q.opsi; if (S.edit === 'baru') S.list.push(q); else S.list[S.edit] = q; tandai(); S.edit = null; E = null; draw(); toast('Soal masuk ke daftar. Jangan lupa tekan “Simpan Perubahan”.', 'ok'); };
  };

  const kataTeks = x => x.bagian.reduce((a, b) => a + b.paragraf.join(' ').split(/\s+/).filter(Boolean).length, 0);
  const teksSection = () => `<div class="card mt2"><div class="row between wrap"><div><h3 style="font-size:19px">📄 Teks Bacaan (stimulus)</h3><div class="small muted">Satu teks dapat dipakai beberapa soal. Pilih teksnya saat menulis soal.</div></div>${TE ? '' : '<button class="btn btn-soft" id="at">＋ Tambah Teks Bacaan</button>'}</div>
    ${S.teks.map((x, i) => `<div class="q" style="margin-top:10px"><span class="no" style="font-size:12px">${esc(x.id)}</span><div class="grow" style="min-width:0"><b>${esc(x.judul)}</b><div class="tiny muted">${esc(x.jenis)} · ${kataTeks(x)} kata · dipakai ${S.list.filter(q => q.teksId === x.id).length} soal${x.bagian.length > 1 ? ' · ' + x.bagian.length + ' bagian' : ''}</div></div><div class="row" style="gap:4px"><button class="btn btn-sm btn-soft" data-et="${i}">✎ Ubah</button><button class="btn btn-sm btn-ghost" style="color:var(--danger)" data-dt="${i}">🗑</button></div></div>`).join('') || '<div class="small muted mt">Belum ada teks bacaan.</div>'}
    ${TE ? teksEditor() : ''}</div>`;
  const teksEditor = () => `<div class="bs-ed fadeup mt"><h3>${TE.i === 'baru' ? '＋ Teks Bacaan Baru' : '✎ Ubah Teks ' + esc(TE.o.id)}</h3>
    <div class="grid g2 mt" style="gap:12px"><div><label>Judul teks *</label><input id="tj" value="${esc(TE.o.judul)}"></div><div><label>Jenis teks</label><select id="tjn">${['Teks Informasi', 'Teks Fiksi (Cerita Pendek)', 'Teks Jamak (Teks A dan Teks B)', 'Infografik / Tabel'].map(k => `<option ${TE.o.jenis === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div></div>
    ${TE.o.bagian.map((b, j) => `<div class="card mt" style="padding:12px"><div class="row between wrap"><b class="small">Bagian ${j + 1}</b>${TE.o.bagian.length > 1 ? `<button class="btn btn-sm btn-ghost" data-rb="${j}">✕ Hapus bagian</button>` : ''}</div>
      <div class="grid g2 mt" style="gap:10px"><div><label>Label (opsional, mis. Teks A)</label><input data-bl="${j}" value="${esc(b.label || '')}"></div><div><label>Judul bagian (opsional)</label><input data-bj="${j}" value="${esc(b.judul || '')}"></div></div>
      <label class="mt">Isi bacaan * <span class="tiny muted">(pisahkan paragraf dengan baris kosong)</span></label><textarea data-bp="${j}" style="min-height:150px">${esc(b.paragraf.join('\n\n'))}</textarea>
      <div class="bs-img mt">${b.gambar ? `<img src="${esc(b.gambar)}" alt="">` : ''}<label class="btn btn-soft btn-sm" style="margin:0;cursor:pointer">📷 ${b.gambar ? 'Ganti' : 'Tambah'} gambar<input type="file" data-bg="${j}" accept="image/*" class="hide"></label>${b.gambar ? `<button class="btn btn-sm btn-ghost" data-hg="${j}">Hapus gambar</button>` : ''}</div></div>`).join('')}
    <div class="row mt2 wrap">${TE.o.bagian.length < 3 ? '<button class="btn btn-soft btn-sm" id="ab">＋ Tambah bagian (teks jamak)</button>' : ''}<span class="grow"></span><button class="btn btn-ghost" id="tb">Batal</button><button class="btn btn-primary shine" id="ts">✓ Simpan Teks ke Daftar</button></div></div>`;
  const bindTeks = () => {
    const at = $('#at', m); if (at) at.onclick = () => { const mx = Math.max(0, ...S.teks.map(x => +x.id.slice(1))); TE = { i: 'baru', o: { id: 'T' + (mx + 1), judul: '', jenis: 'Teks Informasi', bagian: [{ paragraf: [''] }] } }; draw(); };
    $$('[data-et]', m).forEach(b => b.onclick = () => { TE = { i: +b.dataset.et, o: clone(S.teks[+b.dataset.et]) }; draw(); });
    $$('[data-dt]', m).forEach(b => b.onclick = async () => { const x = S.teks[+b.dataset.dt], n = S.list.filter(q => q.teksId === x.id).length; if (!(await confirmBox('Hapus teks ' + x.id + '?', n ? n + ' soal yang memakai teks ini akan kehilangan teks bacaannya.' : 'Teks dihapus dari daftar setelah Simpan Perubahan.', 'Ya, hapus'))) return; S.list.forEach(q => { if (q.teksId === x.id) q.teksId = ''; }); S.teks.splice(+b.dataset.dt, 1); tandai(); draw(); });
    const box = $('.bs-ed', m); if (!TE || !$('#ts', m)) return;
    const sync = () => { TE.o.judul = $('#tj', m).value; TE.o.jenis = $('#tjn', m).value; TE.o.bagian.forEach((b, j) => { b.label = $('[data-bl="' + j + '"]', m).value; b.judul = $('[data-bj="' + j + '"]', m).value; b.paragraf = $('[data-bp="' + j + '"]', m).value.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean); if (!b.paragraf.length) b.paragraf = ['']; }); };
    $$('[data-rb]', m).forEach(b => b.onclick = () => { sync(); TE.o.bagian.splice(+b.dataset.rb, 1); draw(); });
    const ab = $('#ab', m); if (ab) ab.onclick = () => { sync(); TE.o.bagian.push({ label: 'Teks ' + 'ABC'[TE.o.bagian.length], paragraf: [''] }); draw(); };
    $$('[data-hg]', m).forEach(b => b.onclick = () => { sync(); delete TE.o.bagian[+b.dataset.hg].gambar; draw(); });
    $$('[data-bg]', m).forEach(inp => inp.onchange = async e => {
      const f = e.target.files[0]; if (!f) return; if (API.demo) return toast('Mode pratinjau: unggah gambar dinonaktifkan.', 'err'); sync(); toast('Mengunggah gambar…');
      try { const url = await new Promise((ok, no) => { const fr = new FileReader(); fr.onload = () => { const im = new Image(); im.onload = () => { const sc = Math.min(1, 1280 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', .82)); }; im.onerror = no; im.src = fr.result; }; fr.onerror = no; fr.readAsDataURL(f); });
        const r = await api('guru.unggahGambar', { mime: 'image/jpeg', data: url }, { timeout: 60000 }); if (!r.success) throw new Error(r.message); TE.o.bagian[+inp.dataset.bg].gambar = r.data.url; toast('Gambar terunggah ✓', 'ok'); } catch (er) { toast('Gagal mengunggah: ' + (er.message || 'coba gambar lain'), 'err'); }
      draw(); });
    $('#tb', m).onclick = () => { TE = null; draw(); };
    $('#ts', m).onclick = () => { sync(); if (!TE.o.judul.trim()) return toast('Judul teks belum diisi.', 'err'); if (TE.o.bagian.some(b => !b.paragraf.join('').trim())) return toast('Isi bacaan belum lengkap.', 'err'); const o = clone(TE.o); o.bagian.forEach(b => { if (!b.label) delete b.label; if (!b.judul) delete b.judul; }); if (TE.i === 'baru') S.teks.push(o); else S.teks[TE.i] = o; TE = null; tandai(); draw(); toast('Teks masuk ke daftar. Jangan lupa tekan “Simpan Perubahan”.', 'ok'); };
  };
  const draw = () => {
    const d = S.d, sum = d.jenis === 'Sumatif';
    m.innerHTML = Gur.head('Bank Soal', 'Bank Soal Asesmen', 'Tambah, ubah, urutkan, atau hapus soal langsung di sini — tanpa membuka Google Sheets. Siswa langsung melihat soal terbaru setelah kamu menyimpan.') + `
    <div class="card mt"><div class="chips">${d.daftar.map(a => `<button class="chip ${a.id === S.id ? 'on' : ''}" data-a="${a.id}">${a.jenis === 'Sumatif' ? '🏆' : '📝'} ${esc(a.judul.replace('Asesmen ', ''))}</button>`).join('')}</div>
      <div class="row wrap mt"><span class="badge">${S.list.length} soal</span>${sum ? `<label class="row" style="margin:0;gap:6px">⏱ Waktu ujian <input id="wk" type="number" min="5" max="180" value="${S.waktu}" style="width:84px"> menit</label>` : ''}<span class="small muted">Bentuk soal: pilihan ganda · pilihan ganda kompleks · kategori (Benar/Salah atau Sesuai/Tidak Sesuai)</span></div>
      ${d.pengerjaan > 0 ? `<div class="card warm mt small">⚠️ <b>Sudah ada ${d.pengerjaan} pengerjaan siswa</b> pada asesmen ini. Nilai yang sudah tercatat tidak berubah, tetapi mengubah, menghapus, atau mengurutkan soal membuat tinjauan jawaban lama tidak cocok. Sebaiknya ubah soal sebelum dipakai siswa.</div>` : ''}${API.demo ? '<div class="card mt small" style="background:var(--lav2)">👀 Pratinjau: ini contoh tampilan. Kunci jawaban tidak ditampilkan dan perubahan tidak dapat disimpan.</div>' : ''}</div>
    ${teksSection()}
    <div class="bs-list mt2">${S.list.map((q, i) => `<div class="q"><span class="no">${i + 1}</span><div class="grow" style="min-width:0"><div class="row wrap" style="gap:6px"><span class="badge">${JL[q.jenis || 'PG']}</span><span class="badge b-warm">${esc(q.topik || 'Umum')}</span>${q.teksId ? `<span class="badge">📄 ${esc(q.teksId)}</span>` : ''}${q.level ? `<span class="badge b-warm">Level ${q.level}</span>` : ''}${q.gambar ? '<span class="badge">🖼 ada gambar</span>' : ''}${q.kasus ? '<span class="badge">📖 ada cerita</span>' : ''}</div><div class="mt" style="font-weight:700">${esc(q.tanya.length > 160 ? q.tanya.slice(0, 160) + '…' : q.tanya)}</div><div class="tiny muted mt">${esc(ringkasKunci(q))}</div></div>
      <div class="col" style="gap:6px"><div class="row" style="gap:4px"><button class="btn btn-sm btn-ghost" data-up="${i}" ${i ? '' : 'disabled'} title="Naikkan">↑</button><button class="btn btn-sm btn-ghost" data-dn="${i}" ${i < S.list.length - 1 ? '' : 'disabled'} title="Turunkan">↓</button></div><div class="row" style="gap:4px"><button class="btn btn-sm btn-soft" data-ed="${i}">✎ Ubah</button><button class="btn btn-sm btn-ghost" data-cp="${i}" title="Gandakan">⎘</button><button class="btn btn-sm btn-ghost" style="color:var(--danger)" data-rm="${i}" title="Hapus">🗑</button></div></div></div>`).join('') || '<div class="card center muted">Belum ada soal. Tekan “Tambah Soal”.</div>'}</div>
    ${S.edit !== null ? editorHtml() : `<div class="row wrap mt2 no-print"><span class="small muted" style="font-weight:800">＋ TAMBAH SOAL:</span>${['PG', 'PGK', 'KAT'].map(x => `<button class="btn btn-soft" data-add="${x}">＋ ${JL[x]}</button>`).join('')}</div>`}
    ${S.dirty ? `<div class="sticky-save no-print"><span>✏️ Ada perubahan yang belum disimpan</span><div class="row"><button class="btn btn-sm" style="background:#fff;color:var(--text)" id="bt2">Batalkan</button><button class="btn btn-green shine" id="sv">💾 Simpan Perubahan</button></div></div>` : ''}`;
    $$('[data-a]', m).forEach(b => b.onclick = async () => { if (b.dataset.a === S.id) return; if (S.dirty && !(await confirmBox('Pindah asesmen?', 'Perubahan yang belum disimpan akan hilang.', 'Ya, pindah'))) return; muat(b.dataset.a); });
    const wk = $('#wk', m); if (wk) wk.onchange = e => { S.waktu = +e.target.value; tandai(); draw(); };
    $$('[data-add]', m).forEach(b => b.onclick = () => { E = blank(b.dataset.add); S.edit = 'baru'; draw(); $('.bs-ed', m).scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    $$('[data-ed]', m).forEach(b => b.onclick = () => { const i = +b.dataset.ed; E = clone(S.list[i]); if (E.jenis === 'PG') E.kunci = E.kunci || ''; S.edit = i; draw(); $('.bs-ed', m).scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    $$('[data-up]', m).forEach(b => b.onclick = () => { const i = +b.dataset.up;[S.list[i - 1], S.list[i]] = [S.list[i], S.list[i - 1]]; tandai(); draw(); });
    $$('[data-dn]', m).forEach(b => b.onclick = () => { const i = +b.dataset.dn;[S.list[i + 1], S.list[i]] = [S.list[i], S.list[i + 1]]; tandai(); draw(); });
    $$('[data-cp]', m).forEach(b => b.onclick = () => { const i = +b.dataset.cp; S.list.splice(i + 1, 0, clone(S.list[i])); tandai(); draw(); });
    $$('[data-rm]', m).forEach(b => b.onclick = async () => { if (await confirmBox('Hapus soal ' + (+b.dataset.rm + 1) + '?', 'Soal dihapus dari daftar setelah kamu menekan Simpan Perubahan.', 'Ya, hapus')) { S.list.splice(+b.dataset.rm, 1); tandai(); draw(); } });
    bindEditor(); bindTeks();
    const bt = $('#bt2', m); if (bt) bt.onclick = () => muat(S.id);
    const sv = $('#sv', m); if (sv) sv.onclick = async () => {
      if (S.d.pengerjaan > 0 && !(await confirmBox('Simpan perubahan soal?', 'Sudah ada pengerjaan siswa. Tinjauan jawaban lama bisa tidak cocok dengan soal baru. Nilai tercatat tidak berubah.', 'Ya, simpan'))) return;
      sv.disabled = true; sv.textContent = 'Menyimpan…';
      const r = await api('guru.soalSimpan', { id: S.id, soal: S.list, teks: S.teks, waktuMenit: S.waktu });
      if (!r.success) { toast(r.message, 'err'); sv.disabled = false; sv.textContent = '💾 Simpan Perubahan'; return; }
      toast(r.message, 'ok'); Confetti.go(50); dropCache(); muat(S.id);
    };
    afterRender(m);
  };
  muat(S.id);
};
