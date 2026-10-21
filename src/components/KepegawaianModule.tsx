'use client';

import React, { useState } from 'react';
import { PegawaiGTK, initialPegawai, profilSekolah } from '@/data/mockData';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Printer, 
  X, 
  Clock, 
  Award, 
  UserCheck 
} from 'lucide-react';

export default function KepegawaianModule() {
  const [pegawaiList, setPegawaiList] = useState<PegawaiGTK[]>(initialPegawai);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuratTugasModal, setShowSuratTugasModal] = useState<PegawaiGTK | null>(null);

  // Form Tambah Pegawai
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nip: '',
    nuptk: '',
    statusKepegawaian: 'PNS' as 'PNS' | 'PPPK' | 'Honorer',
    pangkatGolongan: 'Penata Muda (III/a)',
    jabatan: 'Guru Mata Pelajaran',
    tmt: '01 Juli 2024',
    jadwalKgb: '01 Juli 2026',
    statusKgb: 'Aman' as 'Aman' | 'Segera KGB' | 'Jatuh Tempo'
  });

  const filteredList = pegawaiList.filter((p) => {
    const matchSearch =
      p.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nip.includes(searchTerm) ||
      p.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === 'ALL' || p.statusKepegawaian === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAddPegawai = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap) return;

    const newPegawai: PegawaiGTK = {
      id: 'p-' + Date.now(),
      ...formData
    };

    setPegawaiList([newPegawai, ...pegawaiList]);
    setShowAddModal(false);
    setFormData({
      namaLengkap: '',
      nip: '',
      nuptk: '',
      statusKepegawaian: 'PNS',
      pangkatGolongan: 'Penata Muda (III/a)',
      jabatan: 'Guru Mata Pelajaran',
      tmt: '01 Juli 2024',
      jadwalKgb: '01 Juli 2026',
      statusKgb: 'Aman'
    });
  };

  const handlePrintSuratTugas = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* TAMPILAN CETAK SURAT TUGAS RESMI (PRINT ONLY) */}
      {/* ======================================================== */}
      {showSuratTugasModal && (
        <div className="hidden print:block p-[1.5cm_2cm] bg-white text-black font-serif text-[12pt] leading-normal min-h-[297mm]">
          {/* Kop Surat */}
          <table className="w-full border-b-[3px] border-double border-black pb-2 mb-4">
            <tbody>
              <tr>
                <td className="w-[15%] text-left">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_Tut_Wuri_Handayani.png" alt="" className="max-h-[75px]" />
                </td>
                <td className="w-[70%] text-center">
                  <div className="text-[12pt]">{profilSekolah.instansiAtas1}</div>
                  <div className="text-[12pt] font-bold">{profilSekolah.instansiAtas2}</div>
                  <div className="text-[16pt] font-extrabold tracking-wide my-1">{profilSekolah.nama}</div>
                  <div className="text-[9pt] italic text-gray-800">{profilSekolah.alamat} Email: {profilSekolah.email} Kode Pos {profilSekolah.kodePos}</div>
                </td>
                <td className="w-[15%] text-right font-sans text-[8pt] text-gray-400">LOGO SMA 3</td>
              </tr>
            </tbody>
          </table>

          <div className="text-center my-6">
            <h2 className="text-[14pt] font-bold underline uppercase tracking-wider m-0">SURAT PERINTAH TUGAS</h2>
            <p className="text-[11pt] mt-1">Nomor: 090 / 084 / SMAN.3 / 2024</p>
          </div>

          <p className="text-justify mb-4">
            Kepala Sekolah Menengah Atas (SMA) Negeri 3 Buru dengan ini menugaskan kepada:
          </p>

          <table className="w-full ml-6 mb-4 text-[11.5pt]">
            <tbody>
              <tr>
                <td className="w-[30%] py-1">Nama Lengkap</td>
                <td className="w-[3%] py-1">:</td>
                <td className="w-[67%] py-1 font-bold">{showSuratTugasModal.namaLengkap}</td>
              </tr>
              <tr>
                <td className="py-1">NIP / NUPTK</td>
                <td className="py-1">:</td>
                <td className="py-1 font-mono">{showSuratTugasModal.nip}</td>
              </tr>
              <tr>
                <td className="py-1">Pangkat / Golongan</td>
                <td className="py-1">:</td>
                <td className="py-1">{showSuratTugasModal.pangkatGolongan}</td>
              </tr>
              <tr>
                <td className="py-1">Jabatan</td>
                <td className="py-1">:</td>
                <td className="py-1">{showSuratTugasModal.jabatan}</td>
              </tr>
              <tr>
                <td className="py-1">Unit Kerja</td>
                <td className="py-1">:</td>
                <td className="py-1">SMA Negeri 3 Buru</td>
              </tr>
            </tbody>
          </table>

          <p className="text-justify mb-3">
            Untuk melaksanakan tugas: <strong>Mengikuti Kegiatan Rapat Koordinasi dan Peningkatan Kompetensi Pendidik Tingkat Kabupaten Buru Tahun 2024</strong>.
          </p>
          <p className="text-justify mb-6">
            Demikian Surat Perintah Tugas ini dibuat untuk dapat dilaksanakan dengan penuh tanggung jawab dan memberikan laporan setelah tugas selesai.
          </p>

          <div className="w-1/2 ml-auto text-left mt-12 text-[11.5pt]">
            <div>Waekerta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div>Kepala Sekolah,</div>
            <div className="h-20"></div>
            <div className="font-bold underline">{profilSekolah.kepalaSekolah}</div>
            <div>NIP. {profilSekolah.nipKepalaSekolah}</div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAMPILAN WEB KEPEGAWAIAN */}
      {/* ======================================================== */}
      <div className="print:hidden space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                Data GTK Sekolah
              </span>
              <span className="text-xs text-slate-500 font-medium">Guru & Tenaga Kependidikan</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mt-1">Administrasi Kepegawaian</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan profil guru dan staf TU, pangkat/golongan, jadwal Kenaikan Gaji Berkala (KGB), dan penerbitan Surat Tugas.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pegawai / Guru</span>
          </button>
        </div>

        {/* Ringkasan Statistik Pegawai */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Total GTK</div>
              <div className="text-lg font-bold text-slate-800">{pegawaiList.length} Orang</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Guru / Staf PNS</div>
              <div className="text-lg font-bold text-emerald-600">
                {pegawaiList.filter(p => p.statusKepegawaian === 'PNS').length} Orang
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">PPPK & Honorer</div>
              <div className="text-lg font-bold text-slate-800">
                {pegawaiList.filter(p => p.statusKepegawaian !== 'PNS').length} Orang
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Jatuh Tempo KGB</div>
              <div className="text-lg font-bold text-amber-600">
                {pegawaiList.filter(p => p.statusKgb !== 'Aman').length} Orang
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Pegawai */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, NIP, atau jabatan guru..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                {(['ALL', 'PNS', 'PPPK', 'Honorer'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      filterStatus === st
                        ? 'bg-white text-blue-700 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'ALL' ? 'Semua' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Lengkap & NIP</th>
                  <th className="py-3 px-4">Jabatan</th>
                  <th className="py-3 px-4">Pangkat / Gol.</th>
                  <th className="py-3 px-4 text-center">Jadwal KGB</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((p, index) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium text-slate-400">{index + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-xs">{p.namaLengkap}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        NIP: {p.nip}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{p.jabatan}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.pangkatGolongan}</td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="font-mono text-slate-700">{p.jadwalKgb}</div>
                      {p.statusKgb !== 'Aman' && (
                        <span className={`inline-block mt-0.5 px-2 py-0.2 rounded text-[9.5pt] font-semibold ${
                          p.statusKgb === 'Jatuh Tempo' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.statusKgb}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.statusKepegawaian === 'PNS'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : p.statusKepegawaian === 'PPPK'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {p.statusKepegawaian}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setShowSuratTugasModal(p)}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-medium transition-colors"
                      >
                        Surat Tugas
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL TAMBAH PEGAWAI */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Tambah Pegawai / Guru Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPegawai} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap beserta Gelar</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Drs. H. Ahmad Kelian, M.Pd"
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIP (atau - jika belum ada)</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Kepegawaian</label>
                  <select
                    value={formData.statusKepegawaian}
                    onChange={(e) => setFormData({ ...formData, statusKepegawaian: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Honorer">Honorer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan / Tugas</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Guru Matematika"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    value={formData.pangkatGolongan}
                    onChange={(e) => setFormData({ ...formData, pangkatGolongan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">TMT Terakhir</label>
                  <input
                    type="text"
                    value={formData.tmt}
                    onChange={(e) => setFormData({ ...formData, tmt: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jadwal KGB Berikutnya</label>
                  <input
                    type="text"
                    value={formData.jadwalKgb}
                    onChange={(e) => setFormData({ ...formData, jadwalKgb: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
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
                  Simpan Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL PREVIEW SURAT TUGAS */}
      {/* ======================================================== */}
      {showSuratTugasModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="bg-slate-100 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Surat Perintah Tugas: {showSuratTugasModal.namaLengkap}</h3>
                <p className="text-xs text-slate-500">Format resmi dinas SMA Negeri 3 Buru</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintSuratTugas}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Surat Tugas</span>
                </button>
                <button
                  onClick={() => setShowSuratTugasModal(null)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
              <div className="bg-white p-[1.5cm_2cm] border border-gray-200 shadow-md w-[210mm] min-h-[297mm] font-serif text-[12pt] leading-normal text-black box-border">
                {/* Kop Surat */}
                <table className="w-full border-b-[3px] border-double border-black pb-2 mb-4">
                  <tbody>
                    <tr>
                      <td className="w-[15%] text-left">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_Tut_Wuri_Handayani.png" alt="" className="max-h-[75px]" />
                      </td>
                      <td className="w-[70%] text-center">
                        <div className="text-[12pt]">{profilSekolah.instansiAtas1}</div>
                        <div className="text-[12pt] font-bold">{profilSekolah.instansiAtas2}</div>
                        <div className="text-[16pt] font-extrabold tracking-wide my-1">{profilSekolah.nama}</div>
                        <div className="text-[9pt] italic text-gray-800">{profilSekolah.alamat} Email: {profilSekolah.email} Kode Pos {profilSekolah.kodePos}</div>
                      </td>
                      <td className="w-[15%] text-right font-sans text-[8pt] text-gray-400">LOGO SMA 3</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-center my-6">
                  <h2 className="text-[14pt] font-bold underline uppercase tracking-wider m-0">SURAT PERINTAH TUGAS</h2>
                  <p className="text-[11pt] mt-1">Nomor: 090 / 084 / SMAN.3 / 2024</p>
                </div>

                <p className="text-justify mb-4">
                  Kepala Sekolah Menengah Atas (SMA) Negeri 3 Buru dengan ini menugaskan kepada:
                </p>

                <table className="w-full ml-6 mb-4 text-[11.5pt]">
                  <tbody>
                    <tr>
                      <td className="w-[30%] py-1">Nama Lengkap</td>
                      <td className="w-[3%] py-1">:</td>
                      <td className="w-[67%] py-1 font-bold">{showSuratTugasModal.namaLengkap}</td>
                    </tr>
                    <tr>
                      <td className="py-1">NIP / NUPTK</td>
                      <td className="py-1">:</td>
                      <td className="py-1 font-mono">{showSuratTugasModal.nip}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Pangkat / Golongan</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{showSuratTugasModal.pangkatGolongan}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Jabatan</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{showSuratTugasModal.jabatan}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Unit Kerja</td>
                      <td className="py-1">:</td>
                      <td className="py-1">SMA Negeri 3 Buru</td>
                    </tr>
                  </tbody>
                </table>

                <p className="text-justify mb-3">
                  Untuk melaksanakan tugas: <strong>Mengikuti Kegiatan Rapat Koordinasi dan Peningkatan Kompetensi Pendidik Tingkat Kabupaten Buru Tahun 2024</strong>.
                </p>
                <p className="text-justify mb-6">
                  Demikian Surat Perintah Tugas ini dibuat untuk dapat dilaksanakan dengan penuh tanggung jawab dan memberikan laporan setelah tugas selesai.
                </p>

                <div className="w-1/2 ml-auto text-left mt-12 text-[11.5pt]">
                  <div>Waekerta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div>Kepala Sekolah,</div>
                  <div className="h-20"></div>
                  <div className="font-bold underline">{profilSekolah.kepalaSekolah}</div>
                  <div>NIP. {profilSekolah.nipKepalaSekolah}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
