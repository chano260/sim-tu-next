import * as XLSX from 'xlsx';
import { Siswa, NilaiMapelSkl, NilaiMapelTranskrip } from '@/types';
import { angkaKeTerbilang } from '@/data/mockData';

export interface ParseResult {
  success: boolean;
  data: Siswa[];
  errors: string[];
  totalRows: number;
}

// Format nilai ke string standar dengan koma (cth: 85 -> "85,00", 84.94 -> "84,94")
export function formatNilaiString(val: any): string {
  if (val === undefined || val === null || val === '' || val === '-') {
    return '-';
  }
  const cleanStr = String(val).replace(',', '.').trim();
  const num = parseFloat(cleanStr);
  if (isNaN(num)) {
    return String(val).trim();
  }
  return num.toFixed(2).replace('.', ',');
}

// Parsing nilai string ke number
export function parseNilaiNumber(val: any): number | null {
  if (val === undefined || val === null || val === '' || val === '-') {
    return null;
  }
  const cleanStr = String(val).replace(',', '.').trim();
  const num = parseFloat(cleanStr);
  return isNaN(num) ? null : num;
}

// Generate template data for client-side download
export function getTemplateData() {
  const headers = [
    'NO',
    'NAMA_LENGKAP',
    'NISN',
    'NIS',
    'TEMPAT_LAHIR',
    'TANGGAL_LAHIR',
    'NAMA_ORANG_TUA',
    'NO_PESERTA_UJIAN',
    'KELAS',
    'JURUSAN',
    'TAHUN_PELAJARAN',
    'NO_SURAT_SKL',
    'NO_SURAT_TRANSKRIP',
    'NO_IJAZAH',
    'TANGGAL_KELULUSAN',
    'STATUS_KELULUSAN',
    // Kelompok A (Wajib)
    'PA_BP',
    'PPKN',
    'B_INDONESIA',
    'MATEMATIKA_UMUM',
    'SEJARAH_INDONESIA',
    'B_INGGRIS',
    // Kelompok B (Wajib)
    'SENI_BUDAYA',
    'PJOK',
    'PKWU',
    'BAHASA_ARAB',
    // Kelompok C (Peminatan MIPA atau IPS)
    'PEMINATAN_1',
    'PEMINATAN_2',
    'PEMINATAN_3',
    'PEMINATAN_4',
    'LINTAS_MINAT_NAMA',
    'LINTAS_MINAT_NILAI'
  ];

  const sampleRows = [
    [
      1,
      'MUHAMMAD RIZKY PRATAMA',
      '0067829102',
      '212210045',
      'Waekerta',
      '14 Mei 2006',
      'Bambang Sudarsono',
      '03-0045-0001-8',
      'XII MIPA 1',
      'MIPA',
      '2025/2026',
      '087',
      '087',
      '131202616236686',
      '04 Mei 2026',
      'LULUS',
      '84,94',
      '82,00',
      '83,00',
      '78,00',
      '87,00',
      '83,00',
      '85,00',
      '90,00',
      '85,00',
      '-',
      '80,00', // Mat Peminatan
      '80,00', // Biologi
      '85,00', // Fisika
      '81,00', // Kimia
      'Geografi',
      '80,00'
    ],
    [
      2,
      'EMELDA KIRANA SELA',
      '0089153758',
      '212210074',
      'Maluku Tengah',
      '20 Mei 2008',
      'Bpk. Sela',
      '03-0045-0074-9',
      'XII MIPA 2',
      'MIPA',
      '2025/2026',
      '074',
      '074',
      '131202616236687',
      '04 Mei 2026',
      'LULUS',
      '85,61',
      '90,00',
      '87,00',
      '80,00',
      '88,00',
      '85,00',
      '90,00',
      '87,00',
      '87,00',
      '-',
      '80,00',
      '85,00',
      '87,00',
      '86,00',
      'Geografi',
      '83,00'
    ],
    [
      3,
      'FANDI AHMAD LATUCONSINA',
      '0061298471',
      '212210112',
      'Waeapo',
      '03 Februari 2006',
      'Hasan Latuconsina',
      '03-0045-0155-2',
      'XII IPS 1',
      'IPS',
      '2025/2026',
      '088',
      '088',
      '131202616236688',
      '04 Mei 2026',
      'LULUS',
      '85,00',
      '84,00',
      '88,00',
      '80,00',
      '86,00',
      '82,00',
      '85,00',
      '88,00',
      '84,00',
      '-',
      '88,00', // Geografi
      '87,00', // Sejarah Peminatan
      '89,00', // Sosiologi
      '85,00', // Ekonomi
      'Biologi',
      '86,00'
    ],
    [
      4,
      'SITI AISYAH WAKANO',
      '0069384712',
      '212210140',
      'Waekerta',
      '11 Oktober 2005',
      'Daud Wakano',
      '03-0045-0156-9',
      'XII IPS 2',
      'IPS',
      '2025/2026',
      '089',
      '089',
      '131202616236689',
      '04 Mei 2026',
      'LULUS',
      '89,00',
      '87,00',
      '92,00',
      '83,00',
      '89,00',
      '86,00',
      '88,00',
      '90,00',
      '86,00',
      '-',
      '90,00',
      '88,00',
      '87,00',
      '85,00',
      'Biologi',
      '88,00'
    ]
  ];

  return { headers, sampleRows };
}

