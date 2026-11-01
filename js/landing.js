// ===== Halaman muka (landing) + halaman masuk =====
const Views = window.Views = window.Views || {};
const IMG = n => 'assets/img/' + n + '.svg';
const MODUL = [
  { id: 'S1', tag: 'Sub-bab 1', judul: 'Cara Kerja Internet & Mesin Pencari', ket: 'Ikuti perjalanan paket data dan bongkar rahasia robot penjelajah mesin pencari.', img: ['modul-1-a', 'modul-1-b', 'modul-1-c'], chip: ['📖 Materi', '🧪 Lab (3 Simulasi)', '🧩 Kegiatan', '📝 Asesmen'], menit: 62 },
  { id: 'S2', tag: 'Sub-bab 2', judul: 'Literasi Digital & Evaluasi Informasi', ket: 'Jadi detektif cek fakta: kenali hoaks, periksa domain, dan terapkan prinsip S.A.R.I.', img: ['modul-2-a', 'modul-2-b', 'modul-2-c'], chip: ['📖 Materi', '🧪 Lab (3 Simulasi)', '🧩 Eksperimen Hoaks', '📝 Asesmen'], menit: 71 },
  { id: 'S3', tag: 'Sub-bab 3', judul: 'Ancaman Digital & Perlindungan Data Pribadi', ket: 'Tangkis phishing, jaga kode OTP, buat sandi kuat, dan aktifkan verifikasi dua langkah.', img: ['modul-3-a', 'modul-3-b', 'modul-3-c'], chip: ['📖 Materi', '🧪 Lab (3 Simulasi)', '🔑 Bengkel Sandi', '📝 Asesmen'], menit: 61 },
  { id: 'SUM', tag: 'Uji Kompetensi', judul: 'Asesmen Sumatif Bab 2 (Simulasi TKA)', ket: 'Tampilan ujian berbasis komputer: 3 bentuk soal, daftar soal, ragu-ragu, dan timer. Terbuka setelah semua sub-bab selesai. KKM 72.', img: ['modul-4-a', 'modul-4-b', 'modul-4-c'], chip: ['🏆 20 Soal Format TKA', '⭐ Nilai Resmi'], menit: 40 }
];
const ALUR = [['📖', 'Pahami', 'Materi interaktif bernarasi yang dekat dengan keseharianmu.'], ['🧪', 'Praktikkan', 'Lab & simulasi: cari fakta, bongkar pesan phishing.'], ['🧩', 'Terapkan', 'Kegiatan studi kasus: pilih langkah terbaik.'], ['📝', 'Asesmen', 'Soal bernarasi dengan umpan balik langsung.'], ['💭', 'Refleksi', 'Tuliskan pelajaranmu, lalu nilai resmi terbuka.'], ['🏅', 'Naik Level', 'Sub-bab berikutnya terbuka. Selesai semua = bebas belajar ulang!']];
const FITUR = [['🔒', 'Kunci berurutan, dijaga server', 'Aktivitas terkunci tidak bisa dibuka lewat tautan atau kode di browser.'], ['🔁', 'Latihan ulang bebas beban', 'Nilai resmi dari pengerjaan pertama. Latihan tidak menimpa nilai.'], ['📊', 'Dashboard guru 4 kelas', 'Progres, nilai, grafik statistik, filter, dan buka kunci manual.'], ['📥', 'Unduh Excel & PDF', 'Rekap nilai resmi siap untuk e-Rapor/Dapodik.']];

