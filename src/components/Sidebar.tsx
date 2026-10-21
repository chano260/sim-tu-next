'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Mail, 
  Briefcase, 
  Settings,
  School
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const mainModules = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'persuratan', label: 'Persuratan (TU)', icon: Mail },
    { id: 'skl', label: 'SKL & Transkrip', icon: GraduationCap },
  ];

  const adminModules = [
    { id: 'kesiswaan', label: 'Buku Induk Siswa', icon: Users },
    { id: 'kepegawaian', label: 'Data Kepegawaian GTK', icon: Briefcase },
    { id: 'sarpras', label: 'Sarana & Prasarana', icon: School },
    { id: 'pengaturan', label: 'Pengaturan Sistem', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 min-h-screen flex flex-col justify-between shrink-0 print:hidden border-r border-slate-800/80">
      <div className="flex flex-col flex-1">
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3.5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-tight">SIM-TU</h1>
            <p className="text-xs text-blue-400 font-medium">SMA Negeri 3 Buru</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3.5 flex-1 overflow-y-auto space-y-5">
          {/* Kelompok Layanan Utama */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Layanan Utama
            </div>
            <nav className="space-y-1">
              {mainModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate text-left">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Kelompok Administrasi Sekolah */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Administrasi Sekolah
            </div>
            <nav className="space-y-1">
              {adminModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate text-left">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Profil User Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/40 m-3 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-white border border-slate-700 flex items-center justify-center font-bold text-xs shadow-inner">
            TU
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-white truncate">Tata Usaha</div>
            <div className="text-xs text-slate-400 truncate">tatausaha@sman3buru.sch.id</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
