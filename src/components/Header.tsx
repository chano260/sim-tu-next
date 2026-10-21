'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  ChevronRight, 
  Calendar, 
  Settings,
  Mail,
  GraduationCap,
  Users,
  Briefcase,
  School,
  ChevronDown,
  LayoutGrid,
  LogOut,
  Key,
  ShieldCheck,
  AlertCircle,
  X,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  title?: string;
  subtitle?: string;
  currentUser?: { name: string; role: string; email?: string } | null;
  onLogout?: () => void;
}

export const ROOMS = [
  { id: 'dashboard', label: 'Lobi Utama', code: 'LOBI', icon: Home, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'persuratan', label: 'Ruang Persuratan & Disposisi TU', code: 'RUANG 01', icon: Mail, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'skl', label: 'Ruang Kelulusan: SKL & Transkrip', code: 'RUANG 02', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { id: 'kesiswaan', label: 'Ruang Buku Induk Kesiswaan', code: 'RUANG 03', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'kepegawaian', label: 'Ruang Kepegawaian GTK', code: 'RUANG 04', icon: Briefcase, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'sarpras', label: 'Ruang Sarana & Prasarana (KIR)', code: 'RUANG 05', icon: School, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { id: 'pengaturan', label: 'Pengaturan Identitas & Logo', code: 'RUANG 06', icon: Settings, color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

export default function Header({ activeTab, onNavigate, title, subtitle, currentUser, onLogout }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  // State Ubah Sandi
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentRoom = ROOMS.find(r => r.id === activeTab) || ROOMS[0];
  const CurrentIcon = currentRoom.icon;

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak sama.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    setPasswordLoading(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('simtu_auth_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengubah kata sandi.');
      }

      setPasswordMsg('Kata sandi berhasil diperbarui dengan aman!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordMsg('');
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <header className="h-16 md:h-18 bg-white border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between shrink-0 print:hidden sticky top-0 z-40 shadow-xs">
        {/* 1. BRANDING KIRI (LOGO SEKOLAH & TITLE) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 text-left group transition-transform active:scale-95"
            title="Klik untuk kembali ke Lobi Utama"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo-sma3buru.png" 
              alt="Logo SMA Negeri 3 Buru" 
              className="w-9 h-9 object-contain drop-shadow-xs group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  SIM-TU
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 tracking-wider">
                  SMA 3 BURU
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5 hidden sm:block">
                Sistem Informasi Manajemen Tata Usaha
              </p>
            </div>
          </button>
        </div>

        {/* 2. AREA NAVIGASI / BREADCRUMB / KEMBALI KE LOBI */}
        <div className="flex items-center gap-2.5 mx-2">
          {activeTab !== 'dashboard' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-200/80 transition-all shadow-xs"
              >
                <Home className="w-3.5 h-3.5 text-blue-600" />
                <span>← Lobi Utama</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                <CurrentIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentRoom.label}</span>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-100 text-xs font-semibold text-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Lobi Utama • Direktori Layanan Tata Usaha</span>
            </div>
          )}
        </div>

        {/* 3. MENU KANAN: PILIH RUANGAN (DROPDOWN), TANGGAL, & STATUS */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Dropdown Menu Pilih Ruangan Cepat */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-xs"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Pindah Ruangan</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Direktori Ruangan Layanan
                </div>
                <div className="space-y-0.5 px-1.5">
                  {ROOMS.map((room) => {
                    const Icon = room.icon;
                    const isSelected = activeTab === room.id;
                    return (
                      <button
                        key={room.id}
                        onClick={() => {
                          onNavigate(room.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                        <div className="truncate">
                          <div>{room.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tanggal Aktif */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentDate}</span>
          </div>

          {/* Status Indikator & Action Buttons */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser?.role === 'admin' ? 'ADM' : 'TU'}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser?.name || 'Staf TU'}</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Sesi Terproteksi
              </div>
            </div>

            {/* Tombol Ubah Kata Sandi */}
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-colors shadow-xs ml-1 cursor-pointer"
              title="Ganti kata sandi akun Anda"
            >
              <Key className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Ubah Sandi</span>
            </button>

            {/* Tombol Logout */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition-colors shadow-xs ml-1 cursor-pointer"
                title="Keluar dari sesi SIM-TU"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MODAL UBAH KATA SANDI */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">Ubah Kata Sandi</h3>
                  <p className="text-xs text-slate-500">Perbarui kata sandi akun SIM-TU Anda</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError('');
                  setPasswordMsg('');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pesan Berhasil */}
            {passwordMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passwordMsg}</span>
              </div>
            )}

            {/* Pesan Gagal */}
            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kata sandi dienkripsi menggunakan standar PBKDF2 SHA-512 dengan salt acak unik.</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {passwordLoading ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
