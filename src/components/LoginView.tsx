'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';

interface LoginViewProps {
  onLoginSuccess: (user: { name: string; role: string; email?: string }) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal masuk. Periksa kembali username dan kata sandi Anda.');
      }

      if (data.token) {
        localStorage.setItem('simtu_auth_token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
      localStorage.setItem('simtu_auth_user', JSON.stringify(data.user));

      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat masuk.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a192f] to-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Box */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-6">
          
          {/* Header Brand */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-1 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo-sma3buru.png" 
                alt="Logo SMAN 3 Buru" 
                className="w-11 h-11 object-contain drop-shadow" 
              />
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 tracking-wider">
                PORTAL RESMI
              </span>
              <span className="text-xs font-semibold text-slate-400">
                SMA NEGERI 3 BURU
              </span>
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">
              SIM-TU Online
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Sistem Informasi Manajemen Layanan Terpadu Tata Usaha & Administrasi Sekolah
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Username / Email Akun
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username akun Anda"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Sistem TU</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Information Badge */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-[11px] text-slate-400 leading-tight">
                <strong className="text-slate-300">Akses Terproteksi:</strong> Dilengkapi enkripsi SHA-512, sesi acak aman, dan sistem anti brute-force 5 percobaan.
              </p>
            </div>
          </div>

          {/* Back to School Website Link */}
          <div className="text-center pt-1">
            <a
              href="https://smanegeri3buru.my.id"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Utama SMA 3 Buru</span>
            </a>
          </div>

        </div>

        {/* Footer Credit */}
        <p className="text-center text-[11px] text-slate-500 mt-4">
          &copy; {new Date().getFullYear()} Tata Usaha SMA Negeri 3 Buru. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  );
}
