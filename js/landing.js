// ===== Halaman muka (landing) + halaman masuk =====
const Views = window.Views = window.Views || {};
const IMG = n => 'assets/img/' + n + '.svg';
const MODUL = [
  { id: 'S1', tag: 'Sub-bab 1', judul: 'Cara Kerja Internet & Mesin Pencari', ket: 'Ikuti perjalanan paket data dan bongkar rahasia robot penjelajah mesin pencari.', img: ['modul-1-a', 'modul-1-b', 'modul-1-c'], chip: [['📖', 'Materi', '12 halaman'], ['🧪', 'Lab', '3 simulasi'], ['🧩', 'Kegiatan', 'Studi kasus'], ['📝', 'Asesmen', '5 soal']], menit: 62 },
  { id: 'S2', tag: 'Sub-bab 2', judul: 'Literasi Digital & Evaluasi Informasi', ket: 'Jadi detektif cek fakta: kenali hoaks, periksa domain, lalu uji dirimu di Tantangan Kode Mini.', img: ['modul-2-a', 'modul-2-b', 'modul-2-c'], chip: [['📖', 'Materi', '16 halaman'], ['🧪', 'Lab', '3 simulasi'], ['🧩', 'Kegiatan', 'Studi kasus'], ['📝', 'Asesmen', '5 soal']], menit: 83 },
  { id: 'S3', tag: 'Sub-bab 3', judul: 'Ancaman Digital & Perlindungan Data Pribadi', ket: 'Tangkis phishing, jaga kode OTP, buat sandi kuat, dan aktifkan verifikasi dua langkah.', img: ['modul-3-a', 'modul-3-b', 'modul-3-c'], chip: [['📖', 'Materi', '9 halaman'], ['🧪', 'Lab', '3 simulasi'], ['🧩', 'Kegiatan', 'Studi kasus'], ['📝', 'Asesmen', '5 soal']], menit: 61 },
  { id: 'SUM', tag: 'Uji Kompetensi', judul: 'Asesmen Sumatif Bab 2 (Simulasi TKA)', ket: 'Ujian berbasis komputer dengan teks bacaan. Terbuka setelah semua sub-bab selesai.', img: ['modul-4-a', 'modul-4-b', 'modul-4-c'], chip: [['📚', 'Naskah', '6 teks'], ['📝', 'Soal', '20 soal'], ['⏱', 'Waktu', '50 menit'], ['⭐', 'KKM', '72']], menit: 50 }
];
const ALUR = [
  { ic: '📖', t: 'Pahami', d: 'Materi bernarasi yang dekat dengan keseharianmu, lengkap dengan diagram, video, dan kotak Kamus Pintar.', pts: ['Diagram dan video tersemat di halaman', 'Coba simulasi langsung saat membaca', 'Kasus nyata dari Indonesia'], mini: 'flip' },
  { ic: '🧪', t: 'Praktikkan', d: 'Lab simulasi: cari fakta, bongkar pesan phishing, dan putuskan langkah paling aman seperti detektif digital.', pts: ['3 simulasi di setiap lab', 'Umpan balik langsung benar atau salah', 'Tantangan Kode Mini dengan Perisai Digital'], mini: 'phish' },
  { ic: '🧩', t: 'Terapkan', d: 'Kegiatan studi kasus: pilih langkah terbaik dan pakai aturan logika JIKA–MAKA untuk mengambil keputusan.', pts: ['Skenario sehari-hari yang nyata', 'Aturan logika yang mudah diingat', 'Boleh mencoba lagi sampai paham'], mini: 'rule' },
  { ic: '📝', t: 'Asesmen', d: 'Soal bernarasi dengan umpan balik langsung. Sumatif tampil seperti ujian berbasis komputer (Simulasi TKA).', pts: ['Teks bacaan, bukan hafalan', 'Tiga bentuk soal ala TKA', 'Pembahasan di setiap soal'], mini: 'quiz' },
  { ic: '💭', t: 'Refleksi', d: 'Tuliskan pelajaran terpentingmu. Setelah refleksi terisi, nilai resmi terbuka.', pts: ['Pilih perasaanmu: senang, tertantang, paham, atau butuh guru', 'Guru dapat membalas refleksimu', 'Melatih sikap dan kejujuran belajar'], mini: 'mood' },
  { ic: '🏅', t: 'Naik Level', d: 'Aktivitas berikutnya terbuka, XP bertambah, dan namamu bisa masuk papan peringkat. Selesai semua? Bebas belajar ulang!', pts: ['XP dan level untuk setiap aktivitas', 'Papan peringkat penjelajah digital', 'Nilai resmi aman, latihan ulang bebas beban'], mini: 'xp' }
];
const FITUR = [['🔒', 'Kunci berurutan, dijaga server', 'Aktivitas terkunci tidak bisa dibuka lewat tautan atau kode di browser.'], ['🔁', 'Latihan ulang bebas beban', 'Nilai resmi dari pengerjaan pertama. Latihan tidak menimpa nilai.'], ['📊', 'Dashboard guru multi-kelas', 'Progres, nilai, grafik statistik, filter, dan buka kunci manual.'], ['📥', 'Unduh Excel & PDF', 'Rekap nilai resmi siap untuk e-Rapor/Dapodik.']];