Views.landing = function (el) {
  const hero = [
    ['Jelajahi <em>Dunia Digital</em> dengan Aman', 'Belajar Koding Bab 2 lewat cerita, lab simulasi, dan tantangan seru. Dari cara kerja internet sampai menangkis phishing!', 'hero-1', '🚀 Koding · SMP Kelas VII'],
    ['Lindungi <em>Data Pribadimu</em> dari Phishing', 'Kenali pesan hadiah palsu, jaga kode OTP, buat sandi kuat, dan aktifkan verifikasi dua langkah.', 'hero-2', '🛡️ Keamanan Digital'],
    ['Jadi <em>Detektif Cek Fakta</em> Anti Hoaks', 'Bandingkan domain, telusuri sumber, dan terapkan prinsip S.A.R.I sebelum membagikan apa pun.', 'hero-3', '🔎 Literasi Digital']
  ];
  el.innerHTML = `
  <header class="nav"><div class="container">
    <a class="logo" href="#/"><img src="assets/img/logo.svg" alt="">Dunia Digital Aman</a>
    <nav class="nav-links"><a href="#identitas">Identitas</a><a href="#modul">Modul</a><a href="#alur">Cara Belajar</a><a href="#guru">Untuk Guru</a><a href="#testi">Cerita Mereka</a></nav>
    <div class="row"><a class="btn btn-ghost btn-sm" href="#/masuk?t=guru">Masuk Guru</a><a class="btn btn-primary btn-sm shine" href="#/masuk">Masuk Siswa</a></div>
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
    ${[[3, 'Sub-bab', ''], [13, 'Aktivitas Berurutan', ''], [4, 'Kelas (7A–7D)', ''], [72, 'KKM Sumatif', '']].map(s => `<div class="card stat glow rv"><b data-count="${s[0]}">0</b><span class="muted">${s[1]}</span></div>`).join('')}
  </div></section>
  <section class="sec" id="identitas" style="padding-bottom:20px"><div class="container"><div class="rv">${Stu.identitas(PV.bab, true)}</div></div></section>
  <section class="sec" id="modul"><div class="container">
    <h2 class="center rv">Pilih Petualangan Belajarmu</h2><p class="lead rv">Tiga sub-bab seru dan satu uji kompetensi. Arahkan kursor ke kartu — gambarnya berganti otomatis!</p>
    <div class="grid g4">${MODUL.map(m => `
      <article class="card prod glow tilt rv"><span class="badge b-warm tag">${m.tag}</span>
        <div class="slides" data-slides="${m.img.map(IMG).join(',')}"></div>
        <div class="body"><h4>${m.judul}</h4><p class="muted small">${m.ket}</p>
          <div class="row wrap">${m.chip.map(c => `<span class="badge">${c}</span>`).join('')}</div>
          <div class="row between" style="margin-top:auto"><span class="small muted">⏱ ±${m.menit} menit</span><a class="btn btn-green btn-sm shine" href="#/ps/beranda">Pratinjau ▶</a></div></div>
      </article>`).join('')}</div>
  </div></section>
  <section class="sec" id="alur" style="background:#fff"><div class="container">
    <h2 class="center rv">Alur Belajar yang Menyenangkan</h2><p class="lead rv">Setiap sub-bab mengikuti enam langkah. Aktivitas berikutnya terbuka setelah yang sebelumnya selesai.</p>
    <div class="grid g3">${ALUR.map((a, i) => `<div class="card step glow rv"><div class="n">${i + 1}</div><div style="font-size:34px">${a[0]}</div><h4>${a[1]}</h4><p class="muted small">${a[2]}</p></div>`).join('')}</div>
  </div></section>
  <section class="sec" id="guru"><div class="container grid g2" style="align-items:center">
    <div class="rv"><span class="badge">👩‍🏫 Untuk Guru</span><h2 class="mt">Pantau 4 Kelas dalam Satu Dashboard</h2><p class="muted mt">Lihat progres setiap siswa, nilai resmi per sub-bab, siapa yang perlu remedial, lalu buka kunci aktivitas secara manual — lengkap dengan catatan audit.</p>
      <div class="grid g2 mt2" style="gap:12px">${FITUR.map(f => `<div class="card glow" style="padding:14px"><div style="font-size:26px">${f[0]}</div><b>${f[1]}</b><p class="muted small">${f[2]}</p></div>`).join('')}</div>
      <a class="btn btn-primary mt2 shine" href="#/pg/overview">📊 Lihat Pratinjau Dashboard Guru</a></div>
    <div class="card rv" style="padding:24px"><div class="row between"><b>Performa Antar Sub-bab</b><span class="badge">KKM 72</span></div>
      ${[['Internet & Mesin Pencari', 86], ['Literasi Digital', 81], ['Ancaman & Proteksi Data', 84]].map(b => `<div class="mt"><div class="row between small"><span>${b[0]}</span><b>${b[1]}</b></div><div class="bar"><i data-w="${b[1]}%"></i></div></div>`).join('')}
      <div class="row mt2"><div class="card" style="flex:1;text-align:center;padding:14px;background:#e9f9e4"><b style="font:800 28px var(--ff-h);color:var(--green-d)">27</b><div class="small">Tuntas</div></div><div class="card" style="flex:1;text-align:center;padding:14px;background:var(--danger-s)"><b style="font:800 28px var(--ff-h);color:var(--danger)">5</b><div class="small">Remedial</div></div></div></div>
  </div></section>
  <section class="sec" id="testi" style="background:linear-gradient(180deg,#fff,#f4efff)"><div class="container">
    <h2 class="center rv">Kata Mereka</h2><p class="lead rv">Kartu berputar sendiri — arahkan kursor untuk melihatnya menyala, klik untuk membaca selengkapnya.</p>
    <div class="grid g3" id="testi-grid"></div><p class="center small muted mt2">* Contoh testimoni. Ganti lewat sheet "Testimoni" di Google Sheets.</p>
  </div></section>
  <section class="container sec"><div class="cta-band rv"><div class="blob" style="width:240px;height:240px;background:#fff;opacity:.15;left:-60px;top:-60px"></div>
    <h2>Siap menjadi Penjelajah Digital yang Aman?</h2><p style="opacity:.9;margin:10px 0 24px">Masuk dengan NIS atau kode akses dari gurumu.</p>
    <a class="btn btn-lg shine" style="background:#fff;color:var(--primary-d)" href="#/masuk">▶ Mulai Sekarang</a></div></section>
  <footer><div class="container row between wrap"><div><b style="color:#fff;font-family:var(--ff-h)">Menjelajahi Dunia Digital dengan Aman</b><div class="small">Koding dan Kecerdasan Artifisial · Kelas VII · Fase D · Guru: ${esc(PV.bab.guru)}</div></div>
    <div class="row"><button class="btn btn-sm" style="background:#2e2b57;color:#fff" data-act="lup">🔍 Kursor Lup: nyala/mati</button></div></div></footer>`;
  renderTesti(PV.testi);
  $('[data-act=lup]', el).onclick = () => Lup.toggle();
  initHero(el); initFlip(el); afterRender(el);
  api('app.boot').then(r => { if (r.success && r.data.testimoni && r.data.testimoni.length && location.hash.replace('#', '') === '/') { renderTesti(r.data.testimoni); initFlip(el.querySelector('#testi-grid')); } });
};
function renderTesti(list) {
  const g = $('#testi-grid'); if (!g) return;
  g.innerHTML = list.map((t, i) => `<div class="flipwrap" data-i="${i}"><div class="flip">
    <div class="face"><div class="row"><div class="avatar" style="background:${esc(t.warna)}">${esc(t.avatar)}</div><div><b>${esc(t.nama)}</b><div class="small muted">${esc(t.peran)}</div></div></div>
      <div class="stars">${'★'.repeat(t.bintang || 5)}${'☆'.repeat(5 - (t.bintang || 5))}</div><h4>“${esc(t.judul)}”</h4><span class="small muted">Klik untuk membaca ↻</span></div>
    <div class="face back"><div class="stars">${'★'.repeat(t.bintang || 5)}</div><p style="display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden">${esc(t.teks)}</p><b>— ${esc(t.nama)}</b><span class="small" style="opacity:.85">Klik untuk tampilan lengkap ⤢</span></div></div></div>`).join('');
  $$('.flipwrap', g).forEach(w => w.onclick = () => {
    const t = list[+w.dataset.i];
    const m = modal(`<div class="row"><div class="avatar" style="background:${esc(t.warna)}">${esc(t.avatar)}</div><div><h3>${esc(t.nama)}</h3><div class="muted small">${esc(t.peran)}</div></div></div><div class="stars mt" style="font-size:22px">${'★'.repeat(t.bintang || 5)}${'☆'.repeat(5 - (t.bintang || 5))}</div><h4 class="mt">“${esc(t.judul)}”</h4><p class="mt" style="font-size:17px">${esc(t.teks)}</p>`);
    Confetti.go(40);
  });
}

Views.masuk = function (el, q) {
  let tab = q && q.t === 'guru' ? 'guru' : 'siswa', kelas = '7A';
  const draw = () => {
    el.innerHTML = `<div class="auth"><div class="card auth-card pop">
      <a href="#/" class="logo" style="justify-content:center;margin-bottom:14px"><img src="assets/img/logo.svg" alt="">Dunia Digital Aman</a>
      <div class="tabs"><button data-t="siswa" class="${tab === 'siswa' ? 'on' : ''}">🎒 Siswa</button><button data-t="guru" class="${tab === 'guru' ? 'on' : ''}">👩‍🏫 Guru</button></div>
      ${tab === 'siswa' ? `<div class="mt2"><label>Pilih Kelas</label><div class="chips">${['7A', '7B', '7C', '7D'].map(k => `<button class="chip ${k === kelas ? 'on' : ''}" data-k="${k}">${k}</button>`).join('')}</div>
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
};