// Download template Excel (.xlsx) di sisi klien
export function downloadExcelTemplate(customTahunAjaran?: string) {
  const { headers, sampleRows } = getTemplateData();
  
  // Update tahun pelajaran sampel jika ada
  if (customTahunAjaran) {
    sampleRows.forEach(row => {
      row[10] = customTahunAjaran;
    });
  }

  const wb = XLSX.utils.book_new();
  const wsData = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
  
  const petunjukData = [
    ['PETUNJUK PENGISIAN TEMPLATE IMPORT DATA SISWA & NILAI SKL/TRANSKRIP'],
    ['SMA NEGERI 3 BURU'],
    [''],
    ['NO', 'KOLOM', 'PENJELASAN & CONTOH'],
    [1, 'NAMA_LENGKAP', 'Nama siswa sesuai ijazah/akta'],
    [2, 'NISN', '10 digit angka NISN resmi'],
    [3, 'NIS', 'Nomor Induk Siswa di sekolah'],
    [4, 'TEMPAT_LAHIR', 'Kabupaten/Kota/Desa tempat lahir (cth: Waekerta)'],
    [5, 'TANGGAL_LAHIR', 'Format bebas (cth: 14 Mei 2006)'],
    [6, 'NAMA_ORANG_TUA', 'Nama orang tua/wali murid'],
    [7, 'NO_PESERTA_UJIAN', 'Nomor peserta ujian (cth: 03-0045-0001-8)'],
    [8, 'KELAS', 'Kelas siswa (cth: XII MIPA 1 / XII IPS 1)'],
    [9, 'JURUSAN', 'Wajib isi: MIPA atau IPS'],
    [10, 'TAHUN_PELAJARAN', 'Tahun pelajaran (cth: 2025/2026). Akan tercetak di nomor SKL & surat.'],
    [11, 'NO_SURAT_SKL', 'Nomor urut surat SKL (cth: 087 -> format: 421.4/ 087 /2026)'],
    [12, 'NO_SURAT_TRANSKRIP', 'Nomor urut surat Transkrip (cth: 087)'],
    [13, 'NO_IJAZAH', 'Nomor seri ijazah (cth: 131202616236686)'],
    [14, 'TANGGAL_KELULUSAN', 'Tanggal penerbitan SKL (cth: 04 Mei 2026)'],
    [15, 'STATUS_KELULUSAN', 'LULUS / TIDAK LULUS'],
    ['', '', ''],
    ['', 'NILAI KELOMPOK A', 'PA_BP (Agama), PPKN, B_INDONESIA, MATEMATIKA_UMUM, SEJARAH_INDONESIA, B_INGGRIS'],
    ['', 'NILAI KELOMPOK B', 'SENI_BUDAYA, PJOK, PKWU, BAHASA_ARAB (isi tanda strip - jika tidak ada)'],
    ['', 'PEMINATAN MIPA', 'PEMINATAN_1 = Mat Peminatan, PEMINATAN_2 = Biologi, PEMINATAN_3 = Fisika, PEMINATAN_4 = Kimia'],
    ['', 'PEMINATAN IPS', 'PEMINATAN_1 = Geografi, PEMINATAN_2 = Sejarah Peminatan, PEMINATAN_3 = Sosiologi, PEMINATAN_4 = Ekonomi'],
    ['', 'LINTAS MINAT', 'LINTAS_MINAT_NAMA = Nama mapel pilihan (cth: Geografi / Biologi). LINTAS_MINAT_NILAI = Nilainya.'],
    ['', 'PERHITUNGAN RATA-RATA', 'Sistem secara otomatis menghitung rata-rata dan terbilang nilai dari seluruh mapel valid!']
  ];
  const wsPetunjuk = XLSX.utils.aoa_to_sheet(petunjukData);

  wsData['!cols'] = [
    { wch: 5 }, { wch: 28 }, { wch: 14 }, { wch: 12 }, { wch: 16 }, { wch: 16 },
    { wch: 22 }, { wch: 18 }, { wch: 14 }, { wch: 10 }, { wch: 16 }, { wch: 14 },
    { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 16 },
    { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 12 },
    { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 14 },
    { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 20 }, { wch: 18 }
  ];

  XLSX.utils.book_append_sheet(wb, wsData, 'DATA_SISWA_NILAI');
  XLSX.utils.book_append_sheet(wb, wsPetunjuk, 'PETUNJUK');

  XLSX.writeFile(wb, `Template_Import_Siswa_SKL_${(customTahunAjaran || '2025-2026').replace('/', '_')}.xlsx`);
}

