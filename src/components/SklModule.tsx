'use client';

import React, { useState } from 'react';
import { Siswa, NilaiMapelSkl, NilaiMapelTranskrip } from '@/types';
import { initialSiswa, profilSekolah } from '@/data/mockData';
import SklDocument from '@/components/SklDocument';
import {
  Printer,
  Search,
  Upload,
  Filter,
  CheckCircle,
  Eye,
  X,
  FileSpreadsheet,
  Award,
  BookOpen,
  Edit,
  FileText,
  Layers,
  GraduationCap,
  Save,
  Check,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileDown,
  RefreshCw,
} from 'lucide-react';
import {
  downloadExcelTemplate,
  downloadCsvTemplate,
  parseStudentFile,
  exportStudentsToExcel,
} from '@/utils/excelImport';
import { angkaKeTerbilang } from '@/data/mockData';

export default function SklModule({
  logoKiriUrl,
  logoKananUrl,
  logoKiriSize,
  logoKananSize,
}: {
  logoKiriUrl?: string | null;
  logoKananUrl?: string | null;
  logoKiriSize?: number;
  logoKananSize?: number;
}) {
  const [daftarSiswa, setDaftarSiswa] = useState<Siswa[]>(initialSiswa);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState<'ALL' | 'MIPA' | 'IPS'>('ALL');
  
  // Document Mode: SKL, TRANSKRIP, or BOTH
  const [docMode, setDocMode] = useState<'SKL' | 'TRANSKRIP' | 'BOTH'>('SKL');

  // Paper Size: A4, F4 / Folio, or LEGAL
  const [paperSize, setPaperSize] = useState<'A4' | 'F4' | 'LEGAL'>('A4');

  // Unified logo size for both logos
  const [logoSize, setLogoSize] = useState<number>(66);

  // Tahun Pelajaran Global / Aktif
  const [tahunAjaranGlobal, setTahunAjaranGlobal] = useState<string>('2025/2026');
  
  // Active student for preview & edit
  const [previewSiswa, setPreviewSiswa] = useState<Siswa | null>(null);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  
  // Bulk Print
  const [isBulkPrint, setIsBulkPrint] = useState(false);

  // Import Excel Modal States
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Siswa[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [importMode, setImportMode] = useState<'REPLACE' | 'APPEND'>('REPLACE');

  // Toast / Alert Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Terapkan tahun pelajaran global ke semua data siswa
  const handleApplyTahunAjaranToAll = () => {
    const targetTahun = tahunAjaranGlobal.trim();
    if (!targetTahun) return;
    setDaftarSiswa((prev) =>
      prev.map((s) => ({
        ...s,
        tahunAjaran: targetTahun,
      }))
    );
    if (previewSiswa) {
      setPreviewSiswa({
        ...previewSiswa,
        tahunAjaran: targetTahun,
      });
    }
    showToast(`Tahun Pelajaran "${targetTahun}" berhasil diterapkan ke seluruh ${daftarSiswa.length} siswa!`);
  };

  // Filter Siswa
  const filteredSiswa = daftarSiswa.filter((s) => {
    const matchSearch =
      s.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm) ||
      s.nis.includes(searchTerm) ||
      (s.nomorIjazah && s.nomorIjazah.includes(searchTerm)) ||
      (s.tahunAjaran && s.tahunAjaran.includes(searchTerm));
    const matchJurusan = selectedJurusan === 'ALL' || s.jurusan === selectedJurusan;
    return matchSearch && matchJurusan;
  });

  // Handle Trigger Print Single
  const handlePrint = (siswa?: Siswa, specificMode?: 'SKL' | 'TRANSKRIP' | 'BOTH') => {
    if (specificMode) {
      setDocMode(specificMode);
    }
    if (siswa) {
      setPreviewSiswa(siswa);
      setIsBulkPrint(false);
    } else {
      setIsBulkPrint(true);
    }
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // Handle Save Edit Siswa
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSiswa) return;

    // Recalculate average
    const validScores = editingSiswa.nilaiSkl
      .map((n) => parseFloat(n.nilai.replace(',', '.')))
      .filter((n) => !isNaN(n));
    
    let newAvg = editingSiswa.rataRataSkl;
    let newAvgNum = editingSiswa.rataRata || 0;
    let newTerbilang = editingSiswa.rataRataTerbilang || '';
    if (validScores.length > 0) {
      const sum = validScores.reduce((acc, curr) => acc + curr, 0);
      newAvgNum = parseFloat((sum / validScores.length).toFixed(2));
      newAvg = newAvgNum.toFixed(2).replace('.', ',');
      newTerbilang = angkaKeTerbilang(newAvgNum);
    }

    const updated: Siswa = {
      ...editingSiswa,
      rataRataSkl: newAvg,
      rataRata: newAvgNum,
      rataRataTerbilang: newTerbilang,
      tahunAjaran: editingSiswa.tahunAjaran?.trim() || tahunAjaranGlobal,
    };

    setDaftarSiswa((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (previewSiswa && previewSiswa.id === updated.id) {
      setPreviewSiswa(updated);
    }
    setEditingSiswa(null);
    showToast(`Data dan nilai siswa "${updated.namaLengkap}" berhasil disimpan!`);
  };

  // Handle File Input Selection
  const handleFileUpload = async (file: File) => {
    setImportFile(file);
    setImportError(null);
    setIsParsing(true);
    try {
      const result = await parseStudentFile(file, tahunAjaranGlobal);
      if (result.success && result.data.length > 0) {
        setImportPreview(result.data);
      } else {
        setImportError(result.errors.join(', ') || 'Gagal membaca format file.');
        setImportPreview(null);
      }
    } catch (err: any) {
      setImportError(err?.message || 'Terjadi kesalahan saat memproses file.');
      setImportPreview(null);
    } finally {
      setIsParsing(false);
    }
  };

  // Konfirmasi Import Data Siswa
  const handleConfirmImport = () => {
    if (!importPreview || importPreview.length === 0) return;

    if (importMode === 'REPLACE') {
      setDaftarSiswa(importPreview);
      setPreviewSiswa(importPreview[0] || null);
      showToast(`Berhasil mengganti data! ${importPreview.length} siswa berhasil dimuat.`);
    } else {
      setDaftarSiswa((prev) => [...prev, ...importPreview]);
      showToast(`Berhasil menambahkan ${importPreview.length} siswa baru ke dalam sistem.`);
    }

    // Reset import modal state
    setImportFile(null);
    setImportPreview(null);
    setImportError(null);
    setShowImportModal(false);
  };

  // Handle Export Seluruh Siswa ke Excel
  const handleExportCurrentData = () => {
    exportStudentsToExcel(
      daftarSiswa,
      `Data_Siswa_SKL_SMAN3_Buru_${tahunAjaranGlobal.replace('/', '_')}.xlsx`
    );
    showToast(`File Excel berhasil diunduh (${daftarSiswa.length} siswa).`);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* PRINTABLE AREA (Hanya tampil saat window.print())                        */}
      {/* ========================================================================= */}
      {isBulkPrint ? (
        <div className="hidden print:block">
          {filteredSiswa.map((s, idx) => (
            <div key={`bulk-${s.id}`}>
              <SklDocument
                siswa={s}
                mode={docMode}
                paperSize={paperSize}
                logoSize={logoSize}
                logoKiriUrl={logoKiriUrl}
                logoKananUrl={logoKananUrl}
              />
              {idx < filteredSiswa.length - 1 && (
                <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
              )}
            </div>
          ))}
        </div>
      ) : previewSiswa ? (
        <div className="hidden print:block">
          <SklDocument
            siswa={previewSiswa}
            mode={docMode}
            paperSize={paperSize}
            logoSize={logoSize}
            logoKiriUrl={logoKiriUrl}
            logoKananUrl={logoKananUrl}
          />
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* KONTEN UTAMA APLIKASI (Disembunyikan saat mencetak)                       */}
      {/* ========================================================================= */}
      <div className="print:hidden space-y-6">
        {/* Banner Modul & Mode Dokumen */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Template Resmi Terverifikasi: SMA Negeri 3 Buru
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Tahun Ajaran 2025/2026 • Kurikulum 2013
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Penerbitan Surat Keterangan Lulus (SKL) & Transkrip Nilai
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Format kop dinas resmi, tabel nilai Kurikulum 2013 (Kelompok A, B, C dengan Rata-rata), kotak pas foto 3x4 cm, dan tanda tangan Kepala Sekolah sesuai dokumen fisik resmi.
            </p>

            {/* Pilihan Format & Pengaturan Kertas / Logo */}
            <div className="pt-1 flex flex-col gap-2.5">
              {/* Row 1: Pilihan Format Dokumen */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-700 w-24 shrink-0">Format Surat:</span>
                <button
                  onClick={() => setDocMode('SKL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    docMode === 'SKL'
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Surat Keterangan Lulus (SKL)</span>
                </button>

                <button
                  onClick={() => setDocMode('TRANSKRIP')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    docMode === 'TRANSKRIP'
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Transkrip Nilai (14 Mapel)</span>
                </button>

                <button
                  onClick={() => setDocMode('BOTH')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    docMode === 'BOTH'
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Paket Lengkap (SKL + Transkrip)</span>
                </button>
              </div>

              {/* Row 2: Pilihan Ukuran Kertas & Ukuran Logo */}
              <div className="flex items-center gap-4 flex-wrap text-xs">
                {/* Pilihan Kertas (A4, F4 / Folio, Legal) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-700 w-24 shrink-0">Ukuran Kertas:</span>
                  {(['A4', 'F4', 'LEGAL'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setPaperSize(size)}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        paperSize === size
                          ? 'bg-slate-800 text-white shadow-sm font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {size === 'A4' ? 'A4 (210×297 mm)' : size === 'F4' ? 'F4 / Folio (215×330 mm)' : 'Legal (216×356 mm)'}
                    </button>
                  ))}
                </div>

                {/* Slider Ukuran Logo Bersama (Keduanya Sama Besar) */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
                  <span className="text-[11px] font-semibold text-slate-600">Besar Logo (Kiri & Kanan Sama):</span>
                  <input
                    type="range"
                    min="52"
                    max="80"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-20 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono font-bold text-blue-700 w-8">{logoSize}px</span>
                </div>
              </div>

              {/* Row 3: Pengaturan Tahun Pelajaran Global */}
              <div className="flex items-center gap-3 flex-wrap text-xs pt-0.5">
                <span className="text-xs font-semibold text-slate-700 w-24 shrink-0">Tahun Pelajaran:</span>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <input
                    type="text"
                    value={tahunAjaranGlobal}
                    onChange={(e) => setTahunAjaranGlobal(e.target.value)}
                    placeholder="2025/2026"
                    className="w-24 px-2 py-0.5 text-xs font-bold text-center bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleApplyTahunAjaranToAll}
                    title="Terapkan tahun pelajaran ini ke seluruh siswa"
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Terapkan ke Semua Siswa</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 italic">
                  *Tahun ini otomatis tercetak pada SKL, Transkrip, dan templat import siswa.
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-800 text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Import Siswa (Pakai Template)</span>
            </button>

            <button
              onClick={handleExportCurrentData}
              className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download seluruh data siswa ke format Excel"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={() => handlePrint()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>
                Cetak Massal {docMode === 'BOTH' ? 'Paket' : docMode} ({filteredSiswa.length} Siswa)
              </span>
            </button>
          </div>
        </div>

        {/* Ringkasan Cepat */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Siswa Terdaftar</div>
              <div className="text-lg font-bold text-slate-800">{daftarSiswa.length} Siswa</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Status Kelulusan</div>
              <div className="text-lg font-bold text-emerald-600">100% LULUS</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">NPSN Satuan Pend.</div>
              <div className="text-lg font-bold text-slate-800">{profilSekolah.npsn}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Penyelenggara Ujian</div>
              <div className="text-xs font-bold text-slate-800">USBA 2025/2026</div>
            </div>
          </div>
        </div>

        {/* Filter & Tabel Data Siswa */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Bar Pencarian & Filter */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, NISN, no ijazah..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Jurusan:</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                {(['ALL', 'MIPA', 'IPS'] as const).map((jurusan) => (
                  <button
                    key={jurusan}
                    onClick={() => setSelectedJurusan(jurusan)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      selectedJurusan === jurusan
                        ? 'bg-white text-blue-700 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {jurusan === 'ALL' ? 'Semua' : jurusan}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabel Data Siswa */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Lengkap & NISN</th>
                  <th className="py-3 px-4">Kelas / Peminatan</th>
                  <th className="py-3 px-4">Nomor Ijazah</th>
                  <th className="py-3 px-4 text-center">Rata-Rata Nilai</th>
                  <th className="py-3 px-4 text-center">No. Surat (SKL/Transkrip)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSiswa.map((siswa, index) => (
                  <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-xs">{siswa.namaLengkap}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        NISN: {siswa.nisn} • {siswa.tempatLahir}, {siswa.tanggalLahir}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{siswa.kelas}</span>
                      <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {siswa.jurusan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {siswa.nomorIjazah || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-extrabold text-blue-700 text-sm">{siswa.rataRataSkl}</div>
                      <div className="text-[10px] text-slate-400">Kurikulum 2013</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-600">
                      SKL: {siswa.nomorSuratSkl} / TR: {siswa.nomorSuratTranskrip}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {siswa.statusKelulusan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingSiswa(siswa)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="Edit Data & Nilai"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPreviewSiswa(siswa)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
                          title="Pratinjau Dokumen"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Pratinjau</span>
                        </button>
                        <button
                          onClick={() => handlePrint(siswa)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1.5 shadow-sm transition-colors"
                          title="Cetak Sekarang"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL PRATINJAU DOKUMEN CETAK (LIVE PREVIEW)                              */}
      {/* ========================================================================= */}
      {previewSiswa && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
          <div className="bg-slate-100 rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden print:w-full print:max-h-none print:shadow-none print:rounded-none">
            {/* Modal Header */}
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <span>Pratinjau: {previewSiswa.namaLengkap}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                    NISN: {previewSiswa.nisn}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Desain persis sesuai dokumen fisik resmi SMA Negeri 3 Buru
                </p>
              </div>

              {/* Document Tab Switcher & Paper Size inside Modal */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Mode Dokumen */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
                  <button
                    onClick={() => setDocMode('SKL')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      docMode === 'SKL'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    SKL (Hal 1)
                  </button>
                  <button
                    onClick={() => setDocMode('TRANSKRIP')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      docMode === 'TRANSKRIP'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Transkrip (Hal 2)
                  </button>
                  <button
                    onClick={() => setDocMode('BOTH')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      docMode === 'BOTH'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Keduanya (2 Hal)
                  </button>
                </div>

                {/* Ukuran Kertas Selector */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
                  {(['A4', 'F4', 'LEGAL'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setPaperSize(size)}
                      className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                        paperSize === size
                          ? 'bg-slate-800 text-white shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {size === 'A4' ? 'A4' : size === 'F4' ? 'F4 / Folio' : 'Legal'}
                    </button>
                  ))}
                </div>

                {/* Slider Logo Bersama */}
                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl text-xs">
                  <span className="text-[11px] font-medium text-slate-600">Logo:</span>
                  <input
                    type="range"
                    min="52"
                    max="80"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-16 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono font-bold text-blue-700">{logoSize}px</span>
                </div>

                <button
                  onClick={() => handlePrint(previewSiswa)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak {paperSize}</span>
                </button>
                <button
                  onClick={() => setPreviewSiswa(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - SklDocument */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-300/60 print:p-0 print:bg-white print:overflow-visible">
              <SklDocument
                siswa={previewSiswa}
                mode={docMode}
                paperSize={paperSize}
                logoSize={logoSize}
                logoKiriUrl={logoKiriUrl}
                logoKananUrl={logoKananUrl}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL EDIT DATA SISWA & NILAI                                             */}
      {/* ========================================================================= */}
      {editingSiswa && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Edit Data & Nilai: {editingSiswa.namaLengkap}
                </h3>
                <p className="text-xs text-slate-500">
                  Ubah nomor surat, nomor ijazah, atau nilai mata pelajaran
                </p>
              </div>
              <button
                onClick={() => setEditingSiswa(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Data Identitas */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Identitas Siswa & Nomor Dokumen
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={editingSiswa.namaLengkap}
                      onChange={(e) =>
                        setEditingSiswa({ ...editingSiswa, namaLengkap: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      value={editingSiswa.tempatLahir}
                      onChange={(e) =>
                        setEditingSiswa({ ...editingSiswa, tempatLahir: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tanggal Lahir
                    </label>
                    <input
                      type="text"
                      value={editingSiswa.tanggalLahir}
                      onChange={(e) =>
                        setEditingSiswa({ ...editingSiswa, tanggalLahir: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      NISN
                    </label>
                    <input
                      type="text"
                      value={editingSiswa.nisn}
                      onChange={(e) =>
                        setEditingSiswa({ ...editingSiswa, nisn: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nomor Ijazah
                    </label>
                    <input
                      type="text"
                      value={editingSiswa.nomorIjazah}
                      onChange={(e) =>
                        setEditingSiswa({ ...editingSiswa, nomorIjazah: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tanggal Kelulusan
                    </label>
                    <input
                      type="text"
                      value={editingSiswa.tanggalKelulusan}
                      onChange={(e) =>
                        setEditingSiswa({ ...editingSiswa, tanggalKelulusan: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      No. Surat SKL (contoh: 087)
                    </label>
                    <input
                      type="text"
                      value={editingSiswa.nomorSuratSkl}
                      onChange={(e) =>
                        setEditingSiswa({ ...editingSiswa, nomorSuratSkl: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      No. Surat Transkrip (contoh: 074)
                    </label>
                    <input
                      type="text"
                      value={editingSiswa.nomorSuratTranskrip}
                      onChange={(e) =>
                        setEditingSiswa({ ...editingSiswa, nomorSuratTranskrip: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Status Kelulusan
                    </label>
                    <select
                      value={editingSiswa.statusKelulusan}
                      onChange={(e) =>
                        setEditingSiswa({
                          ...editingSiswa,
                          statusKelulusan: e.target.value as 'LULUS' | 'TIDAK LULUS',
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="LULUS">LULUS</option>
                      <option value="TIDAK LULUS">TIDAK LULUS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tahun Pelajaran (SKL)
                    </label>
                    <input
                      type="text"
                      value={editingSiswa.tahunAjaran || ''}
                      onChange={(e) =>
                        setEditingSiswa({ ...editingSiswa, tahunAjaran: e.target.value })
                      }
                      placeholder="2025/2026"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Nilai Mata Pelajaran */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Daftar Nilai Mata Pelajaran (SKL & Transkrip)
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 text-left">Kelompok</th>
                        <th className="py-2 px-3 text-left">Mata Pelajaran</th>
                        <th className="py-2 px-3 w-28 text-center">Nilai (cth: 84,94)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editingSiswa.nilaiSkl.map((mapel, index) => (
                        <tr key={`edit-${index}`} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-500">
                            Kel. {mapel.kelompok}
                          </td>
                          <td className="py-2 px-3 font-medium text-slate-800">
                            {mapel.nama}
                          </td>
                          <td className="py-1 px-3 text-center">
                            <input
                              type="text"
                              value={mapel.nilai}
                              onChange={(e) => {
                                const newNilaiSkl = [...editingSiswa.nilaiSkl];
                                newNilaiSkl[index] = { ...mapel, nilai: e.target.value };
                                
                                // Sync transkrip if subject name matches
                                const newNilaiTrans = editingSiswa.nilaiTranskrip.map((t) => {
                                  if (t.nama === mapel.nama) {
                                    return { ...t, nilai: e.target.value };
                                  }
                                  return t;
                                });

                                setEditingSiswa({
                                  ...editingSiswa,
                                  nilaiSkl: newNilaiSkl,
                                  nilaiTranskrip: newNilaiTrans,
                                });
                              }}
                              className="w-24 text-center px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSiswa(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL LENGKAP: IMPORT SISWA & NILAI PAKAI TEMPLATE EXCEL / CSV            */}
      {/* ========================================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base leading-tight">
                    Import Siswa & Nilai Pakai Template
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Isi seluruh data identitas, nilai SKL, transkrip, dan tahun pelajaran sekaligus tanpa perlu input manual satu per satu.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportPreview(null);
                  setImportError(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* BAGIAN 1: UNDUH TEMPLATE */}
              <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                      <FileDown className="w-4 h-4 text-blue-600" />
                      Langkah 1: Unduh Format Template Resmi
                    </span>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Gunakan template Excel resmi yang sudah disesuaikan dengan format SKL & Transkrip Nilai SMA Negeri 3 Buru.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => downloadExcelTemplate(tahunAjaranGlobal)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Template Excel (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadCsvTemplate(tahunAjaranGlobal)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Download Template CSV</span>
                  </button>
                </div>

                <div className="text-[11px] text-blue-700 space-y-1 pt-1 bg-white/70 p-3 rounded-xl border border-blue-100">
                  <div className="font-semibold text-blue-900">Kolom yang Disediakan Dalam Template:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-blue-800 leading-normal">
                    <li><strong>Identitas:</strong> NAMA_LENGKAP, NISN, NIS, TEMPAT_LAHIR, TANGGAL_LAHIR, NAMA_ORANG_TUA, NO_PESERTA_UJIAN, KELAS, JURUSAN (MIPA/IPS), <strong>TAHUN_PELAJARAN</strong>, NO_SURAT_SKL, NO_SURAT_TRANSKRIP, NO_IJAZAH, TANGGAL_KELULUSAN, STATUS_KELULUSAN.</li>
                    <li><strong>Nilai Kelompok A:</strong> PA_BP (Agama), PPKN, B_INDONESIA, MATEMATIKA_UMUM, SEJARAH_INDONESIA, B_INGGRIS.</li>
                    <li><strong>Nilai Kelompok B:</strong> SENI_BUDAYA, PJOK, PKWU, BAHASA_ARAB.</li>
                    <li><strong>Nilai Peminatan & Lintas Minat:</strong> PEMINATAN_1 s/d 4 (Matematika/Biologi/Fisika/Kimia atau Geografi/Sejarah/Sosiologi/Ekonomi) dan LINTAS_MINAT.</li>
                    <li><em>*Rata-rata dan terbilang nilai otomatis dikalkulasi secara presisi oleh sistem.</em></li>
                  </ul>
                </div>
              </div>

              {/* BAGIAN 2: UNGGAH FILE EXCEL / CSV */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  Langkah 2: Unggah File yang Sudah Diisi
                </span>

                <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/60 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center gap-2 block">
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  <div className="p-3 bg-white shadow-sm border border-slate-200 rounded-2xl text-emerald-600">
                    <FileSpreadsheet className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-700">
                      {importFile ? importFile.name : 'Klik untuk memilih file Excel (.xlsx / .csv)'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {importFile ? `${(importFile.size / 1024).toFixed(1)} KB` : 'Dukung format .xlsx, .xls, atau .csv'}
                    </div>
                  </div>
                </label>

                {isParsing && (
                  <div className="flex items-center justify-center gap-2 py-3 text-xs text-blue-600 font-medium">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Membaca dan memvalidasi baris data siswa...</span>
                  </div>
                )}

                {importError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">{importError}</div>
                  </div>
                )}
              </div>

              {/* BAGIAN 3: PRATINJAU HASIL PARSING (JIKA BERHASIL) */}
              {importPreview && importPreview.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Langkah 3: Pratinjau Data Siswa
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {importPreview.length} Siswa Terbaca
                      </span>
                    </div>

                    {/* Pilihan Mode Import */}
                    <div className="flex items-center gap-3 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'REPLACE'}
                          onChange={() => setImportMode('REPLACE')}
                          className="accent-emerald-600"
                        />
                        <span className="font-semibold text-slate-700 text-[11px]">Gantikan Data Lama (Reset)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'APPEND'}
                          onChange={() => setImportMode('APPEND')}
                          className="accent-emerald-600"
                        />
                        <span className="font-semibold text-slate-700 text-[11px]">Tambahkan ke Data Ada</span>
                      </label>
                    </div>
                  </div>

                  {/* Tabel Pratinjau Singkat */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-[11px]">
                      <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="py-1.5 px-2.5 text-center w-8">No</th>
                          <th className="py-1.5 px-2.5 text-left">Nama Siswa</th>
                          <th className="py-1.5 px-2.5 text-center">NISN</th>
                          <th className="py-1.5 px-2.5 text-center">Jurusan</th>
                          <th className="py-1.5 px-2.5 text-center">Tahun Ajaran</th>
                          <th className="py-1.5 px-2.5 text-center">No. SKL</th>
                          <th className="py-1.5 px-2.5 text-center">Rata-rata</th>
                          <th className="py-1.5 px-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {importPreview.map((s, idx) => (
                          <tr key={`prev-${idx}`} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2.5 text-center text-slate-400">{idx + 1}</td>
                            <td className="py-1.5 px-2.5 font-bold text-slate-900">{s.namaLengkap}</td>
                            <td className="py-1.5 px-2.5 text-center font-mono">{s.nisn}</td>
                            <td className="py-1.5 px-2.5 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${s.jurusan === 'MIPA' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                {s.jurusan}
                              </span>
                            </td>
                            <td className="py-1.5 px-2.5 text-center font-medium text-slate-600">{s.tahunAjaran}</td>
                            <td className="py-1.5 px-2.5 text-center font-mono">{s.nomorSuratSkl}</td>
                            <td className="py-1.5 px-2.5 text-center font-bold text-emerald-700">{s.rataRataSkl}</td>
                            <td className="py-1.5 px-2.5 text-center">
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {s.statusKelulusan}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportPreview(null);
                  setImportError(null);
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={!importPreview || importPreview.length === 0}
                onClick={handleConfirmImport}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
                  importPreview && importPreview.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-600/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {importPreview && importPreview.length > 0
                    ? `Konfirmasi & Muat ${importPreview.length} Siswa ke SKL`
                    : 'Pilih File untuk Import'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
