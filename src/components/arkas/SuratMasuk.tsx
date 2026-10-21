"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  Inbox, 
  Plus, 
  Search, 
  Trash2, 
  FileText, 
  ArrowLeft, 
  X, 
  Calendar, 
  Building2, 
  UploadCloud,
  FileCheck,
  Eye
} from "lucide-react";

interface SuratMasukItem {
  id: string;
  no_surat: string;
  tgl_surat: string;
  tgl_diterima: string;
  pengirim: string;
  perihal: string;
  file_surat?: string | null;
}

interface SuratMasukProps {
  onBack?: () => void;
}

export default function SuratMasuk({ onBack }: SuratMasukProps) {
  const [suratList, setSuratList] = useState<SuratMasukItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State untuk form input
  const [formData, setFormData] = useState({
    no_surat: "",
    tgl_surat: "",
    tgl_diterima: new Date().toISOString().split("T")[0],
    pengirim: "",
    perihal: "",
    file_surat: null as File | null,
  });

  // Mengambil data dari API
  const fetchSurat = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/surat-masuk");
      setSuratList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Gagal mengambil data surat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSurat();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file_surat: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("no_surat", formData.no_surat);
    data.append("tgl_surat", formData.tgl_surat);
    data.append("tgl_diterima", formData.tgl_diterima);
    data.append("pengirim", formData.pengirim);
    data.append("perihal", formData.perihal);
    if (formData.file_surat) {
      data.append("file_surat", formData.file_surat);
    }

    try {
      await axios.post("/api/surat-masuk", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Surat Masuk berhasil diarsipkan.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
      setShowModal(false);
      fetchSurat();
      setFormData({
        no_surat: "",
        tgl_surat: "",
        tgl_diterima: new Date().toISOString().split("T")[0],
        pengirim: "",
        perihal: "",
        file_surat: null,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan surat masuk.",
        icon: "error",
      });
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Hapus Surat Masuk?",
      text: "Data dan berkas surat akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/surat-masuk/${id}`);
        Swal.fire({
          title: "Terhapus!",
          text: "Data surat masuk telah dihapus.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchSurat();
      } catch (error) {
        Swal.fire("Error!", "Gagal menghapus data.", "error");
      }
    }
  };

  const filteredSurat = suratList.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      (s.no_surat && s.no_surat.toLowerCase().includes(term)) ||
      (s.pengirim && s.pengirim.toLowerCase().includes(term)) ||
      (s.perihal && s.perihal.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-5">
      {/* Top Bar Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all border border-slate-200/80 shadow-xs"
              title="Kembali ke Dasbor TU"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Arsip Surat Masuk
            </h2>
            <p className="text-xs text-slate-500">
              Pencatatan surat masuk, disposisi, dan arsip berkas digital SMA Negeri 3 Buru
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari no surat / pengirim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm shadow-emerald-600/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Surat Masuk</span>
          </button>
        </div>
      </div>

      {/* Tabel Data Surat Masuk */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nomor & Tanggal Surat</th>
                <th className="py-3.5 px-4">Pengirim / Instansi</th>
                <th className="py-3.5 px-4">Perihal Surat</th>
                <th className="py-3.5 px-4">Tgl Diterima TU</th>
                <th className="py-3.5 px-4 text-center">Berkas</th>
                <th className="py-3.5 px-4 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Memuat data surat masuk...
                  </td>
                </tr>
              ) : filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">
                        {searchTerm ? "Tidak ada surat yang sesuai pencarian" : "Belum ada data surat masuk"}
                      </p>
                      <p className="text-xs text-slate-400">
                        Klik tombol &ldquo;Tambah Surat Masuk&rdquo; untuk mengarsipkan surat baru.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSurat.map((surat, index) => {
                  const fileUrl = surat.file_surat
                    ? surat.file_surat.startsWith("http") || surat.file_surat.startsWith("/uploads")
                      ? surat.file_surat
                      : `/uploads/${surat.file_surat}`
                    : null;

                  return (
                    <tr key={surat.id || index} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{surat.no_surat}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{surat.tgl_surat || "-"}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{surat.pengirim}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate" title={surat.perihal}>
                        {surat.perihal}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-medium text-slate-600 border border-slate-200">
                          {surat.tgl_diterima || "-"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {fileUrl ? (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Tidak ada</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDelete(surat.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Surat Masuk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH SURAT MASUK */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Tambah Arsip Surat Masuk</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Surat Asal <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="no_surat"
                  placeholder="Contoh: 421.4 / 088 / DISDIK / 2026"
                  value={formData.no_surat}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Surat <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tgl_surat"
                    value={formData.tgl_surat}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Diterima TU <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tgl_diterima"
                    value={formData.tgl_diterima}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Instansi / Pengirim Surat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="pengirim"
                  placeholder="Contoh: Dinas Pendidikan Provinsi Maluku / BPMP"
                  value={formData.pengirim}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Perihal Surat <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="perihal"
                  rows={2}
                  placeholder="Tuliskan isi ringkas atau perihal surat masuk..."
                  value={formData.perihal}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Unggah Berkas Fisik / Scan (PDF / Gambar)
                </label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-xl p-3.5 text-center transition-all cursor-pointer">
                  <input
                    type="file"
                    name="file_surat"
                    accept=".pdf, .jpg, .jpeg, .png"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <UploadCloud className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-slate-700 text-xs">
                      {formData.file_surat ? formData.file_surat.name : "Klik untuk memilih berkas"}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF, PNG, JPG (Maks. 10MB)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/25 flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Simpan Surat Masuk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