Views.landing = function (el) {
  const hero = [
    ['Jelajahi <em>Dunia Digital</em> dengan Aman', 'Belajar Koding Bab 2 lewat cerita, lab simulasi, dan tantangan seru. Dari cara kerja internet sampai menangkis phishing!', 'hero-1', '🚀 Koding · SMP Kelas VII'],
    ['Lindungi <em>Data Pribadimu</em> dari Phishing', 'Kenali pesan hadiah palsu, jaga kode OTP, buat sandi kuat, dan aktifkan verifikasi dua langkah.', 'hero-2', '🛡️ Keamanan Digital'],
    ['Jadi <em>Detektif Cek Fakta</em> Anti Hoaks', 'Bandingkan domain, telusuri sumber, dan terapkan prinsip S.A.R.I sebelum membagikan apa pun.', 'hero-3', '🔎 Literasi Digital']
  ];
  el.innerHTML = `
  <header class="nav"><div class="container">
    <a class="logo" href="#/"><img src="assets/img/logo.svg" alt=""><span class="lt">Dunia Digital Aman</span></a>
    <nav class="nav-links"><a href="#identitas">Identitas</a><a href="#modul">Modul</a><a href="#alur">Cara Belajar</a><a href="#guru">Untuk Guru</a><a href="#peringkat">Peringkat</a></nav>
    <div class="row">${sfxBtn()}<a class="btn btn-ghost btn-sm" href="#/masuk?t=guru">Masuk Guru</a><a class="btn btn-primary btn-sm shine" href="#/masuk">Masuk Siswa</a></div>
  </div></header>
  <section class="hero">
    <div class="blob" style="width:340px;height:340px;background:#c5b0ff;left:-80px;top:40px"></div><div class="blob" style="width:300px;height:300px;background:#ffc2de;right:-60px;bottom:20px;animation-delay:-3s"></div>
    <div class="container hero-stage">
      ${hero.map((h, i) => `<div class="hero-slide ${i ? '' : 'on'}"><div><span class="badge">${h[3]}</span><h1>${h[0]}</h1><p class="muted" style="font-size:18px;max-width:520px">${h[1]}</p>
        <div class="row wrap mt2"><a class="btn btn-primary btn-lg shine pulse-glow" href="#/masuk">▶ Mulai Belajar</a><a class="btn btn-ghost btn-lg" href="#/ps/beranda">👀 Lihat Pratinjau</a></div></div>
        <div class="hero-img float"><img src="${IMG(h[2])}" alt=""></div></div>`).join('')}
      <div class="hero-dots">${hero.map((_, i) => `<b class="${i ? '' : 'on'}"></b>`).join('')}</div>
    </div>
  </section>
  <section class="container"><div class="grid g4" style="margin-top:-36px;position:relative;z-index:5">
    ${[[3, 'Sub-bab', ''], [14, 'Aktivitas Berurutan', ''], [3, 'Kelas (7A–7C)', ''], [72, 'KKM Sumatif', '']].map(s => `<div class="card stat glow rv"><b data-count="${s[0]}">0</b><span class="muted">${s[1]}</span></div>`).join('')}
  </div></section>
  <section class="sec" id="identitas" style="padding-bottom:20px"><div class="container"><div class="rv">${Stu.identitas(PV.bab, true)}</div></div></section>
  <section class="sec" id="modul"><div class="container">
    <h2 class="center rv">Pilih Petualangan Belajarmu</h2><p class="lead rv">Tiga sub-bab seru dan satu uji kompetensi. Arahkan kursor ke kartu — gambarnya berganti otomatis!</p>
    <div class="grid g4">${MODUL.map(m => `
      <article class="card prod glow tilt rv"><span class="badge b-warm tag">${m.tag}</span>
        <div class="slides" data-slides="${m.img.map(IMG).join(',')}"></div>
        <div class="body"><h4 class="ptitle">${m.judul}</h4><p class="muted small pdesc">${m.ket}</p>
          <div class="chips4">${m.chip.map(c => `<div class="chip4"><span class="ci">${c[0]}</span><span class="ct"><b>${c[1]}</b><small>${c[2]}</small></span></div>`).join('')}</div>
          <div class="row between" style="margin-top:auto"><span class="small muted">⏱ ±${m.menit} menit</span><a class="btn btn-green btn-sm shine" href="#/ps/beranda">Pratinjau ▶</a></div></div>
      </article>`).join('')}</div>
  </div></section>
  <section class="sec" id="alur" style="background:#fff"><div class="container">
    <h2 class="center rv">Alur Belajar yang Menyenangkan</h2><p class="lead rv">Enam langkah di setiap sub-bab. Ketuk nomornya, lalu coba mini-tantangannya!</p>
    <div class="stp rv" id="stp">
      <div class="stp-rail"><div class="stp-line"><i id="stpf"></i></div>${ALUR.map((a, i) => `<button class="stp-b ${i ? '' : 'on'}" data-i="${i}" data-sfx="select" aria-label="Langkah ${i + 1}: ${a.t}"><span class="stp-n shine">${i + 1}</span><span class="stp-l">${a.ic} ${a.t}</span></button>`).join('')}</div>
      <div class="card stp-stage glow" id="stpg"></div>
      <div class="row between mt"><button class="btn btn-ghost btn-sm" id="stpp">← Sebelumnya</button><span class="small muted" id="stpc"></span><button class="btn btn-primary btn-sm shine" id="stpn">Berikutnya →</button></div>
    </div>
  </div></section>
  <section class="sec" id="guru"><div class="container grid g2" style="align-items:center">
    <div class="rv"><span class="badge">👩‍🏫 Untuk Guru</span><h2 class="mt">Pantau Semua Kelas dalam Satu Dashboard</h2><p class="muted mt">Lihat progres setiap siswa, nilai resmi per sub-bab, siapa yang perlu remedial, lalu buka kunci aktivitas secara manual — lengkap dengan catatan audit.</p>
      <div class="grid g2 mt2" style="gap:12px">${FITUR.map(f => `<div class="card glow" style="padding:14px"><div style="font-size:26px">${f[0]}</div><b>${f[1]}</b><p class="muted small">${f[2]}</p></div>`).join('')}</div>
      <a class="btn btn-primary mt2 shine" href="#/pg/overview">📊 Lihat Pratinjau Dashboard Guru</a></div>
    <div class="card rv" style="padding:24px"><div class="row between"><b>Performa Antar Sub-bab</b><span class="badge">KKM 72</span></div>
      ${[['Internet & Mesin Pencari', 86], ['Literasi Digital', 81], ['Ancaman & Proteksi Data', 84]].map(b => `<div class="mt"><div class="row between small"><span>${b[0]}</span><b>${b[1]}</b></div><div class="bar"><i data-w="${b[1]}%"></i></div></div>`).join('')}
      <div class="row mt2"><div class="card" style="flex:1;text-align:center;padding:14px;background:#e9f9e4"><b style="font:800 28px var(--ff-h);color:var(--green-d)">27</b><div class="small">Tuntas</div></div><div class="card" style="flex:1;text-align:center;padding:14px;background:var(--danger-s)"><b style="font:800 28px var(--ff-h);color:var(--danger)">5</b><div class="small">Remedial</div></div></div></div>
  </div></section>
  <section class="sec" id="peringkat" style="background:linear-gradient(180deg,#fff,#f4efff)"><div class="container">
    <h2 class="center rv">🏆 Papan Peringkat Penjelajah Digital</h2><p class="lead rv">Siapa yang nilainya paling tinggi? Kerjakan asesmenmu dengan sungguh-sungguh — tampilan ini otomatis berubah saat nilai masuk!</p>
    <div class="card rv" style="padding:22px"><div id="rank-box"></div></div>
  </div></section>
  <section class="container sec"><div class="cta-band rv"><div class="blob" style="width:240px;height:240px;background:#fff;opacity:.15;left:-60px;top:-60px"></div>
    <h2>Siap menjadi Penjelajah Digital yang Aman?</h2><p style="opacity:.9;margin:10px 0 24px">Masuk dengan NIS atau kode akses dari gurumu.</p>
    <a class="btn btn-lg shine" style="background:#fff;color:var(--primary-d)" href="#/masuk">▶ Mulai Sekarang</a></div></section>
  <footer><div class="container row between wrap"><div><b style="color:#fff;font-family:var(--ff-h)">Menjelajahi Dunia Digital dengan Aman</b><div class="small">Koding dan Kecerdasan Artifisial · Kelas VII · Fase D · Guru: ${esc(PV.bab.guru)}</div></div>
    <div class="row"><button class="btn btn-sm" style="background:#2e2b57;color:#fff" data-act="lup">🔍 Kursor Lup: nyala/mati</button></div></div></footer>`;
  $('[data-act=lup]', el).onclick = () => Lup.toggle();
  initHero(el); afterRender(el); initAlur(el); Rank.load($('#rank-box', el));
};

