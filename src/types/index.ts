export interface NilaiMapelSkl {
  id: number;
  no?: number;
  nama: string;
  kelompok: 'A' | 'B' | 'C' | 'HEADER';
  nilai: string; // e.g. "84,94", "82,00", "-"
  isItalic?: boolean;
}

export interface NilaiMapelTranskrip {
  no: number;
  nama: string;
  nilai: string; // e.g. "85,61", "90,00"
}

// Backwards compatibility alias
export interface NilaiMapel {
  id: number;
  nama: string;
  kelompok: 'A' | 'B' | 'C';
  nilai: number;
  terbilang: string;
}

export interface Siswa {
  id: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  nis: string;
  nisn: string;
  namaOrangTua?: string;
  nomorPeserta?: string;
  kelas: string;
  jurusan: 'MIPA' | 'IPS';
  peminatanSkl: string; // e.g. 'ILMU PENGETAHUAN ALAM'
  peminatanTranskrip: string; // e.g. 'Matematika dan Ilmu Pengetahuan Alam'
  npsn: string; // '60101015'
  statusKelulusan: 'LULUS' | 'TIDAK LULUS';
  nomorSuratSkl: string; // e.g. '087' -> '421.4/ 087 /2026'
  nomorSuratTranskrip: string; // e.g. '074' -> '421.4 / 074 / 2026'
  nomorIjazah: string; // e.g. '131202616236687'
  tanggalKelulusan: string; // e.g. '04 Mei 2026'
  tahunAjaran: string; // e.g. '2025/2026'
  nilaiSkl: NilaiMapelSkl[];
  rataRataSkl: string; // e.g. '83,14'
  nilaiTranskrip: NilaiMapelTranskrip[];

  // Compatibility fields
  nomorSurat?: string;
  nilai?: NilaiMapel[];
  rataRata?: number;
  rataRataTerbilang?: string;
}

export interface Surat {
  id: string;
  nomorSurat: string;
  tanggal: string;
  perihal: string;
  tujuanPengirim: string;
  jenis: 'Masuk' | 'Keluar';
  status: 'Selesai' | 'Proses' | 'Disposisi';
}

