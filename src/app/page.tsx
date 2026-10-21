'use client';
import axios from 'axios';

import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import Header from '@/components/Header';
import LoginView from '@/components/LoginView';
import DashboardOverview from '@/components/DashboardOverview';
import SklModule from '@/components/SklModule';
import PersuratanModule from '@/components/PersuratanModule';
import KesiswaanModule from '@/components/KesiswaanModule';
import KepegawaianModule from '@/components/KepegawaianModule';
import SarprasModule from '@/components/SarprasModule';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; email?: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  
  const [logoKiriUrl, setLogoKiriUrl] = useState<string | null>(null);
  const [logoKananUrl, setLogoKananUrl] = useState<string | null>(null);
  const [logoKiriSize, setLogoKiriSize] = useState<number>(82);
  const [npsn, setNpsn] = useState<string>('60201948');
  const [akreditasi, setAkreditasi] = useState<string>('A (Unggul)');
  const [logoKananSize, setLogoKananSize] = useState<number>(82);

  // Load auth state and logos from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('simtu_auth_user');
      const savedToken = localStorage.getItem('simtu_auth_token');
      if (savedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      }
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        // Verify session status with backend
        fetch('/api/auth/me', {
          headers: savedToken ? { 'Authorization': `Bearer ${savedToken}` } : {}
        })
        .then(res => {
          if (!res.ok) {
            // Invalid / expired session
            localStorage.removeItem('simtu_auth_user');
            localStorage.removeItem('simtu_auth_token');
            delete axios.defaults.headers.common['Authorization'];
            setCurrentUser(null);
          }
        })
        .catch(() => {});
      }
    } catch (e) {}
    setIsAuthLoading(false);
    const savedLogoKiriUrl = localStorage.getItem('logoKiriUrl');
    const savedLogoKananUrl = localStorage.getItem('logoKananUrl');
    const savedLogoKiriSize = localStorage.getItem('logoKiriSize');
    const savedLogoKananSize = localStorage.getItem('logoKananSize');

    if (savedLogoKiriUrl) setLogoKiriUrl(savedLogoKiriUrl);
    if (savedLogoKananUrl) setLogoKananUrl(savedLogoKananUrl);
    if (savedLogoKiriSize) setLogoKiriSize(parseInt(savedLogoKiriSize, 10));
    if (savedLogoKananSize) setLogoKananSize(parseInt(savedLogoKananSize, 10));
    const savedNpsn = localStorage.getItem('school_npsn');
    const savedAkreditasi = localStorage.getItem('school_akreditasi');
    if (savedNpsn) setNpsn(savedNpsn);
    if (savedAkreditasi) setAkreditasi(savedAkreditasi);
  }, []);

  // Save sizes to localStorage
  useEffect(() => {
    localStorage.setItem('logoKiriSize', logoKiriSize.toString());
  }, [logoKiriSize]);

  useEffect(() => {
    localStorage.setItem('logoKananSize', logoKananSize.toString());
  }, [logoKananSize]);

  const handleLogout = async () => {
    try {
      const savedToken = localStorage.getItem('simtu_auth_token');
      await fetch('/api/logout', { 
        method: 'POST',
        headers: savedToken ? { 'Authorization': `Bearer ${savedToken}` } : {}
      });
    } catch (e) {}
    localStorage.removeItem('simtu_auth_user');
    localStorage.removeItem('simtu_auth_token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, setLogo: (url: string) => void, storageKey: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogo(base64String);
        localStorage.setItem(storageKey, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Memuat SIM-TU SMA Negeri 3 Buru...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen ambient-canvas font-sans text-slate-800 antialiased flex flex-col relative print:block print:min-h-0 print:bg-white">
      {/* Header Universal (Menggantikan Sidebar) */}
      <Header
        activeTab={activeTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={setActiveTab}
        title={
          activeTab === 'dashboard' ? 'Lobi Utama SIM-TU' :
          activeTab === 'skl' ? 'Ruang Kelulusan: SKL & Transkrip Nilai' :
          activeTab === 'kesiswaan' ? 'Ruang Buku Induk & Kesiswaan' :
          activeTab === 'persuratan' ? 'Ruang Persuratan & Disposisi TU' :
          activeTab === 'kepegawaian' ? 'Ruang Kepegawaian GTK' :
          activeTab === 'sarpras' ? 'Ruang Sarana & Prasarana (KIR)' :
          'Ruang Pengaturan Identitas & Logo'
        }
        subtitle={
          activeTab === 'dashboard' ? 'Direktori Ruangan Layanan Tata Usaha SMA Negeri 3 Buru' :
          activeTab === 'skl' ? 'Penerbitan Surat Keterangan Lulus dan Transkrip Nilai Sementara' :
          activeTab === 'kesiswaan' ? 'Pencatatan data siswa aktif, mutasi masuk/keluar, dan arsip NISN' :
          activeTab === 'persuratan' ? 'Satu pintu pengelolaan surat masuk, generator surat keluar dinas, disposisi, dan arsip digital' :
          activeTab === 'kepegawaian' ? 'Database guru & pegawai, pangkat/golongan, jadwal KGB, dan surat tugas' :
          activeTab === 'sarpras' ? 'Pendataan inventaris ruangan, aset sekolah, dan peminjaman fasilitas' :
          'Konfigurasi identitas sekolah, kop surat, dan penanggung jawab'
        }
      />

      {/* Konten Ruangan Utama */}
      <div className="flex-1 flex flex-col min-w-0 print:block print:w-full print:m-0 print:p-0">

        {/* Dynamic Body Content */}
        <main className="p-6 md:p-8 flex-1 print:p-0 print:m-0 print:block print:w-full">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              onGoToSkl={() => setActiveTab('skl')} 
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {/* TAB 2: SKL & TRANSKRIP NILAI */}
          {activeTab === 'skl' && (
            <SklModule 
              logoKiriUrl={logoKiriUrl} 
              logoKananUrl={logoKananUrl} 
              logoKiriSize={logoKiriSize}
              logoKananSize={logoKananSize}
            />
          )}

          {/* TAB 3: KESISWAAN (BUKU INDUK SISWA) */}
          {activeTab === 'kesiswaan' && (
            <KesiswaanModule />
          )}

          {/* TAB 4: PERSURATAN (TERPADU DENGAN DASBOR TU ARKAS) */}
          {(activeTab === 'persuratan' || activeTab === 'arkas-portal-tu' || activeTab === 'arkas-surat-masuk' || activeTab === 'arkas-surat-keluar') && (
            <PersuratanModule 
              initialSubView={
                activeTab === 'arkas-surat-masuk' ? 'SURAT_MASUK' :
                activeTab === 'arkas-surat-keluar' ? 'SURAT_KELUAR' :
                'DASHBOARD'
              }
              logoKiriUrl={logoKiriUrl} 
              logoKananUrl={logoKananUrl} 
              logoKiriSize={logoKiriSize}
              logoKananSize={logoKananSize}
            />
          )}

          {/* TAB 5: KEPEGAWAIAN (GTK) */}
          {activeTab === 'kepegawaian' && (
            <KepegawaianModule />
          )}

          {/* TAB 6: SARANA & PRASARANA (KIR) */}
          {activeTab === 'sarpras' && (
            <SarprasModule />
          )}



          {/* TAB 7: PENGATURAN */}
          {activeTab === 'pengaturan' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition-all"
                >
                  <span>← Kembali ke Lobi Utama</span>
                </button>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
                  RUANG 06 • PENGATURAN
                </span>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-5">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-lg">Pengaturan Identitas Satuan Pendidikan</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Konfigurasi kop surat dinas dan penanggung jawab sekolah.</p>
                </div>
              
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
                  <input type="text" readOnly value="SMA NEGERI 3 BURU" className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NPSN Sekolah (Dapat Diedit)</label>
                    <input 
                      type="text" 
                      value={npsn} 
                      onChange={(e) => {
                        setNpsn(e.target.value);
                        localStorage.setItem('school_npsn', e.target.value);
                      }} 
                      placeholder="60201948"
                      className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Akreditasi Sekolah (Dapat Diedit)</label>
                    <input 
                      type="text" 
                      value={akreditasi} 
                      onChange={(e) => {
                        setAkreditasi(e.target.value);
                        localStorage.setItem('school_akreditasi', e.target.value);
                      }} 
                      placeholder="A (Unggul)"
                      className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Resmi</label>
                  <input type="text" readOnly value="Jl. Joyoboyo No. 04 Waekerta, Kec. Waeapo, Kab. Buru" className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
                    <input type="text" readOnly value="smanegeri3buru@gmail.com" className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kode Pos</label>
                    <input type="text" readOnly value="97574" className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kepala Sekolah</label>
                  <input type="text" readOnly value="ANTON LA HARI, S.Pd., M.Pd. (NIP. 19780703 200312 1 005)" className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-semibold" />
                </div>
                
                <div className="pt-4 border-t border-slate-200 mt-4 space-y-3">
                  <h4 className="font-bold text-slate-800">Pengaturan Logo Dokumen</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Upload & Ukuran Logo Kiri */}
                    <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 bg-slate-50">
                      <span className="font-semibold text-slate-700 text-center">Logo Kiri (Provinsi Maluku)</span>
                      
                      <div className="flex justify-center h-24 items-center">
                        <img 
                          src={logoKiriUrl || '/logo-maluku.png'} 
                          alt="Logo Kiri" 
                          style={{ height: `${logoKiriSize}px`, maxHeight: '90px' }} 
                          className="object-contain" 
                        />
                      </div>

                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                          <Upload className="w-4 h-4 text-blue-600" />
                          <span>Ganti File</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, setLogoKiriUrl, 'logoKiriUrl')} />
                        </label>
                        {logoKiriUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setLogoKiriUrl(null);
                              localStorage.removeItem('logoKiriUrl');
                            }}
                            className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg text-xs font-semibold transition-colors"
                            title="Reset ke Logo Asli"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                          <span>Ukuran</span>
                          <span>{logoKiriSize}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="40" 
                          max="150" 
                          value={logoKiriSize} 
                          onChange={(e) => setLogoKiriSize(Number(e.target.value))} 
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>

                    {/* Upload & Ukuran Logo Kanan */}
                    <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 bg-slate-50">
                      <span className="font-semibold text-slate-700 text-center">Logo Kanan (SMA Negeri 3 Buru)</span>
                      
                      <div className="flex justify-center h-24 items-center">
                        <img 
                          src={logoKananUrl || '/logo-sma3buru.png'} 
                          alt="Logo Kanan" 
                          style={{ height: `${logoKananSize}px`, maxHeight: '90px' }} 
                          className="object-contain" 
                        />
                      </div>

                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                          <Upload className="w-4 h-4 text-blue-600" />
                          <span>Ganti File</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, setLogoKananUrl, 'logoKananUrl')} />
                        </label>
                        {logoKananUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setLogoKananUrl(null);
                              localStorage.removeItem('logoKananUrl');
                            }}
                            className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg text-xs font-semibold transition-colors"
                            title="Reset ke Logo Asli"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                          <span>Ukuran</span>
                          <span>{logoKananSize}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="40" 
                          max="150" 
                          value={logoKananSize} 
                          onChange={(e) => setLogoKananSize(Number(e.target.value))} 
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
