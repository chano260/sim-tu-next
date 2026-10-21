import { Siswa, Surat, NilaiMapel } from '@/types';

export function angkaKeTerbilang(nilai: number): string {
  const bilangan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];

  const floor = Math.floor(nilai);
  let hasil = '';

  if (floor < 12) {
    hasil = bilangan[floor];
  } else if (floor < 20) {
    hasil = bilangan[floor - 10] + ' Belas';
  } else if (floor < 100) {
    const puluhan = Math.floor(floor / 10);
    const sisa = floor % 10;
    hasil = bilangan[puluhan] + ' Puluh' + (sisa ? ' ' + bilangan[sisa] : '');
  } else if (floor === 100) {
    hasil = 'Seratus';
  } else {
    hasil = floor.toString();
  }

  const desimal = Math.round((nilai - floor) * 10);
  if (desimal > 0) {
    hasil += ' Koma ' + (bilangan[desimal] || desimal.toString());
  }

  return hasil;
}

export interface SiswaBukuInduk {
  id: string;
  namaLengkap: string;
  nis: string;
  nisn: string;
  jenisKelamin: 'L' | 'P';
  kelas: string;
  jurusan: 'MIPA' | 'IPS';
  tempatLahir: string;
  tanggalLahir: string;
  namaOrangTua: string;
  nomorHpWali: string;
  alamat: string;
  status: 'Aktif' | 'Mutasi Keluar' | 'Alumni';
}

export interface PegawaiGTK {
  id: string;
  namaLengkap: string;
  nip: string;
  nuptk: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'Honorer';
  pangkatGolongan: string;
  jabatan: string;
  tmt: string;
  jadwalKgb: string; // Kenaikan Gaji Berkala
  statusKgb: 'Aman' | 'Segera KGB' | 'Jatuh Tempo';
}

export interface InventarisBarang {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  ruangan: string;
  jumlah: number;
  satuan: string;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  sumberPengadaan: string;
  tahun: string;
}

export interface PeminjamanBarang {
  id: string;
  namaBarang: string;
  peminjam: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  status: 'Dipinjam' | 'Dikembalikan';
  keperluan: string;
}

export const initialBukuInduk: SiswaBukuInduk[] = [
  {
    id: 's-1',
    namaLengkap: 'MUHAMMAD RIZKY PRATAMA',
    nis: '212210045',
    nisn: '0067829102',
    jenisKelamin: 'L',
    kelas: 'XII MIPA 1',
    jurusan: 'MIPA',
    tempatLahir: 'Waekerta',
    tanggalLahir: '14 Mei 2006',
    namaOrangTua: 'Bambang Sudarsono',
    nomorHpWali: '081240981234',
    alamat: 'Jl. Trans Buru KM 12, Waekerta',
    status: 'Aktif'
  },
  {
    id: 's-2',
    namaLengkap: 'NUR ANISA RAHMAWATI',
    nis: '212210088',
    nisn: '0065432190',
    jenisKelamin: 'P',
    kelas: 'XII MIPA 1',
    jurusan: 'MIPA',
    tempatLahir: 'Namlea',
    tanggalLahir: '21 Agustus 2006',
    namaOrangTua: 'Rahman Hidayat',
    nomorHpWali: '081345678901',
    alamat: 'Desa Waeapo Dusun 2, Buru',
    status: 'Aktif'
  },
  {
    id: 's-3',
    namaLengkap: 'FANDI AHMAD LATUCONSINA',
    nis: '212210112',
    nisn: '0061298471',
    jenisKelamin: 'L',
    kelas: 'XII IPS 1',
    jurusan: 'IPS',
    tempatLahir: 'Waeapo',
    tanggalLahir: '03 Februari 2006',
    namaOrangTua: 'Hasan Latuconsina',
    nomorHpWali: '082199887766',
    alamat: 'Jl. Pertanian RT 04, Waekerta',
    status: 'Aktif'
  },
  {
    id: 's-4',
    namaLengkap: 'SITI AISYAH WAKANO',
    nis: '212210140',
    nisn: '0069384712',
    jenisKelamin: 'P',
    kelas: 'XII IPS 2',
    jurusan: 'IPS',
    tempatLahir: 'Waekerta',
    tanggalLahir: '11 Oktober 2005',
    namaOrangTua: 'Daud Wakano',
    nomorHpWali: '085244556677',
    alamat: 'Kompleks Pasar Lama Waekerta',
    status: 'Aktif'
  },
  {
    id: 's-5',
    namaLengkap: 'DIMAS ADITYA SAPUTRA',
    nis: '222310012',
    nisn: '0078129304',
    jenisKelamin: 'L',
    kelas: 'XI MIPA 2',
    jurusan: 'MIPA',
    tempatLahir: 'Ambon',
    tanggalLahir: '17 Juli 2007',
    namaOrangTua: 'Joko Saputra',
    nomorHpWali: '081299001122',
    alamat: 'Jl. Pendidikan No. 8 Waekerta',
    status: 'Aktif'
  },
  {
    id: 's-6',
    namaLengkap: 'CINTA AULIA WULANDARI',
    nis: '232410090',
    nisn: '0089201928',
    jenisKelamin: 'P',
    kelas: 'X-1',
    jurusan: 'MIPA',
    tempatLahir: 'Waekerta',
    tanggalLahir: '05 Januari 2008',
    namaOrangTua: 'Agus Wulandari',
    nomorHpWali: '081377889900',
    alamat: 'Dusun Mekar Jaya, Waekerta',
    status: 'Aktif'
  }
];

