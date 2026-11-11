// ===== Mode Pratinjau (tamu): data CONTOH, read-only, tanpa server =====
const Demo = {
  handle(action, d) {
    return new Promise(res => setTimeout(() => {
      const f = this[action.replace(/\./g, '_')];
      res(f ? { success: true, data: f.call(this, d) } : { success: false, message: 'Mode pratinjau hanya untuk melihat tampilan — data tidak bisa diubah. Masuk dengan akunmu untuk mencoba fitur ini.' });
    }, 140));
  },
  kelasList: [{ kelas: '7A', n: 23 }, { kelas: '7B', n: 22 }, { kelas: '7C', n: 2 }],
  S: [
    { id: 'd1', nama: 'Ahmad Fauzan', nis: '7A-01', progres: 68, fase: 'Sub-bab 2', sub: [78, 72, null], rata: 75.0, sumatif: null, status: 'SEDANG', macet: null },
    { id: 'd2', nama: 'Budi Pratama', nis: '7A-04', progres: 100, fase: 'Tuntas', sub: [88, 85, 92], rata: 88.3, sumatif: 88, status: 'TUNTAS', macet: null },
    { id: 'd3', nama: 'Dimas Anggara', nis: '7A-11', progres: 100, fase: 'Tuntas', sub: [75, 70, 68], rata: 71.0, sumatif: 64, status: 'REMEDIAL', macet: null },
    { id: 'd4', nama: 'Farhan Maulana', nis: '7A-15', progres: 100, fase: 'Tuntas', sub: [92, 88, 90], rata: 90.0, sumatif: 86, status: 'TUNTAS', macet: null },
    { id: 'd5', nama: 'Rani Maharani', nis: '7A-25', progres: 45, fase: 'Sub-bab 2', sub: [82, null, null], rata: 82.0, sumatif: null, status: 'MACET', macet: { id: 'S2-L', judul: 'Lab: Cek Fakta Kuota Gratis', jenis: 'Lab' } },
    { id: 'd6', nama: 'Siti Nurhaliza', nis: '7A-28', progres: 100, fase: 'Tuntas', sub: [90, 95, 88], rata: 91.0, sumatif: 94, status: 'TUNTAS', macet: null },
    { id: 'd7', nama: 'Zahra Aulia', nis: '7A-32', progres: 100, fase: 'Tuntas', sub: [85, 84, 86], rata: 85.0, sumatif: 82, status: 'TUNTAS', macet: null }
  ],
  app_boot() { return { app: { nama: 'Menjelajahi Dunia Digital dengan Aman', kkm: 72 }, kelas: ['7A', '7B', '7C'] }; },
  guru_soalAmbil(x) {
    const daftar = PV.akt.filter(a => /Formatif|Sumatif/.test(a.jenis)), a = daftar.find(z => z.id === x.id) || daftar[0];
    return { daftar: daftar.map(z => ({ id: z.id, judul: z.judul, jenis: z.jenis })), id: a.id, judul: a.judul, jenis: a.jenis, waktuMenit: a.data.waktuMenit, pengerjaan: 0, teks: a.data.teks || [],
      soal: a.data.soal.map(q => Object.assign({ jenis: 'PG' }, q, { kunci: q.jenis === 'PGK' ? ['A'] : q.jenis === 'KAT' ? q.pernyataan.map(() => 0) : 'A', analisis: '' })) };
  },
  app_peringkat() { return { kosong: true, top: [], juaraKelas: [], perAsesmen: [], sampai: '' }; },
  siswa_beranda() {
    const st = { 'S1-M': 'selesai', 'S1-L': 'selesai', 'S1-K': 'selesai', 'S1-F': 'selesai', 'S2-M': 'selesai', 'S2-L': 'terbuka' };
    const mk = a => ({ id: a.id, jenis: a.jenis, judul: a.judul, menit: a.menit, status: st[a.id] || 'terkunci', berikutnya: a.id === 'S2-L', oleh: '' });
    const subbab = PV.subbab.map(s => { const l = PV.akt.filter(a => a.sub === s.id).map(mk), sel = l.filter(a => a.status === 'selesai').length; return { ...s, status: sel === l.length ? 'selesai' : l.every(a => a.status === 'terkunci') ? 'terkunci' : 'berjalan', selesai: sel, total: l.length, aktivitas: l }; });
    const sum = PV.akt.filter(a => a.sub === 'SUM').map(mk)[0];
    return { siswa: { id: 'tamu', nama: 'Siswa Tamu', kelas: '7A', nis: 'CONTOH' }, bab: PV.bab, subbab, sumatif: sum, progres: { selesai: 5, total: 14, persen: 36 }, tuntasBab: false, berikut: 'S2-L',
      nilai: { formatif: { S1: 80 }, rata: 80, sumatif: null, tuntas: null }, xp: 205, level: 1, bukaGuru: null, catatan: [],
      riwayat: PV.akt.filter(a => /Formatif|Sumatif/.test(a.jenis)).map(a => ({ asesmen: a.id, judul: a.judul, jenis: a.jenis, resmi: a.id === 'S1-F' ? { no: 0, skor: 80, benar: 4, total: 5, durasi: 140, waktu: '2026-10-14 10:45:00' } : null, latihan: a.id === 'S1-F' ? [{ no: 1, skor: 100, benar: 5, total: 5, durasi: 90, waktu: '2026-10-14 11:30:00' }] : [] })) };
  },
  aktivitas_baca(d) {
    const a = PV.akt.find(x => x.id === d.id); if (!a) throw new Error('x');
    const i = PV.akt.indexOf(a), n = PV.akt[i + 1];
    return { meta: { id: a.id, sub: a.sub, urut: a.urut, jenis: a.jenis, judul: a.judul, menit: a.menit }, data: a.data, status: 'terbuka', punyaResmi: false, selanjutnya: n ? { id: n.id, judul: n.judul } : null };
  },
  _ov() {
    const S = this.S, r = a => { const v = a.filter(x => x !== null); return v.length ? Math.round(v.reduce((x, y) => x + y, 0) / v.length * 10) / 10 : null; };
    return { S, rf: r(S.map(s => s.rata)), rs: r(S.map(s => s.sumatif)) };
  },
  guru_overview() {
    const { S, rf, rs } = this._ov(), tuntas = S.filter(s => s.status === 'TUNTAS').length;
    return { kelas: '7A', kelasList: this.kelasList, jumlah: S.length,
      kpi: { total: 32, selesaiPenuh: 84, rerataFormatif: 84.6, selisihKKM: 12.6, rerataSumatif: 79.8, tuntasN: 27, sudahSumatif: 32, kkm: 72, perhatian: { n: 5, macet: 1, remedial: 4 } },
      subbab: [{ id: 'S1', judul: 'Internet & Mesin Pencari', selesaiPct: 100, rata: 86.4 }, { id: 'S2', judul: 'Literasi Digital & Cek Hoaks', selesaiPct: 93, rata: 81.2 }, { id: 'S3', judul: 'Ancaman Digital & Proteksi Data', selesaiPct: 87, rata: 83.5 }],
      sumatif: { tuntasPct: 84, rata: 79.8 }, distribusi: { tuntas: 27, remedial: 5, belum: 0 }, komponen: { materi: 88, lab: 82, refleksi: 75 }, siswa: S };
  },
  guru_nilai() {
    const { S } = this._ov();
    return { kelas: '7A', kelasList: this.kelasList, sync: '2026-10-30 10:15:00', subJudul: PV.subbab.map(s => s.judul),
      kpi: { rerataFormatif: 82.4, rerataSumatif: 79.8, tuntasN: 27, total: 32, remedial: 5, jurnal: 30, jurnalTotal: 32, kkm: 72 },
      perSub: [{ id: 'S1', rata: 86.4 }, { id: 'S2', rata: 81.2 }, { id: 'S3', rata: 83.5 }], siswa: S };
  },
  guru_log(d) {
    const keys = { 1: 'B', 2: 'A', 3: 'D', 4: 'C', 5: 'B' }, jw = { 1: 'B', 2: 'C', 3: 'D', 4: 'C', 5: 'B' };
    const an = { 1: 'Domain instansi resmi pemerintah memakai .go.id. Domain gratis seperti .xyz adalah ciri phishing.', 2: 'Fakta dapat diverifikasi dengan data terukur; opini dipengaruhi pandangan pribadi.', 3: 'Prinsip S.A.R.I membantu menyaring dan memverifikasi sebelum menyebarkan.', 4: 'Hoaks memancing emosi dan mendesak disebarkan tanpa sumber.', 5: 'Pencarian gambar terbalik membantu menemukan sumber asli foto.' };
    const f = PV.akt.find(a => a.id === 'S2-F');
    return { kelas: '7A', kelasList: this.kelasList, siswaList: this.S.map(s => ({ id: s.id, nama: s.nama, nis: s.nis })),
      siswa: { id: 'd2', nama: 'Budi Pratama', nis: '7A-04', kelas: '7A', nilai: { sumatif: 88 } },
      asesmenList: PV.akt.filter(a => /Formatif|Sumatif/.test(a.jenis)).map(a => ({ id: a.id, judul: a.judul, jenis: a.jenis, ada: true })), pilih: 'S2-F',
      percobaan: [{ no: 0, skor: 80, benar: 4, total: 5, durasi: 860, waktu: '2026-10-14 10:45:00' }, { no: 1, skor: 100, benar: 5, total: 5, durasi: 540, waktu: '2026-10-14 11:30:00' }],
      tampil: 0, pcSel: { no: 0, skor: 80, benar: 4, total: 5, durasi: 860, waktu: '2026-10-14 10:45:00' },
      soal: f.data.soal.map(q => ({ no: q.no, jenis: 'PG', gambar: q.gambar || '', topik: q.topik, kasus: q.kasus || '', tanya: q.tanya, opsi: q.opsi, jawab: jw[q.no], kunci: keys[q.no], kredit: jw[q.no] === keys[q.no] ? 1 : 0, benar: jw[q.no] === keys[q.no], analisis: an[q.no], catatan: q.no === 2 ? 'Budi perlu penguatan kembali tentang fakta vs opini.' : '' })),
      refleksi: { perasaan: 'Paham', isi: 'Saya belajar bahwa kode OTP dan password tidak boleh diberikan ke siapa pun bahkan jika mengaku pihak resmi game. Saya juga harus selalu memeriksa tautan domain seperti .xyz atau .com palsu.', waktu: '2026-10-14 10:45:00', catatan: '' },
      audit: [{ waktu: '2026-10-14 10:45:00', judul: 'Nilai resmi tercatat: Asesmen Formatif Sub-bab 2', detail: 'Skor 80 (4/5)', tipe: 'nilai' }, { waktu: '2026-10-14 09:55:00', judul: 'Tuntas: Lab: Cek Fakta Kuota Gratis', detail: 'Durasi 18 mnt 0 dtk', tipe: 'ok' }, { waktu: '2026-10-14 09:30:00', judul: 'Tuntas: Materi: Fakta vs Opini & Hoaks', detail: 'Durasi 6 mnt 10 dtk', tipe: 'ok' }] };
  },
  guru_kunci(d) {
    const st = {}; PV.akt.forEach(a => st[a.id] = /^S1|S2-M/.test(a.id) ? 'selesai' : a.id === 'S2-L' ? 'terbuka' : 'terkunci');
    return { kelas: '7A', kelasList: this.kelasList, aktivitas: PV.akt, subbab: PV.subbab, siswa: this.S.map(s => ({ id: s.id, nama: s.nama, nis: s.nis, progres: s.progres, macet: !!s.macet })),
      detail: { id: 'd5', nama: 'Rani Maharani', nis: '7A-25', progres: 45, macet: this.S[4].macet, status: st },
      stat: { minggu: 8, perKelas: { '7A': 3, '7B': 2, '7C': 1 }, kategori: { 'Kendala Gawai': 5, 'Sakit/Izin': 2, 'Remedial Mandiri': 1 }, perluIntervensi: ['Rani M.', 'Galih P.', 'Dita S.'] },
      riwayat: [
        { waktu: '2026-10-14 10:48:00', guru: PV.bab.guru, siswa: 'Rani Maharani', kelas: '7A', aktivitas: ['Lab: Cek Fakta Kuota Gratis'], cakupan: 'Per Siswa', kategori: 'Kendala Gawai', alasan: 'Browser lab freeze saat simpan data eksperimen.' },
        { waktu: '2026-10-14 09:15:00', guru: PV.bab.guru, siswa: 'Dimas Anggara', kelas: '7A', aktivitas: ['Asesmen Formatif Sub-bab 1'], cakupan: 'Per Siswa', kategori: 'Remedial Mandiri', alasan: 'Remedial mandiri terjadwal di lab komputer.' },
        { waktu: '2026-10-13 14:20:00', guru: 'Bpk. Hendra Wijaya, S.Pd', siswa: 'Seluruh Siswa (32)', kelas: '7C', aktivitas: ['Materi: Internet & Mesin Pencari'], cakupan: 'Per Kelas', kategori: 'Penugasan Khusus', alasan: 'Pembelajaran sinkron serentak menggunakan proyektor.' }] };
  }
};
