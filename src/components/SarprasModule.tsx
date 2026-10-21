'use client';

import React, { useState } from 'react';
import { InventarisBarang, PeminjamanBarang, initialInventaris, initialPeminjaman } from '@/data/mockData';
import { 
  Boxes, 
  Search, 
  Plus, 
  Printer, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  RotateCcw 
} from 'lucide-react';

export default function SarprasModule() {
  const [inventarisList, setInventarisList] = useState<InventarisBarang[]>(initialInventaris);
  const [peminjamanList, setPeminjamanList] = useState<PeminjamanBarang[]>(initialPeminjaman);
  const [activeSubTab, setActiveSubTab] = useState<'KIR' | 'PINJAM'>('KIR');
  const [selectedRuangan, setSelectedRuangan] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddInvModal, setShowAddInvModal] = useState(false);
  const [showAddPinjamModal, setShowAddPinjamModal] = useState(false);

  // Form Tambah Inventaris
  const [invForm, setInvForm] = useState({
    kodeBarang: '',
    namaBarang: '',
    ruangan: 'Laboratorium Komputer',
    jumlah: 1,
    satuan: 'Unit',
    kondisi: 'Baik' as 'Baik' | 'Rusak Ringan' | 'Rusak Berat',
    sumberPengadaan: 'Sekolah',
    tahun: '2024'
  });

  // Form Peminjaman
  const [pinjamForm, setPinjamForm] = useState({
    namaBarang: 'LCD Proyektor InFocus Epson EB-X500',
    peminjam: '',
    tanggalPinjam: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ', 08:00',
    tanggalKembali: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ', 14:00',
    keperluan: ''
  });

  const filteredInventaris = inventarisList.filter((item) => {
    const matchSearch =
      item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRuangan = selectedRuangan === 'ALL' || item.ruangan === selectedRuangan;
    return matchSearch && matchRuangan;
  });

  const handleAddInventaris = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invForm.namaBarang) return;

    const newItem: InventarisBarang = {
      id: 'inv-' + Date.now(),
      ...invForm,
      kodeBarang: invForm.kodeBarang || 'KIR-' + Math.floor(Math.random() * 900 + 100),
    };

    setInventarisList([newItem, ...inventarisList]);
    setShowAddInvModal(false);
    setInvForm({
      kodeBarang: '',
      namaBarang: '',
      ruangan: 'Laboratorium Komputer',
      jumlah: 1,
      satuan: 'Unit',
      kondisi: 'Baik',
      sumberPengadaan: 'Sekolah',
      tahun: '2024'
    });
  };

  const handleAddPinjam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinjamForm.peminjam) return;

    const newPinjam: PeminjamanBarang = {
      id: 'pinjam-' + Date.now(),
      status: 'Dipinjam',
      ...pinjamForm
    };

    setPeminjamanList([newPinjam, ...peminjamanList]);
    setShowAddPinjamModal(false);
    setPinjamForm({
      namaBarang: 'LCD Proyektor InFocus Epson EB-X500',
      peminjam: '',
      tanggalPinjam: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ', 08:00',
      tanggalKembali: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ', 14:00',
      keperluan: ''
    });
  };

  const handleKembalikan = (id: string) => {
    setPeminjamanList(peminjamanList.map(p =>
      p.id === id ? { ...p, status: 'Dikembalikan' } : p
    ));
  };

  return (
    <div className="space-y-6">
      {/* Banner Modul Sarpras */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              Sarana & Prasarana
            </span>
            <span className="text-xs text-slate-500 font-medium">Aset Sekolah & KIR</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-1">Kartu Inventaris Ruangan (KIR)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pendataan inventaris sarana per laboratorium, ruang kelas, kondisi fisik barang, dan sirkulasi peminjaman alat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'KIR' ? (
            <button
              onClick={() => setShowAddInvModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Barang / Aset</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddPinjamModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Peminjaman Alat</span>
            </button>
          )}
        </div>
      </div>

      {/* Switcher Tab KIR vs Peminjaman */}
      <div className="flex items-center gap-2 bg-slate-200/70 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab('KIR')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'KIR' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kartu Inventaris Ruangan (KIR)
        </button>
        <button
          onClick={() => setActiveSubTab('PINJAM')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'PINJAM' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sirkulasi Peminjaman Alat ({peminjamanList.filter(p => p.status === 'Dipinjam').length} Sedang Dipinjam)
        </button>
      </div>

      {/* ======================================================== */}
      {/* KONTEN TAB 1: KARTU INVENTARIS RUANGAN */}
      {/* ======================================================== */}
      {activeSubTab === 'KIR' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama barang atau kode inventaris..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Ruangan:</span>
                <select
                  value={selectedRuangan}
                  onChange={(e) => setSelectedRuangan(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
                >
                  <option value="ALL">Semua Ruangan</option>
                  <option value="Laboratorium Komputer">Laboratorium Komputer</option>
                  <option value="Laboratorium IPA">Laboratorium IPA</option>
                  <option value="Ruang Tata Usaha">Ruang Tata Usaha</option>
                  <option value="Ruang Kelas XII MIPA 1">Ruang Kelas XII MIPA 1</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Kode & Nama Barang</th>
                    <th className="py-3 px-4">Ruangan Penempatan</th>
                    <th className="py-3 px-4 text-center">Jumlah</th>
                    <th className="py-3 px-4 text-center">Kondisi</th>
                    <th className="py-3 px-4">Sumber & Tahun</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventaris.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-medium text-slate-400">{index + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 text-xs">{item.namaBarang}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.kodeBarang}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{item.ruangan}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {item.jumlah} {item.satuan}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.kondisi === 'Baik'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {item.kondisi}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.sumberPengadaan} ({item.tahun})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* KONTEN TAB 2: SIRKULASI PEMINJAMAN ALAT */}
      {/* ======================================================== */}
      {activeSubTab === 'PINJAM' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm">Daftar Peminjaman Fasilitas & Alat Sekolah</h3>
            <p className="text-xs text-slate-500">Pencatatan peminjaman alat proyektor, kabel rol, dan sarana presentasi oleh guru</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Barang</th>
                  <th className="py-3 px-4">Nama Peminjam</th>
                  <th className="py-3 px-4">Tanggal Pinjam</th>
                  <th className="py-3 px-4">Keperluan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {peminjamanList.map((p, index) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium text-slate-400">{index + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{p.namaBarang}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{p.peminjam}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.tanggalPinjam}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">{p.keperluan}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.status === 'Dipinjam'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.status === 'Dipinjam' ? (
                        <button
                          onClick={() => handleKembalikan(p.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-[11px] transition-colors"
                        >
                          Tandai Kembali
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Sudah Selesai</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL TAMBAH INVENTARIS */}
      {/* ======================================================== */}
      {showAddInvModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Tambah Barang ke KIR</h3>
              <button onClick={() => setShowAddInvModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInventaris} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Barang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: LCD Proyektor Epson..."
                  value={invForm.namaBarang}
                  onChange={(e) => setInvForm({ ...invForm, namaBarang: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ruangan</label>
                  <select
                    value={invForm.ruangan}
                    onChange={(e) => setInvForm({ ...invForm, ruangan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Laboratorium Komputer">Laboratorium Komputer</option>
                    <option value="Laboratorium IPA">Laboratorium IPA</option>
                    <option value="Ruang Tata Usaha">Ruang Tata Usaha</option>
                    <option value="Ruang Kelas XII MIPA 1">Ruang Kelas XII MIPA 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah</label>
                  <input
                    type="number"
                    min={1}
                    value={invForm.jumlah}
                    onChange={(e) => setInvForm({ ...invForm, jumlah: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Satuan</label>
                  <input
                    type="text"
                    value={invForm.satuan}
                    onChange={(e) => setInvForm({ ...invForm, satuan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kondisi</label>
                  <select
                    value={invForm.kondisi}
                    onChange={(e) => setInvForm({ ...invForm, kondisi: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sumber Pengadaan</label>
                <input
                  type="text"
                  value={invForm.sumberPengadaan}
                  onChange={(e) => setInvForm({ ...invForm, sumberPengadaan: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddInvModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL PINJAM ALAT */}
      {/* ======================================================== */}
      {showAddPinjamModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Catat Peminjaman Alat</h3>
              <button onClick={() => setShowAddPinjamModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPinjam} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Barang yang Dipinjam</label>
                <select
                  value={pinjamForm.namaBarang}
                  onChange={(e) => setPinjamForm({ ...pinjamForm, namaBarang: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="LCD Proyektor InFocus Epson EB-X500">LCD Proyektor InFocus Epson EB-X500</option>
                  <option value="Kabel Rol Panjang 25 Meter">Kabel Rol Panjang 25 Meter</option>
                  <option value="Speaker Portable Wireless">Speaker Portable Wireless</option>
                  <option value="Laptop Operasional Sekolah">Laptop Operasional Sekolah</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Peminjam (Guru / Staf / Siswa)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hendra Prasetya, S.Pd"
                  value={pinjamForm.peminjam}
                  onChange={(e) => setPinjamForm({ ...pinjamForm, peminjam: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Keperluan Peminjaman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mengajar presentasi di kelas X-1"
                  value={pinjamForm.keperluan}
                  onChange={(e) => setPinjamForm({ ...pinjamForm, keperluan: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPinjamModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Catat Peminjaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
