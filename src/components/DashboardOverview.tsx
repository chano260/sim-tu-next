'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Mail, 
  Send,
  GraduationCap, 
  ArrowRight, 
  Users,
  Briefcase,
  School,
  Settings,
  Sparkles,
  Building2,
  DoorOpen,
  ChevronRight
} from 'lucide-react';

interface DashboardOverviewProps {
  onGoToSkl?: () => void;
  onNavigate?: (tab: string) => void;
}

export default function DashboardOverview({ onGoToSkl, onNavigate }: DashboardOverviewProps) {
  const [totalSuratMasuk, setTotalSuratMasuk] = useState(0);
  const [totalSuratKeluar, setTotalSuratKeluar] = useState(0);

  useEffect(() => {
    // Ambil data surat masuk riil
    axios.get('/api/surat-masuk')
      .then(res => {
        const masuk = res.data || [];
        setTotalSuratMasuk(masuk.length);
      })
      .catch(() => {});

    // Ambil data surat keluar riil
    axios.get('/api/surat-keluar')
      .then(res => {
        const keluar = res.data || [];
        setTotalSuratKeluar(keluar.length);
      })
      .catch(() => {});
  }, []);

  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else if (tab === 'skl' && onGoToSkl) {
      onGoToSkl();
    }
  };

  // 6 Ruangan Utama (Mall Directory Concept - Rich, Vibrant & Modern)
  const rooms = [
    {
      id: 'persuratan',
      code: 'RUANG 01',
      title: 'Persuratan & Disposisi TU',
      tagline: 'Satu Pintu Persuratan Dinas',
      desc: 'Buku agenda surat masuk, generator otomatis surat keluar dinas, lembar disposisi Kepala Sekolah, dan arsip digital.',
      icon: Mail,
      topGradient: 'from-blue-600 via-sky-400 to-blue-700',
      iconGradient: 'from-blue-600 via-blue-500 to-sky-400 text-white shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50',
      badgeClass: 'bg-blue-100/90 text-blue-800 border-blue-200/90 ring-1 ring-blue-500/10',
      hoverBorder: 'group-hover:border-blue-400',
      hoverShadow: 'hover:shadow-xl hover:shadow-blue-500/15',
      glowOverlay: 'from-blue-500/5 to-transparent',
      tags: ['Surat Masuk', 'Surat Keluar', 'Lembar Disposisi', 'Buku Agenda'],
      tagClass: 'bg-blue-50/90 text-blue-700 border-blue-200/80 group-hover:bg-blue-100 group-hover:text-blue-800',
      btnGradient: 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/25 group-hover:shadow-blue-500/40'
    },
    {
      id: 'skl',
      code: 'RUANG 02',
      title: 'Kelulusan: SKL & Transkrip',
      tagline: 'Penerbitan Berkas Kelulusan Siswa',
      desc: 'Penerbitan Surat Keterangan Lulus dan Transkrip Nilai Sementara jenjang MIPA & IPS dengan cetak presisi A4 / Legal.',
      icon: GraduationCap,
      topGradient: 'from-indigo-600 via-purple-400 to-violet-700',
      iconGradient: 'from-indigo-600 via-indigo-500 to-purple-400 text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50',
      badgeClass: 'bg-indigo-100/90 text-indigo-800 border-indigo-200/90 ring-1 ring-indigo-500/10',
      hoverBorder: 'group-hover:border-indigo-400',
      hoverShadow: 'hover:shadow-xl hover:shadow-indigo-500/15',
      glowOverlay: 'from-indigo-500/5 to-transparent',
      tags: ['Generator SKL', 'Transkrip Nilai', 'Import Excel/CSV', 'Cetak A4 / Legal'],
      tagClass: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/80 group-hover:bg-indigo-100 group-hover:text-indigo-800',
      btnGradient: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40'
    },
    {
      id: 'kesiswaan',
      code: 'RUANG 03',
      title: 'Buku Induk Kesiswaan',
      tagline: 'Database Peserta Didik & Mutasi',
      desc: 'Biodata lengkap siswa aktif, riwayat NISN, catatan buku register mutasi masuk/keluar, dan rekapitulasi rombel.',
      icon: Users,
      topGradient: 'from-emerald-600 via-teal-400 to-green-700',
      iconGradient: 'from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50',
      badgeClass: 'bg-emerald-100/90 text-emerald-800 border-emerald-200/90 ring-1 ring-emerald-500/10',
      hoverBorder: 'group-hover:border-emerald-400',
      hoverShadow: 'hover:shadow-xl hover:shadow-emerald-500/15',
      glowOverlay: 'from-emerald-500/5 to-transparent',
      tags: ['Buku Induk', 'Pencarian NISN', 'Register Mutasi', 'Rekap Rombel'],
      tagClass: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80 group-hover:bg-emerald-100 group-hover:text-emerald-800',
      btnGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 group-hover:shadow-emerald-500/40'
    },
    {
      id: 'kepegawaian',
      code: 'RUANG 04',
      title: 'Kepegawaian GTK',
      tagline: 'Pendidik & Tenaga Kependidikan',
      desc: 'Database guru dan pegawai tata usaha, pemantauan Kenaikan Gaji Berkala (KGB), pangkat/golongan, dan surat tugas.',
      icon: Briefcase,
      topGradient: 'from-amber-500 via-orange-400 to-amber-600',
      iconGradient: 'from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50',
      badgeClass: 'bg-amber-100/90 text-amber-800 border-amber-200/90 ring-1 ring-amber-500/10',
      hoverBorder: 'group-hover:border-amber-400',
      hoverShadow: 'hover:shadow-xl hover:shadow-amber-500/15',
      glowOverlay: 'from-amber-500/5 to-transparent',
      tags: ['Data Guru & Staf', 'Jadwal KGB', 'Pangkat/Golongan', 'Surat Perintah Tugas'],
      tagClass: 'bg-amber-50/90 text-amber-700 border-amber-200/80 group-hover:bg-amber-100 group-hover:text-amber-800',
      btnGradient: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/25 group-hover:shadow-amber-500/40'
    },
    {
      id: 'sarpras',
      code: 'RUANG 05',
      title: 'Sarana & Prasarana (KIR)',
      tagline: 'Inventarisasi Aset & Ruangan',
      desc: 'Pencatatan inventaris barang ruangan (KIR), kondisi sarana prasarana sekolah, dan log peminjaman aset.',
      icon: School,
      topGradient: 'from-sky-500 via-cyan-400 to-blue-600',
      iconGradient: 'from-sky-600 via-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30 group-hover:shadow-sky-500/50',
      badgeClass: 'bg-sky-100/90 text-sky-800 border-sky-200/90 ring-1 ring-sky-500/10',
      hoverBorder: 'group-hover:border-sky-400',
      hoverShadow: 'hover:shadow-xl hover:shadow-sky-500/15',
      glowOverlay: 'from-sky-500/5 to-transparent',
      tags: ['Kartu Ruang (KIR)', 'Inventaris Aset', 'Kondisi Fisik Ruang', 'Log Peminjaman'],
      tagClass: 'bg-sky-50/90 text-sky-700 border-sky-200/80 group-hover:bg-sky-100 group-hover:text-sky-800',
      btnGradient: 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md shadow-sky-500/25 group-hover:shadow-sky-500/40'
    },
    {
      id: 'pengaturan',
      code: 'RUANG 06',
      title: 'Pengaturan Identitas & Logo',
      tagline: 'Konfigurasi Profil Satuan Pendidikan',
      desc: 'Identitas resmi sekolah pada kop dinas, Kepala Sekolah & NIP, serta upload dan ukuran logo Maluku & sekolah.',
      icon: Settings,
      topGradient: 'from-violet-600 via-purple-500 to-slate-800',
      iconGradient: 'from-violet-700 via-purple-600 to-slate-700 text-white shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50',
      badgeClass: 'bg-violet-100/90 text-violet-800 border-violet-200/90 ring-1 ring-violet-500/10',
      hoverBorder: 'group-hover:border-violet-400',
      hoverShadow: 'hover:shadow-xl hover:shadow-violet-500/15',
      glowOverlay: 'from-violet-500/5 to-transparent',
      tags: ['Kop Surat Dinas', 'Kepala Sekolah & NIP', 'Upload Logo Maluku', 'Upload Logo SMA 3'],
      tagClass: 'bg-violet-50/90 text-violet-700 border-violet-200/80 group-hover:bg-violet-100 group-hover:text-violet-800',
      btnGradient: 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25 group-hover:shadow-violet-500/40'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. HERO LOBI UTAMA (Performa Tinggi, Halus & Berdimensi) */}
      <div className="bg-gradient-to-br from-white via-white to-blue-50/30 rounded-3xl border border-slate-200/80 p-6 sm:p-8 md:p-9 shadow-lg shadow-slate-200/40 relative overflow-hidden animate-fade-in-up">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Pill Status Berwarna Menawan */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200/80 text-blue-800 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              <span>Lobi Utama • SMA Negeri 3 Buru</span>
              <span className="text-blue-300">|</span>
              <span className="text-slate-600 font-semibold">Tahun Pelajaran 2025/2026</span>
            </div>

            {/* Judul & Deskripsi dengan aksen gradasi yang kaya */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Portal Layanan <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">Tata Usaha</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Selamat datang di lobi sentral. Silakan pilih ruangan kerja di bawah untuk memulai administrasi tanpa navigasi yang membingungkan.
            </p>
          </div>

          {/* Quick Counter Info */}
          <div className="flex items-center gap-2.5 self-start md:self-auto text-xs font-semibold text-slate-700 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 px-4 py-2.5 rounded-2xl border border-blue-200/80 shadow-xs shrink-0">
            <DoorOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-extrabold text-blue-900">6 Ruangan Aktif</span>
            <span className="text-slate-500">Siap Diakses</span>
          </div>
        </div>

        {/* 2. STATS BAR BERWARNA & BERDIMENSI (Tidak Flat) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mt-8 pt-6 border-t border-slate-200/60">
          {/* Surat Masuk */}
          <div 
            onClick={() => handleNav('persuratan')}
            className="group/kpi bg-gradient-to-br from-blue-50/90 via-white to-sky-50/70 hover:from-blue-100/90 hover:to-sky-100/80 rounded-2xl p-4 border border-blue-200/80 hover:border-blue-400 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg hover:shadow-blue-500/15 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wider">Surat Masuk</span>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover/kpi:scale-110 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{totalSuratMasuk}</div>
            <div className="text-[11px] text-blue-700 font-bold mt-1 flex items-center gap-0.5">
              <span>Buka agenda</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/kpi:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Surat Keluar */}
          <div 
            onClick={() => handleNav('persuratan')}
            className="group/kpi bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/70 hover:from-emerald-100/90 hover:to-teal-100/80 rounded-2xl p-4 border border-emerald-200/80 hover:border-emerald-400 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg hover:shadow-emerald-500/15 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Surat Keluar</span>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover/kpi:scale-110 transition-transform">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{totalSuratKeluar}</div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-0.5">
              <span>Arsip surat</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/kpi:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Siswa Terdata */}
          <div 
            onClick={() => handleNav('kesiswaan')}
            className="group/kpi bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/70 hover:from-indigo-100/90 hover:to-purple-100/80 rounded-2xl p-4 border border-indigo-200/80 hover:border-indigo-400 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg hover:shadow-indigo-500/15 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-indigo-800 uppercase tracking-wider">Siswa Terdata</span>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover/kpi:scale-110 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">18</div>
            <div className="text-[11px] text-indigo-700 font-bold mt-1 flex items-center gap-0.5">
              <span>Kelas X - XII</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/kpi:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* GTK Terdaftar */}
          <div 
            onClick={() => handleNav('kepegawaian')}
            className="group/kpi bg-gradient-to-br from-amber-50/90 via-white to-orange-50/70 hover:from-amber-100/90 hover:to-orange-100/80 rounded-2xl p-4 border border-amber-200/80 hover:border-amber-400 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg hover:shadow-amber-500/15 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">GTK Terdaftar</span>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover/kpi:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">28</div>
            <div className="text-[11px] text-amber-700 font-bold mt-1 flex items-center gap-0.5">
              <span>Guru & TU</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/kpi:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. DIREKTORI 6 PINTU RUANGAN UTAMA (Warna Hidup, Berdimensi & Interaktif) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs shadow-blue-500/50"></span>
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Pintu Ruangan Kerja Utama
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Klik ruangan untuk langsung masuk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room, idx) => {
            const Icon = room.icon;
            const delayClass = [
              'animation-delay-100',
              'animation-delay-200',
              'animation-delay-300',
              'animation-delay-400',
              'animation-delay-500',
              'animation-delay-600'
            ][idx] || '';

            return (
              <div
                key={room.id}
                onClick={() => handleNav(room.id)}
                className={`group relative bg-white rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/50 transition-all duration-200 ease-out hover:-translate-y-2 cursor-pointer flex flex-col justify-between overflow-hidden active:scale-[0.98] animate-fade-in-up ${delayClass} ${room.hoverBorder} ${room.hoverShadow}`}
              >
                {/* Garis Aksen Gradasi Terang di Bagian Atas */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${room.topGradient}`}></div>

                {/* Ambient Soft Glow on Card Hover */}
                <div className={`absolute inset-0 bg-radial ${room.glowOverlay} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

                <div className="p-6">
                  {/* Top Bar Kartu: Badge Nomor & Icon Bergradasi Luminous */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-xl border tracking-wider transition-colors shadow-2xs ${room.badgeClass}`}>
                      {room.code}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 bg-gradient-to-tr ${room.iconGradient}`}>
                      <Icon className="w-6 h-6 drop-shadow-xs" />
                    </div>
                  </div>

                  {/* Judul & Deskripsi */}
                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-700 transition-colors leading-snug">
                    {room.title}
                  </h3>
                  <div className="text-xs font-bold text-slate-400 mt-0.5">
                    {room.tagline}
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2 font-medium">
                    {room.desc}
                  </p>

                  {/* Feature Tags Berwarna Lembut */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {room.tags.map((tag, tagIdx) => (
                      <span 
                        key={tagIdx}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors shadow-2xs ${room.tagClass}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action: Masuk ke Ruangan dengan Tombol Bergradasi */}
                <div className="p-6 pt-0">
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700 group-hover:text-blue-600 transition-colors">
                      Masuk ke Ruangan
                    </span>
                    <div className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-300 ${room.btnGradient}`}>
                      <span>Buka</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FOOTER TENANG & BERSIH */}
      <div className="text-center py-4 text-xs text-slate-400 border-t border-slate-200/60 mt-10">
        <p className="font-bold text-slate-600 tracking-wide">SMA NEGERI 3 BURU • NPSN: 60101032</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Jl. Joyoboyo No. 04 Waekerta, Kec. Waeapo, Kab. Buru, Maluku 97574</p>
      </div>
    </div>
  );
}
