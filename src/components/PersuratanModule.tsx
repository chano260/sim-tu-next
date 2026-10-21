'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Surat } from '@/types';
import CetakSuratResmi, { 
  TipeSuratResmi, 
  DataSuratSkhun, 
  DataSuratIzin, 
  DataSuratTugasSatuan, 
  DataSuratTugasBanyak, 
  DataSuratPak 
} from '@/components/CetakSuratResmi';
import SuratMasuk from '@/components/arkas/SuratMasuk';
import SuratKeluar from '@/components/arkas/SuratKeluar';
import { 
  Mail, 
  Plus, 
  Search, 
  Printer, 
  FileText, 
  X, 
  Users, 
  UserCheck, 
  FileCheck2, 
  Calendar, 
  Layers, 
  SlidersHorizontal, 
  BookOpen, 
  Edit3, 
  Inbox, 
  Send, 
  LayoutDashboard, 
  FileCheck, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export type SubView = 'DASHBOARD' | 'SURAT_MASUK' | 'SURAT_KELUAR' | 'SURAT_KILAT' | 'AGENDA';

export default function PersuratanModule({
  initialSubView = 'DASHBOARD',
  logoKiriUrl,
  logoKananUrl,
  logoKiriSize,
  logoKananSize
}: {
  initialSubView?: SubView,
  logoKiriUrl?: string | null,
  logoKananUrl?: string | null,
  logoKiriSize?: number,
  logoKananSize?: number
}) {
  const [activeSubView, setActiveSubView] = useState<SubView>(initialSubView);
  const [activeFormat, setActiveFormat] = useState<TipeSuratResmi>('SKHUN');
  const [showSidebarEdit, setShowSidebarEdit] = useState<boolean>(false);

  // Live Stats from offline API
  const [suratMasukCount, setSuratMasukCount] = useState<number>(0);
  const [suratKeluarCount, setSuratKeluarCount] = useState<number>(0);

  const fetchStats = async () => {
    try {
      const [resMasuk, resKeluar] = await Promise.all([
        axios.get('/api/surat-masuk').catch(() => ({ data: [] })),
        axios.get('/api/surat-keluar').catch(() => ({ data: [] }))
      ]);
      setSuratMasukCount(Array.isArray(resMasuk.data) ? resMasuk.data.length : 0);
      setSuratKeluarCount(Array.isArray(resKeluar.data) ? resKeluar.data.length : 0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [activeSubView]);

  // Database Buku Agenda Manual / Simpanan
  const [suratList, setSuratList] = useState<Surat[]>([
    {
      id: 'surat-skhun-1',
      nomorSurat: '421.4 / 190 / 2026',
      tanggal: '01 Oktober 2026',
      perihal: 'Surat Keterangan Tidak Memiliki SKHUN a.n. MARWAN DEDERISAL BELEN',
      tujuanPengirim: 'Alumni / Siswa (Keperluan Kuliah/Kerja)',
      jenis: 'Keluar',
      status: 'Selesai'
    },
    {
      id: 'surat-izin-1',
      nomorSurat: '421.4 / 197 / 2026',
      tanggal: '30 September 2026',
      perihal: 'Surat Izin Keperluan Nikah Dinas a.n. SITI SARA NAMSA, S.Pd',
      tujuanPengirim: 'SITI SARA NAMSA, S.Pd (Guru)',
      jenis: 'Keluar',
      status: 'Selesai'
    },
    {
      id: 'surat-tugas-1',
      nomorSurat: '421.4 / 166 / 2026',
      tanggal: '01 September 2026',
      perihal: 'Surat Tugas Peserta Bimtek Fasilitator BOSP a.n. ANHAR FIRMANSYAH, S.Pd.I',
      tujuanPengirim: 'BPMP Provinsi Maluku',
      jenis: 'Keluar',
      status: 'Selesai'
    },
    {
      id: 'surat-tugas-kolektif-1',
      nomorSurat: '421.4 / 164 / 2026',
      tanggal: '31 Agustus 2026',
      perihal: 'Surat Tugas Lomba Pembacaan Literasi dan Penulisan Resensi (3 Guru)',
      tujuanPengirim: 'Dinas Pendidikan Provinsi Maluku',
      jenis: 'Keluar',
      status: 'Selesai'
    },
    {
      id: 'surat-pak-1',
      nomorSurat: '421.4 / 156 / 2026',
      tanggal: '12 Agustus 2026',
      perihal: 'Surat Pengantar Usulan PAK Integrasi an. SUGITO, S. Pd',
      tujuanPengirim: 'Cabang Dinas Pendidikan Kab. Buru (Namlea)',
      jenis: 'Keluar',
      status: 'Selesai'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState<'ALL' | 'Masuk' | 'Keluar'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showAddAgendaModal, setShowAddAgendaModal] = useState(false);

  // 1. Data Surat Keterangan Tidak Memiliki SKHUN
  const [dataSkhun, setDataSkhun] = useState<DataSuratSkhun>({
    nomorSurat: '421.4 / 190 / 2026',
    namaSiswa: 'MARWAN DEDERISAL BELEN',
    nisn: '0074344859',
    npsn: '60101015',
    tempatTglLahir: 'Bialahin, 15 Mei 2007',
    alamatSiswa: 'Waegeren, Kec. Lolong Guba, Kab. Buru',
    tahunPelajaran: '2025/2026',
    tanggalSurat: '01 Oktober 2026'
  });

  // 2. Data Surat Izin Guru / Pegawai
  const [dataIzin, setDataIzin] = useState<DataSuratIzin>({
    nomorSurat: '421.4 / 197 / 2026',
    namaPegawai: 'SITI SARA NAMSA, S.Pd',
    nipPegawai: '19970107 202321 2025',
    pangkatGolongan: 'GOL.IX',
    jabatan: 'Guru',
    alamatPegawai: 'Waenetat, Kec. Waeapo, Kab. Buru',
    keperluanIzin: 'Mengurus Keperluan Nikah Dinas',
    tanggalMulaiSelesai: '6 - 7 Oktober 2026',
    tanggalSurat: '30 September 2026'
  });

  // 3. Data Surat Tugas Perorangan
  const [dataTugasSatuan, setDataTugasSatuan] = useState<DataSuratTugasSatuan>({
    nomorSurat: '421.4 / 166 / 2026',
    namaPegawai: 'ANHAR FIRMANSYAH, S.Pd.I',
    nipPegawai: '19910621 201504 1001',
    pangkatGolongan: 'Penata Tk. I - III/c',
    jabatan: 'Guru',
    alamatPegawai: 'Waekerta, Kec Waeapo Kab Buru',
    uraianTugas: 'Sebagai Peserta dalam kegiatan Bimbingan Teknis Fasilitator Daerah BOSP Kinerja Terbaik Tahun 2026 yang diselenggarakan oleh Badan Penjaminan Mutu Pendidikan (BPMP) Provinsi Maluku',
    tanggalTugas: '07 sampai dengan 09 September 2026',
    tempatTugas: 'BPMP Provinsi Maluku',
    tanggalSurat: '01 September 2026'
  });

  // 4. Data Surat Tugas Banyak Orang (Kolektif)
  const [dataTugasBanyak, setDataTugasBanyak] = useState<DataSuratTugasBanyak>({
    nomorSurat: '421.4 / 164 / 2026',
    daftarPeserta: [
      {
        no: 1,
        nama: 'NANIK IRAWATI, SS',
        nip: 'Nip.19870131 202321 2024',
        pangkatGolongan: 'GOL.IX',
        jabatan: 'GURU',
        alamat: '...'
      },
      {
        no: 2,
        nama: 'SITI SARA NAMSA, S.Pd',
        nip: 'Nip.19970107 202321 2025',
        pangkatGolongan: 'GOL.IX',
        jabatan: 'GURU',
        alamat: '...'
      },
      {
        no: 3,
        nama: 'ZULAIHA PACINA, S.Pd',
        nip: 'Nip.19840718 202421 2006',
        pangkatGolongan: 'GOL.IX',
        jabatan: 'GURU',
        alamat: '...'
      }
    ],
    keperluanTugas: 'mengikuti Lomba Pembacaan Literasi dan Penulisan Resensi',
    tanggalSurat: '31 Agustus 2026'
  });

  // 5. Data Surat Pengantar PAK
  const [dataPak, setDataPak] = useState<DataSuratPak>({
    nomorSurat: '421.4 / 156 / 2026',
    tujuanSurat: 'Kepala Cabang Dinas Pendidikan Menengah',
    kotaTujuan: 'N a m l e a',
    namaPegawaiPak: 'SUGITO, S. Pd',
    nipPegawaiPak: '19730905 200501 1008',
    banyaknya: '1 ( Satu ) Jepit',
    keterangan: 'Disampaikan untuk dapat diketahui dan proses selanjutnya.',
    tanggalSurat: '12 Agustus 2026',
    isPlt: true
  });

  // Form Baru Agenda
  const [newAgenda, setNewAgenda] = useState({
    nomorSurat: '',
    tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    perihal: '',
    tujuanPengirim: '',
    jenis: 'Keluar' as 'Masuk' | 'Keluar',
    status: 'Selesai' as 'Selesai' | 'Proses' | 'Disposisi'
  });

  // Filter List Agenda
  const filteredList = suratList.filter((s) => {
    const matchSearch = 
      s.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tujuanPengirim.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJenis = filterJenis === 'ALL' || s.jenis === filterJenis;
    const matchStatus = filterStatus === 'ALL' || s.status === filterStatus;
    return matchSearch && matchJenis && matchStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  const simpanSuratAktifKeAgenda = () => {
    let nomor = '';
    let perihal = '';
    let tujuan = '';

    if (activeFormat === 'SKHUN') {
      nomor = dataSkhun.nomorSurat;
      perihal = `Surat Keterangan Tidak Memiliki SKHUN a.n. ${dataSkhun.namaSiswa}`;
      tujuan = 'Alumni / Siswa';
    } else if (activeFormat === 'IZIN') {
      nomor = dataIzin.nomorSurat;
      perihal = `Surat Izin a.n. ${dataIzin.namaPegawai} (${dataIzin.keperluanIzin})`;
      tujuan = dataIzin.namaPegawai;
    } else if (activeFormat === 'TUGAS_SATUAN') {
      nomor = dataTugasSatuan.nomorSurat;
      perihal = `Surat Tugas a.n. ${dataTugasSatuan.namaPegawai}`;
      tujuan = dataTugasSatuan.tempatTugas;
    } else if (activeFormat === 'TUGAS_BANYAK') {
      nomor = dataTugasBanyak.nomorSurat;
      perihal = `Surat Tugas Kolektif (${dataTugasBanyak.daftarPeserta.length} Guru)`;
      tujuan = dataTugasBanyak.keperluanTugas;
    } else if (activeFormat === 'PAK') {
      nomor = dataPak.nomorSurat;
      perihal = `Surat Pengantar Usulan PAK a.n. ${dataPak.namaPegawaiPak}`;
      tujuan = dataPak.tujuanSurat;
    }

    const item: Surat = {
      id: 'surat-' + Date.now(),
      nomorSurat: nomor,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      perihal,
      tujuanPengirim: tujuan,
      jenis: 'Keluar',
      status: 'Selesai'
    };

    setSuratList([item, ...suratList]);
    alert(`Surat berhasil dicatat ke Buku Agenda Surat Keluar!\nNomor Surat: ${nomor}\nPerihal: ${perihal}`);
  };

  return (
    <div className="space-y-5 print:space-y-0 print:m-0 print:p-0">
      {/* ======================================================== */}
      {/* 1. TOP SUB-NAVIGASI UTAMA (SATU PINTU PERSURATAN & DASBOR TU) */}
      {/* ======================================================== */}
      <div className="print:hidden bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {/* TAB 1: DASBOR TU */}
          <button
            onClick={() => setActiveSubView('DASHBOARD')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubView === 'DASHBOARD'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dasbor TU</span>
          </button>

          {/* TAB 2: SURAT MASUK */}
          <button
            onClick={() => setActiveSubView('SURAT_MASUK')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubView === 'SURAT_MASUK'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Surat Masuk</span>
            {suratMasukCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeSubView === 'SURAT_MASUK' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {suratMasukCount}
              </span>
            )}
          </button>

          {/* TAB 3: SURAT KELUAR */}
          <button
            onClick={() => setActiveSubView('SURAT_KELUAR')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubView === 'SURAT_KELUAR'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Surat Keluar &amp; Generator</span>
            {suratKeluarCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeSubView === 'SURAT_KELUAR' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {suratKeluarCount}
              </span>
            )}
          </button>

          {/* TAB 4: FORMAT CETAK KILAT */}
          <button
            onClick={() => setActiveSubView('SURAT_KILAT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubView === 'SURAT_KILAT'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Format Cetak Kilat (5)</span>
          </button>

          {/* TAB 5: BUKU AGENDA */}
          <button
            onClick={() => setActiveSubView('AGENDA')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubView === 'AGENDA'
                ? 'bg-slate-800 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Buku Agenda ({suratList.length})</span>
          </button>
        </div>

        {/* Status Mode Banner */}
        <div className="text-[11px] text-slate-500 font-medium px-2 hidden md:flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Satu Pintu Layanan TU Offline</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SUB-VIEW: DASBOR TATA USAHA (TERPADU ARKAS & SIM-TU) */}
      {/* ======================================================== */}
      {activeSubView === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Hero Welcome Card */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-2">
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 border border-white/15">
                Portal Administrasi Persuratan Terpadu
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Dasbor Persuratan Tata Usaha
              </h2>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Pusat kendali satu pintu layanan Tata Usaha SMA Negeri 3 Buru. Kelola arsip surat masuk, buat berbagai surat dinas otomatis, cetak dokumen resmi (12pt Times New Roman), dan pencatatan buku agenda secara offline.
              </p>
            </div>
            {/* Background Accent Graphics */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          </div>

          {/* Quick Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">{suratMasukCount}</div>
                <div className="text-[11px] text-slate-500 font-medium">Surat Masuk</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">{suratKeluarCount}</div>
                <div className="text-[11px] text-slate-500 font-medium">Surat Keluar</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">8+</div>
                <div className="text-[11px] text-slate-500 font-medium">Template Dinas</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">{suratList.length}</div>
                <div className="text-[11px] text-slate-500 font-medium">Buku Agenda</div>
              </div>
            </div>
          </div>

          {/* 4 MENU KARTU BESAR (SEPERTI DASBOR TU ARKAS TAPI TERINTEGRASI) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* KARTU 1: SURAT MASUK */}
            <div 
              onClick={() => setActiveSubView('SURAT_MASUK')}
              className="group bg-white rounded-2xl p-6 border-2 border-slate-200/90 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-2xl group-hover:scale-105 transition-transform">
                    📥
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    Arsip &amp; Berkas
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Surat Masuk
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pencatatan surat dinas yang diterima, nomor surat, tanggal diterima TU, instansi pengirim, dan pengarsipan berkas fisik digital (PDF/Scan).
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                <span>Buka Arsip Surat Masuk ({suratMasukCount})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* KARTU 2: SURAT KELUAR & GENERATOR */}
            <div 
              onClick={() => setActiveSubView('SURAT_KELUAR')}
              className="group bg-white rounded-2xl p-6 border-2 border-slate-200/90 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl group-hover:scale-105 transition-transform">
                    📤
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                    Generator Resmi
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Surat Keluar &amp; Generator
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pembuatan otomatis berbagai surat dinas sekolah: Surat Tugas Individu &amp; Kolektif, Surat Izin, Berita Acara BOSP, SK Berkala, Usulan PAK, dan Rekap Absen. Cetak kop resmi 12pt Times New Roman.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                <span>Buka Generator Surat Keluar ({suratKeluarCount})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* KARTU 3: FORMAT CETAK KILAT */}
            <div 
              onClick={() => setActiveSubView('SURAT_KILAT')}
              className="group bg-white rounded-2xl p-6 border-2 border-slate-200/90 hover:border-amber-500 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-2xl group-hover:scale-105 transition-transform">
                    🖨️
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                    Editor Lembar A4
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Format Cetak Kilat (SIM-TU)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ketik dan edit langsung teks pada kertas A4 (WYSIWYG) untuk penerbitan instan: Surat Keterangan Tidak Memiliki SKHUN, Izin Nikah Dinas Guru, Tugas Bimtek, dan Pengantar PAK.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600 group-hover:text-amber-700">
                <span>Buka Editor Lembar Cetak</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* KARTU 4: BUKU AGENDA */}
            <div 
              onClick={() => setActiveSubView('AGENDA')}
              className="group bg-white rounded-2xl p-6 border-2 border-slate-200/90 hover:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-2xl group-hover:scale-105 transition-transform">
                    📖
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-full">
                    Buku Registrasi
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-900 transition-colors">
                  Buku Agenda Persuratan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rekapitulasi nomor registrasi surat keluar dan surat masuk dengan riwayat tanggal, perihal, tujuan pengiriman, dan status penyelesaian.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Lihat Buku Agenda ({suratList.length})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SUB-VIEW: SURAT MASUK (DARI ARKAS TU) */}
      {/* ======================================================== */}
      {activeSubView === 'SURAT_MASUK' && (
        <SuratMasuk onBack={() => setActiveSubView('DASHBOARD')} />
      )}

      {/* ======================================================== */}
      {/* 4. SUB-VIEW: SURAT KELUAR & GENERATOR (DARI ARKAS TU) */}
      {/* ======================================================== */}
      {activeSubView === 'SURAT_KELUAR' && (
        <SuratKeluar 
          onBack={() => setActiveSubView('DASHBOARD')} 
          logoKiriUrl={logoKiriUrl}
          logoKananUrl={logoKananUrl}
          logoKiriSize={logoKiriSize}
          logoKananSize={logoKananSize}
        />
      )}

      {/* ======================================================== */}
      {/* 5. SUB-VIEW: FORMAT CETAK KILAT (SIM-TU DOKUMEN VIEW) */}
      {/* ======================================================== */}
      {activeSubView === 'SURAT_KILAT' && (
        <div className="space-y-4">
          {/* Sub Bar Navigasi 5 Format */}
          <div className="print:hidden bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveFormat('SKHUN')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeFormat === 'SKHUN'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Tidak Ada SKHUN</span>
              </button>

              <button
                onClick={() => setActiveFormat('IZIN')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeFormat === 'IZIN'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>2. Surat Izin Guru</span>
              </button>

              <button
                onClick={() => setActiveFormat('TUGAS_SATUAN')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeFormat === 'TUGAS_SATUAN'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>3. Tugas Perorangan</span>
              </button>

              <button
                onClick={() => setActiveFormat('TUGAS_BANYAK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeFormat === 'TUGAS_BANYAK'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>4. Tugas Banyak Orang</span>
              </button>

              <button
                onClick={() => setActiveFormat('PAK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeFormat === 'PAK'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>5. Pengantar PAK</span>
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setShowSidebarEdit(!showSidebarEdit)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                  showSidebarEdit 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                title="Buka form isian alternatif di samping"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showSidebarEdit ? 'Tutup Panel Form' : 'Panel Form Isian'}</span>
              </button>

              <button
                onClick={simpanSuratAktifKeAgenda}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Simpan ke daftar agenda surat keluar"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Simpan ke Agenda</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen (PDF)</span>
              </button>
            </div>
          </div>

          {/* Banner Petunjuk */}
          <div className="print:hidden bg-blue-50 border border-blue-200/80 rounded-xl p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-800">
            <div className="flex items-center gap-2">
              <span className="text-base">📄</span>
              <span>
                <strong>Pratinjau Lembaran Asli A4:</strong> Anda dapat{' '}
                <strong className="underline decoration-blue-400 underline-offset-2">
                  mengklik dan mengetik langsung pada teks surat di bawah
                </strong>{' '}
                (nomor, nama, NIP, tanggal, alasan) persis seperti mengetik di Microsoft Word.
              </span>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-[11px] bg-blue-200/60 px-2 py-0.5 rounded text-blue-900 font-medium">
                Kop Resmi SMA Negeri 3 Buru (12pt Times New Roman)
              </span>
            </div>
          </div>

          {/* Area Meja Dokumen A4 */}
          <div className="bg-slate-700/90 rounded-2xl p-4 sm:p-8 min-h-[800px] flex justify-center overflow-x-auto shadow-inner relative print:bg-transparent print:p-0 print:m-0 print:min-h-0 print:block print:overflow-visible print:shadow-none print:w-full">
            <div className="flex gap-6 max-w-full print:block print:w-full print:max-w-none print:m-0 print:p-0">
              {/* LEMBAR KERTAS SURAT RESMI */}
              <div className="shrink-0 print:block print:w-full print:m-0 print:p-0">
                <CetakSuratResmi
                  tipe={activeFormat}
                  dataSkhun={dataSkhun}
                  dataIzin={dataIzin}
                  dataTugasSatuan={dataTugasSatuan}
                  dataTugasBanyak={dataTugasBanyak}
                  dataPak={dataPak}
                  isEditable={true}
                  onUpdateSkhun={setDataSkhun}
                  onUpdateIzin={setDataIzin}
                  onUpdateTugasSatuan={setDataTugasSatuan}
                  onUpdateTugasBanyak={setDataTugasBanyak}
                  onUpdatePak={setDataPak}
                  logoKiriUrl={logoKiriUrl}
                  logoKananUrl={logoKananUrl}
                  logoKiriSize={logoKiriSize}
                  logoKananSize={logoKananSize}
                />
              </div>

              {/* PANEL EDIT SAMPING */}
              {showSidebarEdit && (
                <div className="print:hidden w-80 bg-white rounded-2xl p-5 border border-slate-200 shadow-xl space-y-4 max-h-[850px] overflow-y-auto shrink-0 self-start animate-in fade-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="font-bold text-slate-800 text-xs uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Form Input Alternatif</span>
                    </div>
                    <button 
                      onClick={() => setShowSidebarEdit(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* FORM INPUT SKHUN */}
                  {activeFormat === 'SKHUN' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nomor Surat</label>
                        <input
                          type="text"
                          value={dataSkhun.nomorSurat}
                          onChange={(e) => setDataSkhun({ ...dataSkhun, nomorSurat: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nama Siswa</label>
                        <input
                          type="text"
                          value={dataSkhun.namaSiswa}
                          onChange={(e) => setDataSkhun({ ...dataSkhun, namaSiswa: e.target.value.toUpperCase() })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold uppercase"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">NISN Siswa</label>
                        <input
                          type="text"
                          value={dataSkhun.nisn}
                          onChange={(e) => setDataSkhun({ ...dataSkhun, nisn: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Tempat &amp; Tgl Lahir</label>
                        <input
                          type="text"
                          value={dataSkhun.tempatTglLahir}
                          onChange={(e) => setDataSkhun({ ...dataSkhun, tempatTglLahir: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Alamat Siswa</label>
                        <textarea
                          rows={2}
                          value={dataSkhun.alamatSiswa}
                          onChange={(e) => setDataSkhun({ ...dataSkhun, alamatSiswa: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Tanggal Surat</label>
                        <input
                          type="text"
                          value={dataSkhun.tanggalSurat}
                          onChange={(e) => setDataSkhun({ ...dataSkhun, tanggalSurat: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM INPUT IZIN */}
                  {activeFormat === 'IZIN' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nomor Surat</label>
                        <input
                          type="text"
                          value={dataIzin.nomorSurat}
                          onChange={(e) => setDataIzin({ ...dataIzin, nomorSurat: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nama Pegawai</label>
                        <input
                          type="text"
                          value={dataIzin.namaPegawai}
                          onChange={(e) => setDataIzin({ ...dataIzin, namaPegawai: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">NIP Pegawai</label>
                        <input
                          type="text"
                          value={dataIzin.nipPegawai}
                          onChange={(e) => setDataIzin({ ...dataIzin, nipPegawai: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Keperluan Izin</label>
                        <textarea
                          rows={2}
                          value={dataIzin.keperluanIzin}
                          onChange={(e) => setDataIzin({ ...dataIzin, keperluanIzin: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Tanggal Mulai - Selesai</label>
                        <input
                          type="text"
                          value={dataIzin.tanggalMulaiSelesai}
                          onChange={(e) => setDataIzin({ ...dataIzin, tanggalMulaiSelesai: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM INPUT TUGAS SATUAN */}
                  {activeFormat === 'TUGAS_SATUAN' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nomor Surat</label>
                        <input
                          type="text"
                          value={dataTugasSatuan.nomorSurat}
                          onChange={(e) => setDataTugasSatuan({ ...dataTugasSatuan, nomorSurat: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nama Pegawai</label>
                        <input
                          type="text"
                          value={dataTugasSatuan.namaPegawai}
                          onChange={(e) => setDataTugasSatuan({ ...dataTugasSatuan, namaPegawai: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Uraian Tugas</label>
                        <textarea
                          rows={3}
                          value={dataTugasSatuan.uraianTugas}
                          onChange={(e) => setDataTugasSatuan({ ...dataTugasSatuan, uraianTugas: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM INPUT TUGAS BANYAK */}
                  {activeFormat === 'TUGAS_BANYAK' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nomor Surat</label>
                        <input
                          type="text"
                          value={dataTugasBanyak.nomorSurat}
                          onChange={(e) => setDataTugasBanyak({ ...dataTugasBanyak, nomorSurat: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Keperluan Tugas</label>
                        <textarea
                          rows={2}
                          value={dataTugasBanyak.keperluanTugas}
                          onChange={(e) => setDataTugasBanyak({ ...dataTugasBanyak, keperluanTugas: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM INPUT PAK */}
                  {activeFormat === 'PAK' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nomor Surat</label>
                        <input
                          type="text"
                          value={dataPak.nomorSurat}
                          onChange={(e) => setDataPak({ ...dataPak, nomorSurat: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nama Pegawai</label>
                        <input
                          type="text"
                          value={dataPak.namaPegawaiPak}
                          onChange={(e) => setDataPak({ ...dataPak, namaPegawaiPak: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SUB-VIEW: BUKU AGENDA PERSURATAN */}
      {/* ======================================================== */}
      {activeSubView === 'AGENDA' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Buku Agenda Persuratan Digital</h3>
              <p className="text-xs text-slate-500">Pencatatan riwayat nomor surat keluar dinas dan surat masuk.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari agenda surat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
                />
              </div>

              {/* Filter Jenis */}
              <select
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-600 focus:outline-none"
              >
                <option value="ALL">Semua Jenis</option>
                <option value="Keluar">Surat Keluar</option>
                <option value="Masuk">Surat Masuk</option>
              </select>

              <button
                onClick={() => setShowAddAgendaModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Catat Surat Baru</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Tanggal &amp; Jenis</th>
                  <th className="py-3 px-4">Nomor Surat</th>
                  <th className="py-3 px-4">Perihal Surat</th>
                  <th className="py-3 px-4">Asal / Tujuan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((surat, index) => (
                  <tr key={surat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium text-slate-400">{index + 1}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-700">{surat.tanggal}</div>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        surat.jenis === 'Masuk' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        Surat {surat.jenis}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">{surat.nomorSurat}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-sm">{surat.perihal}</td>
                    <td className="py-3.5 px-4 text-slate-600">{surat.tujuanPengirim}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {surat.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (surat.perihal.includes('SKHUN')) setActiveFormat('SKHUN');
                          else if (surat.perihal.includes('Izin') || surat.perihal.includes('Nikah')) setActiveFormat('IZIN');
                          else if (surat.perihal.includes('Bimtek')) setActiveFormat('TUGAS_SATUAN');
                          else if (surat.perihal.includes('Lomba') || surat.perihal.includes('Kolektif')) setActiveFormat('TUGAS_BANYAK');
                          else if (surat.perihal.includes('PAK')) setActiveFormat('PAK');
                          setActiveSubView('SURAT_KILAT');
                        }}
                        className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Buka Lembar Cetak</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL CATAT AGENDA MANUAL */}
      {showAddAgendaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Catat Agenda Surat Manual</h3>
              <button onClick={() => setShowAddAgendaModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSuratList([
                  {
                    id: 'surat-' + Date.now(),
                    nomorSurat: newAgenda.nomorSurat,
                    tanggal: newAgenda.tanggal,
                    perihal: newAgenda.perihal,
                    tujuanPengirim: newAgenda.tujuanPengirim,
                    jenis: newAgenda.jenis,
                    status: newAgenda.status
                  },
                  ...suratList
                ]);
                setShowAddAgendaModal(false);
              }}
              className="space-y-3.5"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Surat</label>
                  <select
                    value={newAgenda.jenis}
                    onChange={(e) => setNewAgenda({ ...newAgenda, jenis: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700"
                  >
                    <option value="Keluar">Surat Keluar</option>
                    <option value="Masuk">Surat Masuk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="text"
                    value={newAgenda.tanggal}
                    onChange={(e) => setNewAgenda({ ...newAgenda, tanggal: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Surat</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 421.4 / 199 / 2026"
                  value={newAgenda.nomorSurat}
                  onChange={(e) => setNewAgenda({ ...newAgenda, nomorSurat: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Perihal Surat</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Undangan Rapat Komite Sekolah"
                  value={newAgenda.perihal}
                  onChange={(e) => setNewAgenda({ ...newAgenda, perihal: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tujuan / Asal Pengirim</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Orang Tua / Wali Murid Kelas XII"
                  value={newAgenda.tujuanPengirim}
                  onChange={(e) => setNewAgenda({ ...newAgenda, tujuanPengirim: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAgendaModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Simpan ke Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