// Download template CSV di sisi klien
export function downloadCsvTemplate(customTahunAjaran?: string) {
  const { headers, sampleRows } = getTemplateData();
  if (customTahunAjaran) {
    sampleRows.forEach(row => {
      row[10] = customTahunAjaran;
    });
  }
  const allRows = [headers, ...sampleRows];
  const csvContent = allRows.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Template_Import_Siswa_SKL_${(customTahunAjaran || '2025-2026').replace('/', '_')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper untuk mencari nilai dari objek baris berdasarkan variasi nama kolom
function getField(row: Record<string, any>, ...keys: string[]): any {
  for (const k of keys) {
    // Exact match
    if (row[k] !== undefined) return row[k];
    
    // Case-insensitive & normalized match
    const cleanK = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const rk of Object.keys(row)) {
      const cleanRk = rk.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanRk === cleanK && row[rk] !== undefined) {
        return row[rk];
      }
    }
  }
  return undefined;
}

// Parsing File Excel (.xlsx / .xls / .csv)
export async function parseStudentFile(file: File, fallbackTahunAjaran: string = '2025/2026'): Promise<ParseResult> {
  const errors: string[] = [];
  const students: Siswa[] = [];

  try {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: 'array' });
    
    // Gunakan sheet pertama atau sheet bernama 'DATA_SISWA_NILAI'
    const sheetName = wb.SheetNames.includes('DATA_SISWA_NILAI') 
      ? 'DATA_SISWA_NILAI' 
      : wb.SheetNames[0];

    const ws = wb.Sheets[sheetName];
    if (!ws) {
      return { success: false, data: [], errors: ['File tidak memiliki sheet data yang valid.'], totalRows: 0 };
    }

    // Ubah worksheet menjadi JSON array of objects
    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: '' });

    if (rawRows.length === 0) {
      return { success: false, data: [], errors: ['File Excel/CSV tidak memiliki baris data.'], totalRows: 0 };
    }

    rawRows.forEach((row, index) => {
      const rowNum = index + 2; // Baris 1 adalah header di Excel

      const namaLengkap = String(getField(row, 'NAMA_LENGKAP', 'NAMA', 'Nama Lengkap', 'Nama') || '').trim();
      if (!namaLengkap) {
        // Lewati baris kosong tanpa nama
        return;
      }

      const nisn = String(getField(row, 'NISN', 'nisn', 'No NISN') || '').trim();
      const nis = String(getField(row, 'NIS', 'nis', 'No NIS') || '').trim();
      const tempatLahir = String(getField(row, 'TEMPAT_LAHIR', 'Tempat Lahir', 'Tempat') || 'Buru').trim();
      const tanggalLahir = String(getField(row, 'TANGGAL_LAHIR', 'Tanggal Lahir', 'Tgl Lahir') || '-').trim();
      const namaOrangTua = String(getField(row, 'NAMA_ORANG_TUA', 'Nama Orang Tua', 'Orang Tua', 'Wali') || '-').trim();
      const nomorPeserta = String(getField(row, 'NO_PESERTA_UJIAN', 'Nomor Peserta', 'No Peserta', 'Peserta Ujian') || '').trim();
      const kelas = String(getField(row, 'KELAS', 'Kelas', 'Rombel') || 'XII MIPA 1').trim();
      
      let rawJurusan = String(getField(row, 'JURUSAN', 'Jurusan', 'Peminatan') || '').toUpperCase().trim();
      let jurusan: 'MIPA' | 'IPS' = 'MIPA';
      if (rawJurusan.includes('IPS') || kelas.toUpperCase().includes('IPS')) {
        jurusan = 'IPS';
      } else {
        jurusan = 'MIPA';
      }

      // Tahun Pelajaran (Bisa dari Excel atau fallback dari input aktif)
      const tahunAjaranRow = String(getField(row, 'TAHUN_PELAJARAN', 'Tahun Pelajaran', 'Tahun Ajaran', 'TAHUN_AJARAN') || '').trim();
      const tahunAjaran = tahunAjaranRow || fallbackTahunAjaran;

      // Nomor Dokumen
      const nomorSuratSkl = String(getField(row, 'NO_SURAT_SKL', 'No Surat SKL', 'Nomor SKL', 'SKL') || String(index + 1).padStart(3, '0')).trim();
      const nomorSuratTranskrip = String(getField(row, 'NO_SURAT_TRANSKRIP', 'No Surat Transkrip', 'Nomor Transkrip', 'Transkrip') || nomorSuratSkl).trim();
      const nomorIjazah = String(getField(row, 'NO_IJAZAH', 'Nomor Ijazah', 'No Ijazah', 'Ijazah') || '').trim();
      const tanggalKelulusan = String(getField(row, 'TANGGAL_KELULUSAN', 'Tanggal Kelulusan', 'Tgl Kelulusan') || '04 Mei 2026').trim();
      const statusKelulusanRaw = String(getField(row, 'STATUS_KELULUSAN', 'Status Kelulusan', 'Status') || 'LULUS').toUpperCase().trim();
      const statusKelulusan: 'LULUS' | 'TIDAK LULUS' = statusKelulusanRaw.includes('TIDAK') ? 'TIDAK LULUS' : 'LULUS';

      // ==========================================
      // BACA NILAI MATA PELAJARAN KELOMPOK A & B
      // ==========================================
      const vAgama = formatNilaiString(getField(row, 'PA_BP', 'Agama', 'Pendidikan Agama'));
      const vPpkn = formatNilaiString(getField(row, 'PPKN', 'Pancasila', 'Pendidikan Pancasila'));
      const vIndo = formatNilaiString(getField(row, 'B_INDONESIA', 'Bahasa Indonesia', 'B Indo', 'BINDO'));
      const vMatUmum = formatNilaiString(getField(row, 'MATEMATIKA_UMUM', 'MATEMATIKA', 'Matematika', 'Matematika Umum'));
      const vSejIndo = formatNilaiString(getField(row, 'SEJARAH_INDONESIA', 'Sejarah Indonesia', 'Sejarah', 'SEJARAH'));
      const vInggris = formatNilaiString(getField(row, 'B_INGGRIS', 'Bahasa Inggris', 'B Inggris', 'BING'));

      const vSeni = formatNilaiString(getField(row, 'SENI_BUDAYA', 'Seni Budaya', 'Seni'));
      const vPjok = formatNilaiString(getField(row, 'PJOK', 'Penjas', 'Olahraga'));
      const vPkwu = formatNilaiString(getField(row, 'PKWU', 'Prakarya', 'Kewirausahaan'));
      const vArab = formatNilaiString(getField(row, 'BAHASA_ARAB', 'Bahasa Arab', 'Mulok', 'Arab'));

      // ==========================================
      // BACA NILAI PEMINATAN (KELOMPOK C) & LINTAS MINAT
      // ==========================================
      let vPem1 = '-';
      let vPem2 = '-';
      let vPem3 = '-';
      let vPem4 = '-';
      let namaLintasMinat = jurusan === 'MIPA' ? 'Geografi' : 'Biologi';
      let vLintasMinat = '-';

      if (jurusan === 'MIPA') {
        vPem1 = formatNilaiString(getField(row, 'PEMINATAN_1', 'MATEMATIKA_PEMINATAN', 'Matematika Peminatan', 'Matematika Tingkat Lanjut'));
        vPem2 = formatNilaiString(getField(row, 'PEMINATAN_2', 'BIOLOGI', 'Biologi'));
        vPem3 = formatNilaiString(getField(row, 'PEMINATAN_3', 'FISIKA', 'Fisika'));
        vPem4 = formatNilaiString(getField(row, 'PEMINATAN_4', 'KIMIA', 'Kimia'));
        
        const customLmNama = String(getField(row, 'LINTAS_MINAT_NAMA', 'Nama Lintas Minat') || '').trim();
        if (customLmNama) namaLintasMinat = customLmNama;
        vLintasMinat = formatNilaiString(getField(row, 'LINTAS_MINAT_NILAI', 'Nilai Lintas Minat', 'LINTAS_MINAT', 'Geografi'));
      } else {
        // IPS
        vPem1 = formatNilaiString(getField(row, 'PEMINATAN_1', 'GEOGRAFI', 'Geografi'));
        vPem2 = formatNilaiString(getField(row, 'PEMINATAN_2', 'SEJARAH_PEMINATAN', 'Sejarah Peminatan'));
        vPem3 = formatNilaiString(getField(row, 'PEMINATAN_3', 'SOSIOLOGI', 'Sosiologi'));
        vPem4 = formatNilaiString(getField(row, 'PEMINATAN_4', 'EKONOMI', 'Ekonomi'));
        
        const customLmNama = String(getField(row, 'LINTAS_MINAT_NAMA', 'Nama Lintas Minat') || '').trim();
        if (customLmNama) namaLintasMinat = customLmNama;
        vLintasMinat = formatNilaiString(getField(row, 'LINTAS_MINAT_NILAI', 'Nilai Lintas Minat', 'LINTAS_MINAT', 'Biologi'));
      }

      // ==========================================
      // RANCANG STRUKTUR NILAI SKL (KELOMPOK A, B, C)
      // ==========================================
      const nilaiSkl: NilaiMapelSkl[] = [
        { id: 1, no: 1, nama: 'Pendidikan Agama dan Budi Pekerti', kelompok: 'A', nilai: vAgama },
        { id: 2, no: 2, nama: 'Pendidikan Pancasila dan Kewarganegaraan', kelompok: 'A', nilai: vPpkn },
        { id: 3, no: 3, nama: 'Bahasa Indonesia', kelompok: 'A', nilai: vIndo },
        { id: 4, no: 4, nama: 'Matematika', kelompok: 'A', nilai: vMatUmum },
        { id: 5, no: 5, nama: 'Sejarah Indonesia', kelompok: 'A', nilai: vSejIndo },
        { id: 6, no: 6, nama: 'Bahasa Inggris', kelompok: 'A', nilai: vInggris },

        { id: 7, no: 1, nama: 'Seni Budaya', kelompok: 'B', nilai: vSeni },
        { id: 8, no: 2, nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', kelompok: 'B', nilai: vPjok },
        { id: 9, no: 3, nama: 'Prakarya dan Kewirausahaan', kelompok: 'B', nilai: vPkwu },
        { id: 10, no: 4, nama: 'Bahasa Arab', kelompok: 'B', nilai: vArab },

        ...(jurusan === 'MIPA'
          ? [
              { id: 11, no: 1, nama: 'Matematika (Tingkat Lanjut)', kelompok: 'C' as const, nilai: vPem1 },
              { id: 12, no: 2, nama: 'Biologi', kelompok: 'C' as const, nilai: vPem2 },
              { id: 13, no: 3, nama: 'Fisika', kelompok: 'C' as const, nilai: vPem3 },
              { id: 14, no: 4, nama: 'Kimia', kelompok: 'C' as const, nilai: vPem4 },
              { id: 15, no: 5, nama: 'Pilihan Lintas Minat/Pendalaman Minat', kelompok: 'C' as const, nilai: '-' },
              { id: 16, no: 6, nama: namaLintasMinat, kelompok: 'C' as const, nilai: vLintasMinat, isItalic: true }
            ]
          : [
              { id: 11, no: 1, nama: 'Geografi', kelompok: 'C' as const, nilai: vPem1 },
              { id: 12, no: 2, nama: 'Sejarah (Peminatan)', kelompok: 'C' as const, nilai: vPem2 },
              { id: 13, no: 3, nama: 'Sosiologi', kelompok: 'C' as const, nilai: vPem3 },
              { id: 14, no: 4, nama: 'Ekonomi', kelompok: 'C' as const, nilai: vPem4 },
              { id: 15, no: 5, nama: 'Pilihan Lintas Minat/Pendalaman Minat', kelompok: 'C' as const, nilai: '-' },
              { id: 16, no: 6, nama: namaLintasMinat, kelompok: 'C' as const, nilai: vLintasMinat, isItalic: true }
            ]
        )
      ];

      // ==========================================
      // RANCANG STRUKTUR NILAI TRANSKRIP (14 MAPEL)
      // ==========================================
      const nilaiTranskrip: NilaiMapelTranskrip[] = [
        { no: 1, nama: 'Pendidikan Agama dan Budi Pekerti', nilai: vAgama },
        { no: 2, nama: 'Pendidikan Pancasila dan Kewarganegaraan', nilai: vPpkn },
        { no: 3, nama: 'Bahasa Indonesia', nilai: vIndo },
        { no: 4, nama: 'Matematika', nilai: vMatUmum },
        { no: 5, nama: 'Sejarah Indonesia', nilai: vSejIndo },
        { no: 6, nama: 'Bahasa Inggris', nilai: vInggris },
        { no: 7, nama: 'Seni Budaya', nilai: vSeni },
        { no: 8, nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', nilai: vPjok },
        { no: 9, nama: 'Prakarya dan Kewirausahaan', nilai: vPkwu },

        ...(jurusan === 'MIPA'
          ? [
              { no: 10, nama: 'Matematika (Tingkat Lanjut)', nilai: vPem1 },
              { no: 11, nama: 'Biologi', nilai: vPem2 },
              { no: 12, nama: 'Fisika', nilai: vPem3 },
              { no: 13, nama: 'Kimia', nilai: vPem4 },
              { no: 14, nama: namaLintasMinat, nilai: vLintasMinat }
            ]
          : [
              { no: 10, nama: 'Geografi', nilai: vPem1 },
              { no: 11, nama: 'Sejarah (Peminatan)', nilai: vPem2 },
              { no: 12, nama: 'Sosiologi', nilai: vPem3 },
              { no: 13, nama: 'Ekonomi', nilai: vPem4 },
              { no: 14, nama: namaLintasMinat, nilai: vLintasMinat }
            ]
        )
      ];

      // ==========================================
      // HITUNG RATA-RATA NILAI SKL SECARA OTOMATIS
      // ==========================================
      const validNumbers = nilaiSkl
        .filter(n => n.nilai !== '-' && n.kelompok !== 'HEADER')
        .map(n => parseNilaiNumber(n.nilai))
        .filter((n): n is number => n !== null);

      let rataRataSkl = '0,00';
      let rataRataNum = 0;
      let rataRataTerbilang = '-';

      if (validNumbers.length > 0) {
        const sum = validNumbers.reduce((a, b) => a + b, 0);
        rataRataNum = parseFloat((sum / validNumbers.length).toFixed(2));
        rataRataSkl = rataRataNum.toFixed(2).replace('.', ',');
        rataRataTerbilang = angkaKeTerbilang(rataRataNum);
      }

      const peminatanSkl = jurusan === 'MIPA' ? 'ILMU PENGETAHUAN ALAM' : 'ILMU PENGETAHUAN SOSIAL';
      const peminatanTranskrip = jurusan === 'MIPA' ? 'Matematika dan Ilmu Pengetahuan Alam' : 'Ilmu Pengetahuan Sosial';

      const siswaObj: Siswa = {
        id: `imp-${Date.now()}-${index}`,
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        nis,
        nisn,
        namaOrangTua,
        nomorPeserta,
        kelas,
        jurusan,
        peminatanSkl,
        peminatanTranskrip,
        npsn: '60101015',
        statusKelulusan,
        nomorSuratSkl,
        nomorSuratTranskrip,
        nomorIjazah,
        tanggalKelulusan,
        tahunAjaran,
        nilaiSkl,
        rataRataSkl,
        nilaiTranskrip,
        nomorSurat: nomorSuratSkl,
        rataRata: rataRataNum,
        rataRataTerbilang
      };

      students.push(siswaObj);
    });

    if (students.length === 0) {
      errors.push('Tidak ada baris data siswa yang berhasil dibaca. Pastikan kolom NAMA_LENGKAP terisi.');
      return { success: false, data: [], errors, totalRows: 0 };
    }

    return {
      success: true,
      data: students,
      errors,
      totalRows: students.length
    };
  } catch (err: any) {
    console.error('Error parsing student excel file:', err);
    return {
      success: false,
      data: [],
      errors: [`Gagal memproses file: ${err?.message || 'Format file tidak sesuai'}`],
      totalRows: 0
    };
  }
}