export const initialPegawai: PegawaiGTK[] = [
  {
    id: 'p-1',
    namaLengkap: 'Drs. H. AHMAD KELIAN, M.Pd',
    nip: '19680815 199512 1 002',
    nuptk: '4534746648200012',
    statusKepegawaian: 'PNS',
    pangkatGolongan: 'Pembina Utama Muda (IV/c)',
    jabatan: 'Kepala Sekolah',
    tmt: '01 Januari 2020',
    jadwalKgb: '01 Desember 2024',
    statusKgb: 'Segera KGB'
  },
  {
    id: 'p-2',
    namaLengkap: 'HENDRA PRASETYA, S.Pd',
    nip: '19790412 200501 1 008',
    nuptk: '1238757659200023',
    statusKepegawaian: 'PNS',
    pangkatGolongan: 'Penata Tk. I (III/d)',
    jabatan: 'Wakasek Kurikulum / Guru Fisika',
    tmt: '01 Maret 2012',
    jadwalKgb: '01 Maret 2025',
    statusKgb: 'Aman'
  },
  {
    id: 'p-3',
    namaLengkap: 'MARIA FATIMA LEKATOMPESSY, S.Pd',
    nip: '19841103 201001 2 015',
    nuptk: '8745762664300045',
    statusKepegawaian: 'PNS',
    pangkatGolongan: 'Penata (III/c)',
    jabatan: 'Kepala Tata Usaha (KTU)',
    tmt: '01 Januari 2018',
    jadwalKgb: '01 Oktober 2024',
    statusKgb: 'Jatuh Tempo'
  },
  {
    id: 'p-4',
    namaLengkap: 'WA ODE RAHMAWATI, S.Pd',
    nip: '19920510 202221 2 021',
    nuptk: '3456789123450001',
    statusKepegawaian: 'PPPK',
    pangkatGolongan: 'Ahli Pertama (IX)',
    jabatan: 'Guru Matematika',
    tmt: '01 Juni 2022',
    jadwalKgb: '01 Juni 2025',
    statusKgb: 'Aman'
  },
  {
    id: 'p-5',
    namaLengkap: 'FAISAL BUTON, A.Md.Kom',
    nip: '-',
    nuptk: '9081726354430099',
    statusKepegawaian: 'Honorer',
    pangkatGolongan: 'Staf Honorer',
    jabatan: 'Pengelola Data & Arsip TU',
    tmt: '15 Juli 2021',
    jadwalKgb: '-',
    statusKgb: 'Aman'
  }
];