// ---- Alur belajar interaktif (stepper otomatis + mini-tantangan) ----
const MINI = {
  flip: () => `<div class="mini"><div class="mflip" tabindex="0"><div class="mf-in"><div class="mf-f"><b>Apa fungsi DNS?</b><small>ketuk untuk membalik ↻</small></div><div class="mf-b"><b>Buku alamat internet</b><small>DNS mencocokkan nama situs dengan alamat IP-nya.</small></div></div></div></div>`,
  phish: () => `<div class="mini"><div class="chat"><div class="bub">🎉 <b>SELAMAT!</b> Kamu menang HP gratis. Klik tautan ini sekarang atau hadiah hangus!</div></div><div class="row wrap mt"><button class="btn btn-soft btn-sm" data-m="0">🖱️ Klik tautan</button><button class="btn btn-soft btn-sm" data-m="1">🚫 Blokir & tanya guru</button></div><div class="mres small mt"></div></div>`,
  rule: () => `<div class="mini"><div class="mrule"><b>JIKA</b> informasi tidak ada sumbernya, <b>MAKA</b> …</div><div class="row wrap mt"><button class="btn btn-soft btn-sm" data-m="0">📤 Langsung bagikan</button><button class="btn btn-soft btn-sm" data-m="1">🔎 Periksa dulu kebenarannya</button></div><div class="mres small mt"></div></div>`,
  quiz: () => `<div class="mini"><div class="row between"><b class="small">Soal 1 dari 20</b><span class="badge b-amber">⏱ 02:30</span></div><p class="small mt"><b>Rani hanya membuka hasil pencarian paling atas lalu menyalinnya. Apa risiko utamanya?</b></p><div class="mt"><button class="opt" data-m="0"><span class="dot">A</span><span>Tugasnya pasti paling benar</span></button><button class="opt" data-m="1"><span class="dot">B</span><span>Ia dapat memakai informasi lama atau keliru tanpa sadar</span></button></div><div class="mres small"></div></div>`,
  mood: () => `<div class="mini"><p class="small"><b>Bagaimana perasaanmu setelah belajar hari ini?</b></p><div class="rf-opts mt">${[['😄', 'Senang'], ['🔥', 'Tertantang'], ['💡', 'Paham'], ['🤝', 'Butuh Guru']].map((r, i) => `<button class="rf-opt" data-m="${i}"><span class="e">${r[0]}</span>${r[1]}</button>`).join('')}</div><div class="mres small mt"></div></div>`,
  xp: () => `<div class="mini"><div class="row between"><b>Level <span id="lv">1</span></b><span class="badge b-ok"><span id="xpv">0</span> XP</span></div><div class="bar mt" style="height:14px"><i id="xpb" style="width:0"></i></div><button class="btn btn-green btn-sm mt shine" id="xpg">⭐ Selesaikan aktivitas (+25 XP)</button><div class="mres small mt"></div></div>`
};
function initAlur(root) {
  const box = $('#stp', root); if (!box) return; const n = ALUR.length; let cur = 0, auto = true, tmr = null, xp = 0;
  const stage = $('#stpg', root);
  const show = (i, manual) => {
    cur = (i + n) % n; if (manual) auto = false;
    $$('.stp-b', box).forEach((b, k) => { b.classList.toggle('on', k === cur); b.classList.toggle('done', k < cur); });
    $('#stpf', box).style.width = (cur / (n - 1) * 100) + '%'; $('#stpc', box).textContent = 'Langkah ' + (cur + 1) + ' dari ' + n;
    const a = ALUR[cur]; stage.classList.remove('swap'); void stage.offsetWidth; stage.classList.add('swap');
    stage.innerHTML = `<div class="stg"><div class="stg-l"><div class="stg-ic float">${a.ic}</div><span class="badge">Langkah ${cur + 1}</span><h3 class="mt">${a.t}</h3><p class="muted mt">${a.d}</p><ul class="stg-pts">${a.pts.map(p => `<li>${p}</li>`).join('')}</ul></div><div class="stg-r"><div class="tiny muted" style="font-weight:800;letter-spacing:.06em">COBA SEKARANG</div>${MINI[a.mini]()}</div></div>`;
    bindMini(a.mini);
  };
  const res = (ok, t) => { const r = $('.mres', stage); if (r) r.innerHTML = `<div class="card pop" style="padding:10px 12px;background:${ok ? 'var(--green-l)' : 'var(--danger-s)'};border-color:${ok ? 'var(--green)' : '#fca5a5'}">${t}</div>`; };
  const bindMini = k => {
    auto = auto && true; const hold = () => { auto = false; };
    if (k === 'flip') { const f = $('.mflip', stage); f.onclick = () => { f.classList.toggle('on'); hold(); }; f.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') f.click(); }; }
    $$('[data-m]', stage).forEach(b => b.onclick = () => {
      hold(); const v = +b.dataset.m; Sfx.skip = true;
      if (k === 'xp') return;
      const good = (k === 'phish' || k === 'rule' || k === 'quiz') ? v === 1 : true;
      if (k === 'mood') { Sfx.play('ok'); $$('.rf-opt', stage).forEach(x => x.classList.toggle('on', x === b)); return res(true, 'Terima kasih! Refleksimu membantu gurumu dan membuka nilai resmi. 💜'); }
      if (good) { Sfx.play('ok'); b.classList.add('ok'); res(true, k === 'phish' ? '✅ Tepat! Hadiah mendadak adalah ciri phishing. Blokir dan tanyakan pada orang dewasa.' : k === 'rule' ? '✅ Benar! Informasi tanpa sumber harus diperiksa dulu sebelum dibagikan.' : '✅ Tepat! Hasil teratas relevan, tetapi belum tentu terbaru atau benar.'); }
      else { Sfx.play('bad'); b.classList.add('bad', 'shake'); res(false, k === 'phish' ? '❌ Awas! Tautan seperti itu dapat mencuri datamu. Coba pilihan lain.' : k === 'rule' ? '❌ Menyebarkan kabar tanpa sumber bisa menyesatkan banyak orang. Coba lagi!' : '❌ Belum tepat. Pikirkan: apakah hasil teratas pasti benar dan terbaru?'); }
    });
    const xg = $('#xpg', stage); if (xg) xg.onclick = () => { auto = false; Sfx.skip = true; xp = Math.min(100, xp + 25); const lvl = 1 + Math.floor(xp / 100 * 1); $('#xpv', stage).textContent = xp; $('#xpb', stage).style.width = xp + '%'; if (xp >= 100) { Sfx.play('win'); $('#lv', stage).textContent = 2; Confetti.go(60); res(true, '🎉 Naik ke Level 2! Aktivitas berikutnya terbuka.'); xp = 0; setTimeout(() => { if ($('#xpb', stage)) { $('#xpb', stage).style.width = '0'; $('#xpv', stage).textContent = 0; } }, 1400); } else { Sfx.play('ok'); res(true, '+25 XP! Terus semangat. ⭐'); } };
  };
  $$('.stp-b', box).forEach(b => b.onclick = () => show(+b.dataset.i, true));
  $('#stpp', box).onclick = () => show(cur - 1, true); $('#stpn', box).onclick = () => show(cur + 1, true);
  box.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(cur + 1, true); if (e.key === 'ArrowLeft') show(cur - 1, true); });
  stage.addEventListener('mouseenter', () => { auto = false; });
  const ob = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { show(0); const t = setInterval(() => { if (auto && !document.hidden) show(cur + 1); }, 6500); _timers.push(t); ob.disconnect(); } }), { threshold: .25 }); ob.observe(box);
  show(0);
}

