'use client';

import React, { useState } from 'react';
import { SiswaBukuInduk, initialBukuInduk } from '@/data/mockData';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  FileText, 
  X, 
  ArrowRightLeft, 
  Eye, 
  UserCheck, 
  Phone, 
  MapPin, 
  Calendar 
} from 'lucide-react';

interface KesiswaanModuleProps {
  onCetakSuratAktif?: (siswa: SiswaBukuInduk) => void;
}

export default function KesiswaanModule({ onCetakSuratAktif }: KesiswaanModuleProps) {
  const [siswaList, setSiswaList] = useState<SiswaBukuInduk[]>(initialBukuInduk);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTingkat, setSelectedTingkat] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSiswaDetail, setSelectedSiswaDetail] = useState<SiswaBukuInduk | null>(null);

  // Form Tambah Siswa
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nis: '',
    nisn: '',
    jenisKelamin: 'L' as 'L' | 'P',
    kelas: 'X-1',
    jurusan: 'MIPA' as 'MIPA' | 'IPS',
    tempatLahir: 'Waekerta',
    tanggalLahir: '01 Januari 2008',
    namaOrangTua: '',
    nomorHpWali: '',
    alamat: 'Kec. Waeapo, Kab. Buru',
    status: 'Aktif' as 'Aktif' | 'Mutasi Keluar'
  });

  const filteredList = siswaList.filter((s) => {
    const matchSearch =
      s.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm) ||
      s.nis.includes(searchTerm);
    const matchTingkat =
      selectedTingkat === 'ALL' || s.kelas.startsWith(selectedTingkat);
    const matchStatus =
      selectedStatus === 'ALL' || s.status === selectedStatus;
    return matchSearch && matchTingkat && matchStatus;
  });

  const handleAddSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap || !formData.nisn) return;

    const newSiswa: SiswaBukuInduk = {
      id: 's-' + Date.now(),
      ...formData
    };

    setSiswaList([newSiswa, ...siswaList]);
    setShowAddModal(false);
    setFormData({
      namaLengkap: '',
      nis: '',
      nisn: '',
      jenisKelamin: 'L',
      kelas: 'X-1',
      jurusan: 'MIPA',
      tempatLahir: 'Waekerta',
      tanggalLahir: '01 Januari 2008',
      namaOrangTua: '',
      nomorHpWali: '',
      alamat: 'Kec. Waeapo, Kab. Buru',
      status: 'Aktif'
    });
  };

  const handleMutasi = (id: string) => {
    const sekolahTujuan = prompt('Masukkan nama sekolah tujuan mutasi (contoh: SMA Negeri 1 Buru):');
    if (sekolahTujuan) {
      setSiswaList(siswaList.map(s => 
        s.id === id ? { ...s, status: 'Mutasi Keluar' } : s
      ));
      alert(`Status siswa berhasil diubah menjadi Mutasi Keluar ke: ${sekolahTujuan}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Modul Kesiswaan */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              Buku Induk Siswa Digital
            </span>
            <span className="text-xs text-slate-500 font-medium">Data Kependidikan & Mutasi</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-1">Administrasi Kesiswaan SMA Negeri 3 Buru</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan profil biodata lengkap siswa, NISN, mutasi masuk/keluar, dan layanan cetak surat keterangan siswa aktif.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {/* Ringkasan Statistik Siswa */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Siswa Aktif</div>
            <div className="text-lg font-bold text-slate-800">
              {siswaList.filter(s => s.status === 'Aktif').length} Siswa
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Kelas XII (Calon Lulus)</div>
            <div className="text-lg font-bold text-slate-800">
              {siswaList.filter(s => s.kelas.startsWith('XII')).length} Siswa
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Kelas XI</div>
            <div className="text-lg font-bold text-slate-800">
              {siswaList.filter(s => s.kelas.startsWith('XI')).length} Siswa
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Mutasi Keluar</div>
            <div className="text-lg font-bold text-amber-600">
              {siswaList.filter(s => s.status === 'Mutasi Keluar').length} Siswa
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Tabel Buku Induk */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, NISN, atau NIS..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* Filter Tingkat */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
              {(['ALL', 'X', 'XI', 'XII'] as const).map((tingkat) => (
                <button
                  key={tingkat}
                  onClick={() => setSelectedTingkat(tingkat)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    selectedTingkat === tingkat
                      ? 'bg-white text-blue-700 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tingkat === 'ALL' ? 'Semua Kelas' : `Kelas ${tingkat}`}
                </button>
              ))}
            </div>

            {/* Filter Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Mutasi Keluar">Mutasi Keluar</option>
            </select>
          </div>
        </div>

        {/* Tabel Siswa */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Lengkap & NISN</th>
                <th className="py-3 px-4">L/P</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Nama Orang Tua</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((siswa, index) => (
                <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-center font-medium text-slate-400">{index + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800 text-xs">{siswa.namaLengkap}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      NISN: {siswa.nisn} | NIS: {siswa.nis}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      siswa.jenisKelamin === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{siswa.kelas}</td>
                  <td className="py-3.5 px-4 text-slate-600">{siswa.namaOrangTua}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      siswa.status === 'Aktif'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {siswa.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedSiswaDetail(siswa)}
                        className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-medium transition-colors"
                        title="Lihat Detail Buku Induk"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMutasi(siswa.id)}
                        className="px-2.5 py-1.5 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-lg font-medium transition-colors"
                        title="Catat Mutasi Pindah"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL TAMBAH SISWA BARU */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Tambah Siswa ke Buku Induk</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSiswa} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  placeholder="Nama sesuai ijazah SMP..."
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NISN (10 Digit)</label>
                  <input
                    type="text"
                    required
                    placeholder="006xxxxxxx"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIS Sekolah</label>
                  <input
                    type="text"
                    required
                    placeholder="2324xxxx"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="X-1">X-1 (Fase E)</option>
                    <option value="X-2">X-2 (Fase E)</option>
                    <option value="XI MIPA 1">XI MIPA 1</option>
                    <option value="XI IPS 1">XI IPS 1</option>
                    <option value="XII MIPA 1">XII MIPA 1</option>
                    <option value="XII IPS 1">XII IPS 1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="text"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                <input
                  type="text"
                  required
                  placeholder="Nama ayah / ibu / wali"
                  value={formData.namaOrangTua}
                  onChange={(e) => setFormData({ ...formData, namaOrangTua: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Domisili</label>
                <input
                  type="text"
                  placeholder="Alamat tempat tinggal di Buru"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DETAIL BUKU INDUK SISWA */}
      {/* ======================================================== */}
      {selectedSiswaDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-base">{selectedSiswaDetail.namaLengkap}</h3>
                <p className="text-xs text-slate-500 font-mono">NISN: {selectedSiswaDetail.nisn}</p>
              </div>
              <button onClick={() => setSelectedSiswaDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Nomor Induk Siswa (NIS)</span>
                <span className="font-semibold font-mono">{selectedSiswaDetail.nis}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Kelas / Peminatan</span>
                <span className="font-semibold">{selectedSiswaDetail.kelas} ({selectedSiswaDetail.jurusan})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Tempat, Tanggal Lahir</span>
                <span className="font-medium">{selectedSiswaDetail.tempatLahir}, {selectedSiswaDetail.tanggalLahir}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Nama Orang Tua / Wali</span>
                <span className="font-semibold">{selectedSiswaDetail.namaOrangTua}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">No. HP Orang Tua</span>
                <span className="font-medium">{selectedSiswaDetail.nomorHpWali}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Alamat</span>
                <span className="font-medium text-right max-w-[200px]">{selectedSiswaDetail.alamat}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status Kesiswaan</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedSiswaDetail.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedSiswaDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