export const initialInventaris: InventarisBarang[] = [
  {
    id: 'inv-1',
    kodeBarang: 'KIR-LABKOM-001',
    namaBarang: 'Komputer All-in-One PC Core i5',
    ruangan: 'Laboratorium Komputer',
    jumlah: 32,
    satuan: 'Unit',
    kondisi: 'Baik',
    sumberPengadaan: 'DAK Fisik Pendidikan',
    tahun: '2022'
  },
  {
    id: 'inv-2',
    kodeBarang: 'KIR-LABKOM-002',
    namaBarang: 'LCD Proyektor InFocus Epson EB-X500',
    ruangan: 'Laboratorium Komputer',
    jumlah: 2,
    satuan: 'Unit',
    kondisi: 'Baik',
    sumberPengadaan: 'Pemerintah Daerah',
    tahun: '2023'
  },
  {
    id: 'inv-3',
    kodeBarang: 'KIR-LABIPA-001',
    namaBarang: 'Mikroskop Binokuler Siswa',
    ruangan: 'Laboratorium IPA',
    jumlah: 15,
    satuan: 'Set',
    kondisi: 'Baik',
    sumberPengadaan: 'Bantuan Kemendikbud',
    tahun: '2021'
  },
  {
    id: 'inv-4',
    kodeBarang: 'KIR-RGURU-001',
    namaBarang: 'Printer Epson L3210 Ink Tank',
    ruangan: 'Ruang Tata Usaha',
    jumlah: 2,
    satuan: 'Unit',
    kondisi: 'Baik',
    sumberPengadaan: 'Sekolah',
    tahun: '2023'
  },
  {
    id: 'inv-5',
    kodeBarang: 'KIR-KELAS-010',
    namaBarang: 'Meja & Kursi Belajar Siswa Kayu',
    ruangan: 'Ruang Kelas XII MIPA 1',
    jumlah: 36,
    satuan: 'Set',
    kondisi: 'Baik',
    sumberPengadaan: 'Pemerintah Daerah',
    tahun: '2020'
  }
];

export const initialPeminjaman: PeminjamanBarang[] = [
  {
    id: 'pinjam-1',
    namaBarang: 'LCD Proyektor InFocus Epson EB-X500',
    peminjam: 'Hendra Prasetya, S.Pd (Guru Fisika)',
    tanggalPinjam: '28 Oktober 2024, 08:00',
    tanggalKembali: '28 Oktober 2024, 11:30',
    status: 'Dipinjam',
    keperluan: 'Presentasi Pembelajaran Optika Kelas XII'
  },
  {
    id: 'pinjam-2',
    namaBarang: 'Kabel Rol Panjang 25 Meter',
    peminjam: 'Panitia OSIS SMA Negeri 3 Buru',
    tanggalPinjam: '27 Oktober 2024, 13:00',
    tanggalKembali: '27 Oktober 2024, 17:00',
    status: 'Dikembalikan',
    keperluan: 'Kegiatan Latihan Upacara Sumpah Pemuda'
  }
];