Views.masuk = function (el, q) {
  let tab = q && q.t === 'guru' ? 'guru' : 'siswa', kelas = '7A', daftarKelas = ['7A', '7B', '7C'];
  const draw = () => {
    el.innerHTML = `<div class="auth"><div class="card auth-card pop">
      <a href="#/" class="logo" style="justify-content:center;margin-bottom:14px"><img src="assets/img/logo.svg" alt="">Dunia Digital Aman</a>
      <div class="tabs"><button data-t="siswa" class="${tab === 'siswa' ? 'on' : ''}">🎒 Siswa</button><button data-t="guru" class="${tab === 'guru' ? 'on' : ''}">👩‍🏫 Guru</button></div>
      ${tab === 'siswa' ? `<div class="mt2"><label>Pilih Kelas</label><div class="chips">${daftarKelas.map(k => `<button class="chip ${k === kelas ? 'on' : ''}" data-k="${k}">${k}</button>`).join('')}</div>
        <label class="mt">NIS atau Kode Akses</label><input id="kode" placeholder="contoh: 7A-04" autocomplete="off" autocapitalize="characters"></div>`
      : `<div class="mt2"><label>Nama Pengguna</label><input id="usr" autocomplete="username" value="guru"><label class="mt">Kata Sandi</label><input id="pw" type="password" autocomplete="current-password"></div>`}
      <button class="btn btn-primary btn-block btn-lg shine mt2" id="go">Masuk ▶</button>
      <p class="center small muted mt">${API.ready() ? '' : '⚠️ Server belum dihubungkan (GAS_URL kosong). '}Belum punya akun? <a href="#/ps/beranda">Coba mode pratinjau</a></p>
      <p class="center mt"><a href="#/" class="small">← Kembali ke beranda</a></p></div></div>`;
    $$('[data-t]', el).forEach(b => b.onclick = () => { tab = b.dataset.t; draw(); });
    $$('[data-k]', el).forEach(b => b.onclick = () => { kelas = b.dataset.k; draw(); });
    const go = async () => {
      const btn = $('#go', el); btn.disabled = true; btn.textContent = 'Memeriksa…';
      const r = tab === 'siswa' ? await api('auth.siswa', { kelas, kode: $('#kode', el).value }) : await api('auth.guru', { username: $('#usr', el).value, password: $('#pw', el).value });
      btn.disabled = false; btn.textContent = 'Masuk ▶';
      if (!r.success) { toast(r.message, 'err'); $('.auth-card', el).classList.add('shake'); setTimeout(() => $('.auth-card', el) && $('.auth-card', el).classList.remove('shake'), 500); return; }
      dropCache(); Sesi.set({ token: r.data.token, me: r.data.me, exp: Date.now() + 11.5 * 3600e3 }); Confetti.go(60);
      if (r.data.me.role === 'guru') { location.hash = r.data.wajibGanti ? '#/g/impor' : '#/g/overview'; if (r.data.wajibGanti) toast('Demi keamanan, ganti kata sandi awalmu sekarang.', 'ok'); }
      else location.hash = '#/s/beranda';
    };
    $('#go', el).onclick = go; $$('input', el).forEach(i => i.onkeydown = e => { if (e.key === 'Enter') go(); });
    const f = $('input', el); if (f && matchMedia('(pointer:fine)').matches) f.focus();
  };
  draw(); warmUp();
  api('app.boot').then(r => { if (r.success && r.data.kelas && r.data.kelas.length && !($('#kode', el) || {}).value) { daftarKelas = r.data.kelas; if (daftarKelas.indexOf(kelas) < 0) kelas = daftarKelas[0]; if (tab === 'siswa') draw(); } });
};