// Ekspor seluruh data siswa saat ini ke file Excel (.xlsx)
export function exportStudentsToExcel(students: Siswa[], filename: string = 'Rekap_Nilai_Siswa_SKL_SMAN3_Buru.xlsx') {
  const { headers } = getTemplateData();

  const dataRows = students.map((s, idx) => {
    // Cari nilai mapel
    const getVal = (name: string) => {
      const found = s.nilaiSkl.find(n => n.nama.toLowerCase().includes(name.toLowerCase()));
      return found ? found.nilai : '-';
    };

    const pem1 = s.jurusan === 'MIPA' ? getVal('Matematika (Tingkat Lanjut)') : getVal('Geografi');
    const pem2 = s.jurusan === 'MIPA' ? getVal('Biologi') : getVal('Sejarah (Peminatan)');
    const pem3 = s.jurusan === 'MIPA' ? getVal('Fisika') : getVal('Sosiologi');
    const pem4 = s.jurusan === 'MIPA' ? getVal('Kimia') : getVal('Ekonomi');
    
    // Lintas Minat
    const lm = s.nilaiSkl.find(n => n.isItalic);
    const lmNama = lm ? lm.nama : (s.jurusan === 'MIPA' ? 'Geografi' : 'Biologi');
    const lmNilai = lm ? lm.nilai : '-';

    return [
      idx + 1,
      s.namaLengkap,
      s.nisn,
      s.nis,
      s.tempatLahir,
      s.tanggalLahir,
      s.namaOrangTua || '-',
      s.nomorPeserta || '-',
      s.kelas,
      s.jurusan,
      s.tahunAjaran,
      s.nomorSuratSkl,
      s.nomorSuratTranskrip,
      s.nomorIjazah,
      s.tanggalKelulusan,
      s.statusKelulusan,
      // Kelompok A
      getVal('Agama'),
      getVal('Pancasila'),
      getVal('Bahasa Indonesia'),
      getVal('Matematika'),
      getVal('Sejarah Indonesia'),
      getVal('Bahasa Inggris'),
      // Kelompok B
      getVal('Seni Budaya'),
      getVal('Jasmani'),
      getVal('Kewirausahaan'),
      getVal('Arab'),
      // Peminatan
      pem1,
      pem2,
      pem3,
      pem4,
      lmNama,
      lmNilai
    ];
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
  
  ws['!cols'] = [
    { wch: 5 }, { wch: 28 }, { wch: 14 }, { wch: 12 }, { wch: 16 }, { wch: 16 },
    { wch: 22 }, { wch: 18 }, { wch: 14 }, { wch: 10 }, { wch: 16 }, { wch: 14 },
    { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 16 },
    { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 12 },
    { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 14 },
    { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 20 }, { wch: 18 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'DATA_SISWA_NILAI');
  XLSX.writeFile(wb, filename);
}