export const initialSurat: Surat[] = [
  {
    id: 'surat-1',
    nomorSurat: '421.3/012/C/2024',
    tanggal: '28 Oktober 2024',
    perihal: 'Surat Undangan Rapat Komite dan Evaluasi Belajar',
    tujuanPengirim: 'Orang Tua / Wali Siswa Kelas X s/d XII',
    jenis: 'Keluar',
    status: 'Selesai'
  },
  {
    id: 'surat-2',
    nomorSurat: '045/Leg/2024',
    tanggal: '27 Oktober 2024',
    perihal: 'Permohonan Legalisir Ijazah a.n. Ani Suryani (Alumni 2022)',
    tujuanPengirim: 'Alumni (Ani Suryani)',
    jenis: 'Masuk',
    status: 'Proses'
  },
  {
    id: 'surat-3',
    nomorSurat: '800/210/Disdikbud/2024',
    tanggal: '25 Oktober 2024',
    perihal: 'Edaran Penyesuaian Jadwal Asesmen Semester Ganjil',
    tujuanPengirim: 'Dinas Pendidikan & Kebudayaan Prov. Maluku',
    jenis: 'Masuk',
    status: 'Disposisi'
  },
  {
    id: 'surat-4',
    nomorSurat: '421.3/090/SMAN.3/2024',
    tanggal: '24 Oktober 2024',
    perihal: 'Surat Keterangan Aktif Siswa a.n. Dimas Aditya Saputra',
    tujuanPengirim: 'Bank BNI (Keperluan Rekening PIP Siswa)',
    jenis: 'Keluar',
    status: 'Selesai'
  },
  {
    id: 'surat-5',
    nomorSurat: '090/04/TUGAS/2024',
    tanggal: '22 Oktober 2024',
    perihal: 'Surat Tugas Mengikuti MGMP Fisika Kabupaten Buru',
    tujuanPengirim: 'Hendra Prasetya, S.Pd',
    jenis: 'Keluar',
    status: 'Selesai'
  }
];

export const mockSurat = initialSurat;

export const profilSekolah = {
  nama: 'SMA NEGERI 3 BURU',
  instansiAtas1: 'PEMERINTAH PROVINSI MALUKU',
  instansiAtas2: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
  alamat: 'Jl. Joyoboyo No. 04 Waekerta, Email : smanegeri3buru@gmail.com - Kode Pos 97574',
  alamatTranskrip: 'Jl. Joyoboyo No. 04 Waekerta, Kec. Waeapo, Kab. Buru',
  email: 'smanegeri3buru@gmail.com',
  kodePos: '97574',
  npsn: '60101015',
  kepalaSekolah: 'ANTON LA HARI, S.Pd., M.Pd.',
  nipKepalaSekolah: '19780703 200312 1 005',
  pangkatKepalaSekolah: 'Pembina Utama Muda - IV/c',
  jabatanKepalaSekolah: 'Kepala Sekolah',
  alamatKepalaSekolah: 'Waekerta , Kec. Waeapo',
  tahunAjaran: '2025/2026',
  tahunAktif: '2026',
  tanggalRapat: '04 Mei 2026',
  tanggalTerbit: '04 Mei 2026'
};

export const initialSiswa: Siswa[] = [
  {
    id: '1',
    namaLengkap: 'Putri Anisa Pulhehe',
    tempatLahir: 'Mamala',
    tanggalLahir: '27 Maret 2008',
    nis: '212210087',
    nisn: '0081332192',
    namaOrangTua: 'Bpk. Pulhehe',
    nomorPeserta: '03-0045-0087-2',
    kelas: 'XII MIPA 1',
    jurusan: 'MIPA',
    peminatanSkl: 'ILMU PENGETAHUAN ALAM',
    peminatanTranskrip: 'Matematika dan Ilmu Pengetahuan Alam',
    npsn: '60101015',
    statusKelulusan: 'LULUS',
    nomorSuratSkl: '087',
    nomorSuratTranskrip: '087',
    nomorIjazah: '131202616236686',
    tanggalKelulusan: '04 Mei 2026',
    tahunAjaran: '2025/2026',
    rataRataSkl: '83,14',
    rataRata: 83.14,
    rataRataTerbilang: 'Delapan Puluh Tiga Koma Satu Empat',
    nomorSurat: '087',
    nilaiSkl: [
      { id: 1, no: 1, nama: 'Pendidikan Agama dan Budi Pekerti', kelompok: 'A', nilai: '84,94' },
      { id: 2, no: 2, nama: 'Pendidikan Pancasila dan Kewarganegaraan', kelompok: 'A', nilai: '82,00' },
      { id: 3, no: 3, nama: 'Bahasa Indonesia', kelompok: 'A', nilai: '83,00' },
      { id: 4, no: 4, nama: 'Matematika', kelompok: 'A', nilai: '78,00' },
      { id: 5, no: 5, nama: 'Sejarah Indonesia', kelompok: 'A', nilai: '87,00' },
      { id: 6, no: 6, nama: 'Bahasa Inggris', kelompok: 'A', nilai: '83,00' },
      { id: 7, no: 1, nama: 'Seni Budaya', kelompok: 'B', nilai: '85,00' },
      { id: 8, no: 2, nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', kelompok: 'B', nilai: '90,00' },
      { id: 9, no: 3, nama: 'Prakarya dan Kewirausahaan', kelompok: 'B', nilai: '85,00' },
      { id: 10, no: 4, nama: 'Bahasa Arab', kelompok: 'B', nilai: '-' },
      { id: 11, no: 1, nama: 'Matematika (Tingkat Lanjut)', kelompok: 'C', nilai: '80,00' },
      { id: 12, no: 2, nama: 'Biologi', kelompok: 'C', nilai: '80,00' },
      { id: 13, no: 3, nama: 'Fisika', kelompok: 'C', nilai: '85,00' },
      { id: 14, no: 4, nama: 'Kimia', kelompok: 'C', nilai: '81,00' },
      { id: 15, no: 5, nama: 'Pilihan Lintas Minat/Pendalaman Minat', kelompok: 'C', nilai: '-' },
      { id: 16, no: 6, nama: 'Geografi', kelompok: 'C', nilai: '80,00', isItalic: true }
    ],
    nilaiTranskrip: [
      { no: 1, nama: 'Pendidikan Agama dan Budi Pekerti', nilai: '84,94' },
      { no: 2, nama: 'Pendidikan Pancasila dan Kewarganegaraan', nilai: '82,00' },
      { no: 3, nama: 'Bahasa Indonesia', nilai: '83,00' },
      { no: 4, nama: 'Matematika', nilai: '78,00' },
      { no: 5, nama: 'Sejarah Indonesia', nilai: '87,00' },
      { no: 6, nama: 'Bahasa Inggris', nilai: '83,00' },
      { no: 7, nama: 'Seni Budaya', nilai: '85,00' },
      { no: 8, nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', nilai: '90,00' },
      { no: 9, nama: 'Prakarya dan Kewirausahaan', nilai: '85,00' },
      { no: 10, nama: 'Matematika (Tingkat Lanjut)', nilai: '80,00' },
      { no: 11, nama: 'Biologi', nilai: '80,00' },
      { no: 12, nama: 'Fisika', nilai: '85,00' },
      { no: 13, nama: 'Kimia', nilai: '81,00' },
      { no: 14, nama: 'Geografi', nilai: '80,00' }
    ]
  },
  {
    id: '2',
    namaLengkap: 'Emelda Kirana Sela',
    tempatLahir: 'Maluku Tengah',
    tanggalLahir: '20 Mei 2008',
    nis: '212210074',
    nisn: '0089153758',
    namaOrangTua: 'Bpk. Sela',
    nomorPeserta: '03-0045-0074-9',
    kelas: 'XII MIPA 2',
    jurusan: 'MIPA',
    peminatanSkl: 'ILMU PENGETAHUAN ALAM',
    peminatanTranskrip: 'Matematika dan Ilmu Pengetahuan Alam',
    npsn: '60101015',
    statusKelulusan: 'LULUS',
    nomorSuratSkl: '074',
    nomorSuratTranskrip: '074',
    nomorIjazah: '131202616236687',
    tanggalKelulusan: '04 Mei 2026',
    tahunAjaran: '2025/2026',
    rataRataSkl: '86,26',
    rataRata: 86.26,
    rataRataTerbilang: 'Delapan Puluh Enam Koma Dua Enam',
    nomorSurat: '074',
    nilaiSkl: [
      { id: 1, no: 1, nama: 'Pendidikan Agama dan Budi Pekerti', kelompok: 'A', nilai: '85,61' },
      { id: 2, no: 2, nama: 'Pendidikan Pancasila dan Kewarganegaraan', kelompok: 'A', nilai: '90,00' },
      { id: 3, no: 3, nama: 'Bahasa Indonesia', kelompok: 'A', nilai: '87,00' },
      { id: 4, no: 4, nama: 'Matematika', kelompok: 'A', nilai: '80,00' },
      { id: 5, no: 5, nama: 'Sejarah Indonesia', kelompok: 'A', nilai: '88,00' },
      { id: 6, no: 6, nama: 'Bahasa Inggris', kelompok: 'A', nilai: '85,00' },
      { id: 7, no: 1, nama: 'Seni Budaya', kelompok: 'B', nilai: '90,00' },
      { id: 8, no: 2, nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', kelompok: 'B', nilai: '87,00' },
      { id: 9, no: 3, nama: 'Prakarya dan Kewirausahaan', kelompok: 'B', nilai: '87,00' },
      { id: 10, no: 4, nama: 'Bahasa Arab', kelompok: 'B', nilai: '-' },
      { id: 11, no: 1, nama: 'Matematika (Tingkat Lanjut)', kelompok: 'C', nilai: '80,00' },
      { id: 12, no: 2, nama: 'Biologi', kelompok: 'C', nilai: '85,00' },
      { id: 13, no: 3, nama: 'Fisika', kelompok: 'C', nilai: '87,00' },
      { id: 14, no: 4, nama: 'Kimia', kelompok: 'C', nilai: '86,00' },
      { id: 15, no: 5, nama: 'Pilihan Lintas Minat/Pendalaman Minat', kelompok: 'C', nilai: '-' },
      { id: 16, no: 6, nama: 'Geografi', kelompok: 'C', nilai: '83,00', isItalic: true }
    ],
    nilaiTranskrip: [
      { no: 1, nama: 'Pendidikan Agama dan Budi Pekerti', nilai: '85,61' },
      { no: 2, nama: 'Pendidikan Pancasila dan Kewarganegaraan', nilai: '90,00' },
      { no: 3, nama: 'Bahasa Indonesia', nilai: '87,00' },
      { no: 4, nama: 'Matematika', nilai: '80,00' },
      { no: 5, nama: 'Sejarah Indonesia', nilai: '88,00' },
      { no: 6, nama: 'Bahasa Inggris', nilai: '85,00' },
      { no: 7, nama: 'Seni Budaya', nilai: '90,00' },
      { no: 8, nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', nilai: '87,00' },
      { no: 9, nama: 'Prakarya dan Kewirausahaan', nilai: '87,00' },
      { no: 10, nama: 'Matematika (Tingkat Lanjut)', nilai: '80,00' },
      { no: 11, nama: 'Biologi', nilai: '85,00' },
      { no: 12, nama: 'Fisika', nilai: '87,00' },
      { no: 13, nama: 'Kimia', nilai: '86,00' },
      { no: 14, nama: 'Geografi', nilai: '83,00' }
    ]
  },
  {
    id: '3',
    namaLengkap: 'FANDI AHMAD LATUCONSINA',
    tempatLahir: 'Waeapo',
    tanggalLahir: '03 Februari 2006',
    nis: '212210112',
    nisn: '0061298471',
    namaOrangTua: 'Hasan Latuconsina',
    nomorPeserta: '03-0045-0155-2',
    kelas: 'XII IPS 1',
    jurusan: 'IPS',
    peminatanSkl: 'ILMU PENGETAHUAN SOSIAL',
    peminatanTranskrip: 'Ilmu Pengetahuan Sosial',
    npsn: '60101015',
    statusKelulusan: 'LULUS',
    nomorSuratSkl: '088',
    nomorSuratTranskrip: '088',
    nomorIjazah: '131202616236688',
    tanggalKelulusan: '04 Mei 2026',
    tahunAjaran: '2025/2026',
    rataRataSkl: '85,50',
    rataRata: 85.50,
    rataRataTerbilang: 'Delapan Puluh Lima Koma Lima Nol',
    nomorSurat: '088',
    nilaiSkl: [
      { id: 1, no: 1, nama: 'Pendidikan Agama dan Budi Pekerti', kelompok: 'A', nilai: '85,00' },
      { id: 2, no: 2, nama: 'Pendidikan Pancasila dan Kewarganegaraan', kelompok: 'A', nilai: '84,00' },
      { id: 3, no: 3, nama: 'Bahasa Indonesia', kelompok: 'A', nilai: '88,00' },
      { id: 4, no: 4, nama: 'Matematika', kelompok: 'A', nilai: '80,00' },
      { id: 5, no: 5, nama: 'Sejarah Indonesia', kelompok: 'A', nilai: '86,00' },
      { id: 6, no: 6, nama: 'Bahasa Inggris', kelompok: 'A', nilai: '82,00' },
      { id: 7, no: 1, nama: 'Seni Budaya', kelompok: 'B', nilai: '85,00' },
      { id: 8, no: 2, nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', kelompok: 'B', nilai: '88,00' },
      { id: 9, no: 3, nama: 'Prakarya dan Kewirausahaan', kelompok: 'B', nilai: '84,00' },
      { id: 10, no: 4, nama: 'Bahasa Arab', kelompok: 'B', nilai: '-' },
      { id: 11, no: 1, nama: 'Geografi', kelompok: 'C', nilai: '88,00' },
      { id: 12, no: 2, nama: 'Sejarah (Peminatan)', kelompok: 'C', nilai: '87,00' },
      { id: 13, no: 3, nama: 'Sosiologi', kelompok: 'C', nilai: '89,00' },
      { id: 14, no: 4, nama: 'Ekonomi', kelompok: 'C', nilai: '85,00' },
      { id: 15, no: 5, nama: 'Pilihan Lintas Minat/Pendalaman Minat', kelompok: 'C', nilai: '-' },
      { id: 16, no: 6, nama: 'Biologi', kelompok: 'C', nilai: '86,00', isItalic: true }
    ],
    nilaiTranskrip: [
      { no: 1, nama: 'Pendidikan Agama dan Budi Pekerti', nilai: '85,00' },
      { no: 2, nama: 'Pendidikan Pancasila dan Kewarganegaraan', nilai: '84,00' },
      { no: 3, nama: 'Bahasa Indonesia', nilai: '88,00' },
      { no: 4, nama: 'Matematika', nilai: '80,00' },
      { no: 5, nama: 'Sejarah Indonesia', nilai: '86,00' },
      { no: 6, nama: 'Bahasa Inggris', nilai: '82,00' },
      { no: 7, nama: 'Seni Budaya', nilai: '85,00' },
      { no: 8, nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', nilai: '88,00' },
      { no: 9, nama: 'Prakarya dan Kewirausahaan', nilai: '84,00' },
      { no: 10, nama: 'Geografi', nilai: '88,00' },
      { no: 11, nama: 'Sejarah (Peminatan)', nilai: '87,00' },
      { no: 12, nama: 'Sosiologi', nilai: '89,00' },
      { no: 13, nama: 'Ekonomi', nilai: '85,00' },
      { no: 14, nama: 'Biologi', nilai: '86,00' }
    ]
  },
  {
    id: '4',
    namaLengkap: 'SITI AISYAH WAKANO',
    tempatLahir: 'Waekerta',
    tanggalLahir: '11 Oktober 2005',
    nis: '212210140',
    nisn: '0069384712',
    namaOrangTua: 'Daud Wakano',
    nomorPeserta: '03-0045-0156-9',
    kelas: 'XII IPS 2',
    jurusan: 'IPS',
    peminatanSkl: 'ILMU PENGETAHUAN SOSIAL',
    peminatanTranskrip: 'Ilmu Pengetahuan Sosial',
    npsn: '60101015',
    statusKelulusan: 'LULUS',
    nomorSuratSkl: '089',
    nomorSuratTranskrip: '089',
    nomorIjazah: '131202616236689',
    tanggalKelulusan: '04 Mei 2026',
    tahunAjaran: '2025/2026',
    rataRataSkl: '87,71',
    rataRata: 87.71,
    rataRataTerbilang: 'Delapan Puluh Tujuh Koma Tujuh Satu',
    nomorSurat: '089',
    nilaiSkl: [
      { id: 1, no: 1, nama: 'Pendidikan Agama dan Budi Pekerti', kelompok: 'A', nilai: '89,00' },
      { id: 2, no: 2, nama: 'Pendidikan Pancasila dan Kewarganegaraan', kelompok: 'A', nilai: '87,00' },
      { id: 3, no: 3, nama: 'Bahasa Indonesia', kelompok: 'A', nilai: '92,00' },
      { id: 4, no: 4, nama: 'Matematika', kelompok: 'A', nilai: '83,00' },
      { id: 5, no: 5, nama: 'Sejarah Indonesia', kelompok: 'A', nilai: '89,00' },
      { id: 6, no: 6, nama: 'Bahasa Inggris', kelompok: 'A', nilai: '86,00' },
      { id: 7, no: 1, nama: 'Seni Budaya', kelompok: 'B', nilai: '88,00' },
      { id: 8, no: 2, nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', kelompok: 'B', nilai: '90,00' },
      { id: 9, no: 3, nama: 'Prakarya dan Kewirausahaan', kelompok: 'B', nilai: '87,00' },
      { id: 10, no: 4, nama: 'Bahasa Arab', kelompok: 'B', nilai: '-' },
      { id: 11, no: 1, nama: 'Geografi', kelompok: 'C', nilai: '91,00' },
      { id: 12, no: 2, nama: 'Sejarah (Peminatan)', kelompok: 'C', nilai: '88,00' },
      { id: 13, no: 3, nama: 'Sosiologi', kelompok: 'C', nilai: '92,00' },
      { id: 14, no: 4, nama: 'Ekonomi', kelompok: 'C', nilai: '90,00' },
      { id: 15, no: 5, nama: 'Pilihan Lintas Minat/Pendalaman Minat', kelompok: 'C', nilai: '-' },
      { id: 16, no: 6, nama: 'Biologi', kelompok: 'C', nilai: '86,00', isItalic: true }
    ],
    nilaiTranskrip: [
      { no: 1, nama: 'Pendidikan Agama dan Budi Pekerti', nilai: '89,00' },
      { no: 2, nama: 'Pendidikan Pancasila dan Kewarganegaraan', nilai: '87,00' },
      { no: 3, nama: 'Bahasa Indonesia', nilai: '92,00' },
      { no: 4, nama: 'Matematika', nilai: '83,00' },
      { no: 5, nama: 'Sejarah Indonesia', nilai: '89,00' },
      { no: 6, nama: 'Bahasa Inggris', nilai: '86,00' },
      { no: 7, nama: 'Seni Budaya', nilai: '88,00' },
      { no: 8, nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', nilai: '90,00' },
      { no: 9, nama: 'Prakarya dan Kewirausahaan', nilai: '87,00' },
      { no: 10, nama: 'Geografi', nilai: '91,00' },
      { no: 11, nama: 'Sejarah (Peminatan)', nilai: '88,00' },
      { no: 12, nama: 'Sosiologi', nilai: '92,00' },
      { no: 13, nama: 'Ekonomi', nilai: '90,00' },
      { no: 14, nama: 'Biologi', nilai: '86,00' }
    ]
  }
];


