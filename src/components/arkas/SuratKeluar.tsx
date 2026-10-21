"use client";
import { 
  Send, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  ArrowLeft, 
  X, 
  Calendar, 
  FileText, 
  Building2, 
  CheckCircle2, 
  FileCheck 
} from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { LOGO_MALUKU_BASE64, LOGO_SMA3BURU_BASE64 } from "@/lib/logos";

// DATABASE PEGAWAI SMA NEGERI 3 BURU
const DAFTAR_PEGAWAI = [
  {
    nama: "ANTON LA HARI, S.Pd, M.Pd",
    nip: "19780703 200312 1 005",
    pangkat: "Pembina Utama Muda - IV/c",
  },
  {
    nama: "SUMARHADI, S. Pd",
    nip: "19681231 200312 1 076",
    pangkat: "Pembina Utama Muda - IV/c",
  },
  {
    nama: "AYUB RAHALEB, S.Pd",
    nip: "19700504 200008 1001",
    pangkat: "Pembina Tk. I - IV/b",
  },
  {
    nama: "HALIMAH TULAPESSY, S. Pd",
    nip: "19731212 200312 2003",
    pangkat: "Pembina Tk. I - IV/b",
  },
  {
    nama: "SUGITO, S. Pd",
    nip: "19730905 200501 1008",
    pangkat: "Pembina Tk. I - IV/b",
  },
  {
    nama: "ARMAN, S. Pd",
    nip: "19760706 200501 1019",
    pangkat: "Pembina Tk. I - IV/b",
  },
  {
    nama: "YUSNANI, S. Pd",
    nip: "19710912 200502 2 003",
    pangkat: "Pembina Tk. I - IV/b",
  },
  {
    nama: "SULASTRI UMALEKHAY, S.Pd",
    nip: "19710222 200701 2013",
    pangkat: "Pembina - IV/a",
  },
  {
    nama: "JUFRIN SUHITI, S. Pd",
    nip: "19750511 200804 1001",
    pangkat: "Pembina - IV/a",
  },
  {
    nama: "FATMA J HATUWE, S. Pd",
    nip: "19821118 200804 2 001",
    pangkat: "Pembina - IV/a",
  },
  {
    nama: "RUSDIN TOMIA,S. Pd",
    nip: "19871205 201101 1008",
    pangkat: "Pembina - IV/a",
  },
  {
    nama: "MALHAYATI SANMAS, S.Pd",
    nip: "19820315 200904 2001",
    pangkat: "Penata Tk. I - III/d",
  },
  {
    nama: "YANTI TAN, S. Pd",
    nip: "19830201 200904 2 002",
    pangkat: "Penata Tk. I - III/d",
  },
  {
    nama: "MUH. ALI MAASILY, S. Pd",
    nip: "19790629 201001 1018",
    pangkat: "Penata Tk. I - III/d",
  },
  {
    nama: "BAKRI PATTILOUW, S. Pd",
    nip: "19850505 201001 1034",
    pangkat: "Penata Tk. I - III/d",
  },
  {
    nama: "SUKMAWATI MAHULAUW, S.Pd",
    nip: "19810618 201101 2 007",
    pangkat: "Penata Tk. I - III/d",
  },
  {
    nama: "CHOIRUDIN, S.Pdi",
    nip: "19840315 201101 1004",
    pangkat: "Penata Tk. I - III/d",
  },
  {
    nama: "JARIA SAHUPOLY, S.Pd",
    nip: "19850505 201101 2 022",
    pangkat: "Penata Tk. I - III/c",
  },
  {
    nama: "ANHAR FIRMANSYAH, S.Pd.I",
    nip: "19910621 201504 1001",
    pangkat: "Penata Tk. I - III/c",
  },
  {
    nama: "N. NURHAYATI SOULISA, S.Pd",
    nip: "19900401 201504 2 002",
    pangkat: "Penata Tk. I - III/c",
  },
  {
    nama: "RIYANI MAU, Amd",
    nip: "19800502 200008 2001",
    pangkat: "Penata Tk. I - III/c",
  },
  {
    nama: "BAHARUDIN PAPALIA, SE",
    nip: "19770829 199802 1001",
    pangkat: "Penata Tk. I - III/d",
  },
  {
    nama: "SIGIT HEMAWANTO, SE",
    nip: "19851229 202221 1014",
    pangkat: "GOL.IX",
  },
  { nama: "NANIK IRAWATI, SS", nip: "19870131 202321 2024", pangkat: "GOL.IX" },
  {
    nama: "AHMAD ROHMAN, S.Kom",
    nip: "19921015 202321 1026",
    pangkat: "GOL.IX",
  },
  {
    nama: "HARI SUWONDO, S.Si",
    nip: "19870720 202321 211028",
    pangkat: "GOL.IX",
  },
  {
    nama: "NEKA DWI P. SAPSUHA, SPd",
    nip: "19971103 202321 2018",
    pangkat: "GOL.IX",
  },
  {
    nama: "SITI SARA NAMSA, S.Pd",
    nip: "19970107 202321 2025",
    pangkat: "GOL.IX",
  },
  {
    nama: "ZULAIHA PACINA, S.Pd",
    nip: "19840718 202421 2006",
    pangkat: "GOL.IX",
  },
  {
    nama: "IRIANTI SANTIKA, S.Pd",
    nip: "19990304 202421 2005",
    pangkat: "GOL.IX",
  },
  {
    nama: "MUAMAR KADAFI GAILEA, S.Pd",
    nip: "19900505 202321 1024",
    pangkat: "GOL.IX",
  },
  {
    nama: "HASLINDA BANDU, SE",
    nip: "19850707 202521 2138",
    pangkat: "GOL.IX",
  },
  { nama: "FARDIANSYAH, S.Pd", nip: "19960922 202521 1105", pangkat: "GOL.IX" },
  { nama: "KRISTOPAN, S.Pd", nip: "-", pangkat: "-" },
  { nama: "RATNA WIDIARTI, S.Pd", nip: "-", pangkat: "-" },
  { nama: "SRI UTAMI, SS", nip: "-", pangkat: "-" },
  { nama: "TITI SUHARTI PAPALIA, S.Pd", nip: "-", pangkat: "-" },
  { nama: "ALFIA PIRASOU, S.Pd", nip: "-", pangkat: "-" },
  { nama: "KURNIA LUTFIA NINGRUM, S.Pd", nip: "-", pangkat: "-" },
  { nama: "ROHMATUL HIDAYAH, S.A.B", nip: "-", pangkat: "-" },
  { nama: "YUNI LEDI SYNTIANI, S.Pd", nip: "-", pangkat: "-" },
  { nama: "MUHAMMAD HASAN, S.I.Kom", nip: "-", pangkat: "-" },
  { nama: "SISKA PRATIWI RAHALEB", nip: "-", pangkat: "-" },
  { nama: "ARIF NAHROWI", nip: "-", pangkat: "-" },
  { nama: "BAHRUDIN", nip: "-", pangkat: "-" },
  { nama: "TRI ANGGRAIENI SAMINGAN", nip: "-", pangkat: "-" },
];


// Helper untuk menghitung Tujuan & Perihal secara otomatis sesuai jenis surat dan data yang diisi
const getOtomatisTujuanDanPerihal = (jenis: string, dynamic: any = {}) => {
  let tujuan = "";
  let perihal = "";

  switch (jenis) {
    case "Surat Tugas (Individu)":
      tujuan = dynamic.nama ? `${dynamic.nama}` : "Guru / Pegawai Yang Ditugaskan";
      perihal = dynamic.nama
        ? `Surat Tugas Pelaksanaan Kegiatan a.n. ${dynamic.nama}`
        : "Surat Tugas Pelaksanaan Kegiatan";
      break;

    case "Surat Tugas (Banyak Orang)":
      const jmlPeserta = dynamic.tugas_banyak?.length || 0;
      tujuan = jmlPeserta > 0
        ? `Daftar Guru / Pegawai (${jmlPeserta} Orang Terlampir)`
        : "Daftar Guru / Pegawai Terlampir";
      perihal = dynamic.perihal2
        ? `Surat Tugas Kolektif: ${dynamic.perihal2.substring(0, 60)}`
        : "Surat Tugas Kolektif";
      break;

    case "Surat Izin":
      tujuan = dynamic.nama ? `${dynamic.nama}` : "Guru / Pegawai Yang Bersangkutan";
      perihal = dynamic.nama
        ? `Surat Izin a.n. ${dynamic.nama}`
        : "Surat Izin Tidak Masuk Kerja / Tugas Luar";
      break;

    case "Surat Tidak Ada SKHUN":
      tujuan = dynamic.nama ? `Alumni / Siswa (${dynamic.nama})` : "Siswa / Alumni Yang Bersangkutan";
      perihal = dynamic.nama
        ? `Surat Keterangan Tidak Memiliki SKHUN a.n. ${dynamic.nama}`
        : "Surat Keterangan Tidak Memiliki SKHUN";
      break;

    case "Berita Acara Dana BOSP":
      tujuan = "Kepala Cabang Dinas Pendidikan & Kebudayaan Prov. Maluku";
      perihal = dynamic.tahap
        ? `Berita Acara Pemeriksaan Kas Dana BOSP Tahap ${dynamic.tahap}`
        : "Berita Acara Pemeriksaan Kas Dana BOSP";
      break;

    case "Surat Pengantar (SK Berkala)":
      tujuan = "Kacabdin Pendidikan Menengah & PK Kab. Buru";
      perihal = dynamic.nama
        ? `Usulan SK Kenaikan Gaji Berkala a.n. ${dynamic.nama}`
        : "Usulan SK Kenaikan Gaji Berkala";
      break;

    case "Surat Pengantar (PAK)":
      tujuan = "Kacabdin Pendidikan Menengah & PK Kab. Buru";
      perihal = "Surat Pengantar Pengusulan Penetapan Angka Kredit (PAK) Integrasi";
      break;

    case "Rekapitulasi Absen":
      tujuan = "Kacabdin Pendidikan Menengah & PK Kab. Buru";
      perihal = dynamic.nama
        ? `Rekapitulasi Daftar Hadir Bulan ${dynamic.periode_bulan || ""} a.n. ${dynamic.nama}`
        : (dynamic.periode_bulan ? `Rekapitulasi Daftar Hadir Bulan ${dynamic.periode_bulan}` : "Rekapitulasi Daftar Hadir Guru & Pegawai");
      break;

    default:
      tujuan = "";
      perihal = "";
      break;
  }

  return { tujuan, perihal };
};

interface SuratKeluarProps {
  onBack?: () => void;
  logoKiriUrl?: string | null;
  logoKananUrl?: string | null;
  logoKiriSize?: number;
  logoKananSize?: number;
}

export default function SuratKeluar({
  onBack,
  logoKiriUrl,
  logoKananUrl,
  logoKiriSize,
  logoKananSize,
}: SuratKeluarProps) {
  const [suratList, setSuratList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState("ALL");

  // State dasar untuk form
  const [formData, setFormData] = useState<any>({
    no_surat: "",
    tahun_surat: new Date().getFullYear().toString(),
    tgl_surat: "",
    tujuan: "",
    jenis_surat: "",
    perihal: "",
    file_surat: null,
  });

  // State dinamis untuk data spesifik setiap template
  const [dynamicData, setDynamicData] = useState<any>({
    tugas_banyak: [],
    peserta_pak: [],
  });

  const fetchSurat = async () => {
    try {
      const response = await axios.get(
        "/api/surat-keluar",
      );
      setSuratList(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchSurat();
  }, []);

  // Sinkronisasi otomatis Tujuan & Perihal secara real-time
  useEffect(() => {
    if (formData.jenis_surat) {
      const auto = getOtomatisTujuanDanPerihal(formData.jenis_surat, dynamicData);
      setFormData((prev: any) => {
        if (prev.tujuan !== auto.tujuan || prev.perihal !== auto.perihal) {
          return {
            ...prev,
            tujuan: auto.tujuan,
            perihal: auto.perihal,
          };
        }
        return prev;
      });
    }
  }, [formData.jenis_surat, dynamicData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "jenis_surat") {
      setDynamicData({ tugas_banyak: [] });
    }
  };

  const handleDynamicChange = (e: any) => {
    setDynamicData({ ...dynamicData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    setFormData({ ...formData, file_surat: e.target.files[0] });
  };

  // --- FUNGSI KHUSUS UNTUK TABEL (SURAT TUGAS BANYAK ORANG) ---
  const handleAddPeserta = () => {
    setDynamicData({
      ...dynamicData,
      tugas_banyak: [
        ...(dynamicData.tugas_banyak || []),
        {
          nama: "",
          nip: "",
          pangkat: "",
          jabatan: "Guru",
          alamat: "Waekerta, Kec Waeapo Kab Buru",
        },
      ],
    });
  };

  const handlePesertaChange = (index: any, e: any) => {
    const newPeserta = [...dynamicData.tugas_banyak];
    newPeserta[index][e.target.name] = e.target.value;
    setDynamicData({ ...dynamicData, tugas_banyak: newPeserta });
  };

  const handleRemovePeserta = (index: any) => {
    const newPeserta = [...dynamicData.tugas_banyak];
    newPeserta.splice(index, 1);
    setDynamicData({ ...dynamicData, tugas_banyak: newPeserta });
  };

  const formatTgl = (tgl: any) => {
    if (!tgl) return "...";
    const date = new Date(tgl);
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const tglAngka =
      date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${tglAngka} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  // --- FUNGSI MENGGABUNGKAN TEKS SURAT ---
  const compileSurat = () => {
    let hasilSurat = "";
    const no = formData.no_surat || "...";
    const tahun = formData.tahun_surat || new Date().getFullYear();
    const tglSurat = formData.tgl_surat ? formatTgl(formData.tgl_surat) : "...";

    switch (formData.jenis_surat) {
      case "Surat Tugas (Individu)":
        hasilSurat = `<div style="text-align: center; margin-bottom: 20px;">
    <span style="font-weight: bold; text-decoration: underline; font-size: 14pt;">SURAT TUGAS</span><br/>
    Nomor : 421.4 / ${no} / ${tahun}
</div>

Yang bertanda tangan dibawah ini Kepala SMA Negeri 3 Buru

<table style="width: 100%; margin-left: 20px; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px;">
    <tr><td style="width: 170px; padding: 2px 0;">N a m a</td><td style="width: 10px;">:</td><td><b>ANTON LA HARI, S.Pd, M.Pd</b></td></tr>
    <tr><td style="padding: 2px 0;">N i p</td><td>:</td><td>19780703 200312 1 005</td></tr>
    <tr><td style="padding: 2px 0;">Pangkat / Golongan</td><td>:</td><td>Pembina Utama Muda - IV/c</td></tr>
    <tr><td style="padding: 2px 0;">Jabatan</td><td>:</td><td>Kepala Sekolah</td></tr>
    <tr><td style="padding: 2px 0;">Alamat</td><td>:</td><td>Waekerta , Kec. Waeapo</td></tr>
</table>

<div style="text-align: justify; margin-bottom: 15px;">
    ${dynamicData.perihal1 || "Dengan ini memberikan tugas kepada:"}
</div>

<table style="width: 100%; margin-left: 20px; border-collapse: collapse; margin-bottom: 15px;">
    <tr><td style="width: 170px; padding: 2px 0;">Nama</td><td style="width: 10px;">:</td><td><b>${dynamicData.nama || "..."}</b></td></tr>
    <tr><td style="padding: 2px 0;">Nip</td><td>:</td><td>${dynamicData.nip || "..."}</td></tr>
    <tr><td style="padding: 2px 0;">Pangkat/Golongan</td><td>:</td><td>${dynamicData.pangkat || "..."}</td></tr>
    <tr><td style="padding: 2px 0;">Jabatan</td><td>:</td><td>${dynamicData.jabatan || "..."}</td></tr>
    <tr><td style="padding: 2px 0;">Alamat</td><td>:</td><td>${dynamicData.alamat || "Waekerta, Kec Waeapo Kab Buru"}</td></tr>
</table>

<div style="text-align: justify; line-height: 1.5;">
    ${dynamicData.perihal2 || "..."}
    <br/>
    Demikian Surat Tugas ini dibuat dan diberikan untuk dapat dipergunakan sebagaimana mestinya.
</div>

<div style="float: right; width: 300px; margin-top: 30px;">
    <table style="width: 100%;">
        <tr><td style="width: 100px;">Diberikan di</td><td>: Waekerta</td></tr>
        <tr><td>Pada Tanggal</td><td>: ${tglSurat}</td></tr>
    </table>
    <div style="text-align: center; margin-top: 15px;">
        Kepala Sekolah<br/><br/><br/><br/><br/>
        <b>ANTON LA HARI, S.Pd, M.Pd</b><br/>
        Nip. 19780703 200312 1 005
    </div>
</div>
<div style="clear: both;"></div>`;
        break;

      case "Surat Tugas (Banyak Orang)":
        let barisTabel = "";
        if (dynamicData.tugas_banyak && dynamicData.tugas_banyak.length > 0) {
          dynamicData.tugas_banyak.forEach((peserta: any, idx: any) => {
            const nipText = peserta.nip ? `<br/>Nip.${peserta.nip}` : "";
            barisTabel += `
                        <tr>
                            <td style="border: 1px solid black; padding: 5px; text-align: center;">${idx + 1}</td>
                            <td style="border: 1px solid black; padding: 5px;">${peserta.nama || "..."}${nipText}</td>
                            <td style="border: 1px solid black; padding: 5px; text-align: center;">${peserta.pangkat || "..."}</td>
                            <td style="border: 1px solid black; padding: 5px; text-align: center;">${peserta.jabatan || "..."}</td>
                            <td style="border: 1px solid black; padding: 5px;">${peserta.alamat || "..."}</td>
                        </tr>`;
          });
        } else {
          barisTabel = `<tr><td colspan="5" style="border: 1px solid black; padding: 5px; text-align: center;">Data belum diisi</td></tr>`;
        }

        hasilSurat = `<div style="text-align: center; margin-bottom: 20px;">
    <span style="font-weight: bold; text-decoration: underline; font-size: 14pt;">SURAT TUGAS</span><br/>
    Nomor : 421.4 / ${no} / ${tahun}
</div>

Yang bertanda tangan dibawah ini Kepala SMA Negeri 3 Buru

<table style="width: 100%; margin-left: 20px; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px;">
    <tr><td style="width: 170px; padding: 2px 0;">N a m a</td><td style="width: 10px;">:</td><td><b>ANTON LA HARI, S.Pd, M.Pd</b></td></tr>
    <tr><td style="padding: 2px 0;">N i p</td><td>:</td><td>19780703 200312 1 005</td></tr>
    <tr><td style="padding: 2px 0;">Pangkat / Golongan</td><td>:</td><td>Pembina Utama Muda - IV/c</td></tr>
    <tr><td style="padding: 2px 0;">Jabatan</td><td>:</td><td>Kepala Sekolah</td></tr>
    <tr><td style="padding: 2px 0;">Alamat</td><td>:</td><td>Waekerta , Kec. Waeapo</td></tr>
</table>

<div style="text-align: justify; margin-bottom: 10px; line-height: 1.5;">
    ${dynamicData.dasar_surat || "Dengan ini memberikan tugas kepada:"}
</div>

<table style="width: 100%; border-collapse: collapse; border: 1px solid black; margin-bottom: 20px;">
    <thead>
        <tr>
            <th style="border: 1px solid black; padding: 5px; width: 5%;">NO</th>
            <th style="border: 1px solid black; padding: 5px; width: 30%;">Nama</th>
            <th style="border: 1px solid black; padding: 5px; width: 25%;">Pangkat/Golongan</th>
            <th style="border: 1px solid black; padding: 5px; width: 15%;">Jabatan</th>
            <th style="border: 1px solid black; padding: 5px; width: 25%;">Alamat</th>
        </tr>
    </thead>
    <tbody>
        ${barisTabel}
    </tbody>
</table>

<div style="text-align: justify; line-height: 1.5;">
    ${dynamicData.perihal2 || "..."}
    <br/>
    Demikian Surat Tugas ini dibuat dan diberikan untuk dapat dipergunakan sebagaimana mestinya.
</div>

<div style="float: right; width: 300px; margin-top: 30px;">
    <table style="width: 100%;">
        <tr><td style="width: 100px;">Diberikan di</td><td>: Waekerta</td></tr>
        <tr><td>Pada Tanggal</td><td>: ${tglSurat}</td></tr>
    </table>
    <div style="text-align: center; margin-top: 15px;">
        Kepala Sekolah<br/><br/><br/><br/><br/>
        <b>ANTON LA HARI, S.Pd, M.Pd</b><br/>
        Nip. 19780703 200312 1 005
    </div>
</div>
<div style="clear: both;"></div>`;
        break;
      case "Surat Pengantar (SK Berkala)":
        hasilSurat = `
          <div style="margin-top: 20px;">
            <table style="width: 100%; border: none;">
              <tr>
                <td style="width: 60%;">
                  Kepada.<br/>
                  Yth. Kepala Cabang Dinas Pendidikan Menengah<br/>
                  Dan Pendidikan Khusus Kabupaten Buru<br/>
                  Di –<br/>
                  <span style="margin-left: 20px; letter-spacing: 2px;">N a m l e a</span>
                </td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
              <span style="font-size: 14pt; font-weight: bold; text-decoration: underline;">SURAT PENGANTAR</span><br/>
              Nomor : 421.4 / ${no} / ${tahun}
            </div>

            <div style="margin-bottom: 15px;">Dengan hormat, kami sampaikan kepada Bapak :</div>

            <table style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 40px; border: 1.5px solid black;">
              <thead>
                <tr>
                  <th style="padding: 8px; width: 5%; border: 1.5px solid black;">NO</th>
                  <th style="padding: 8px; width: 45%; border: 1.5px solid black;">URAIAN</th>
                  <th style="padding: 8px; width: 20%; border: 1.5px solid black;">BANYAKNYA</th>
                  <th style="padding: 8px; width: 30%; border: 1.5px solid black;">KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px; vertical-align: top; border: 1.5px solid black;">1</td>
                  <td style="padding: 8px; text-align: justify; vertical-align: top; border: 1.5px solid black;">
                    Usul kenaikan SK berkala an.<br/>
                    <b>${dynamicData.nama || "........................."}</b> guru SMA Negeri 3 Buru sebagaimana berkas terlampir.
                  </td>
                  <td style="padding: 8px; vertical-align: top; border: 1.5px solid black;">1 ( Satu ) Jepit</td>
                  <td style="padding: 8px; text-align: left; vertical-align: top; border: 1.5px solid black;">Disampaikan untuk dapat diketahui dan proses selanjutnya.</td>
                </tr>
              </tbody>
            </table>

            <div style="margin-bottom: 40px;">Atas perhatiannya disampaikan terima kasih.</div>

            <div style="display: flex; justify-content: flex-end;">
              <div style="text-align: left; width: 300px;">
                Waekerta, ${tglSurat}<br/>
                Kepala sekolah,<br/><br/><br/><br/><br/>
                <b>ANTON LA HARI, S.Pd, M.Pd</b><br/>
                Nip. 19780703 200312 1 005
              </div>
            </div>

            <div style="margin-top: 30px; font-weight: bold; font-size: 10pt;">
              Tembusan:<br/>
              <span style="margin-left: 30px; font-weight: normal;">Yth, Kepala Dinas Pendidikan dan Kebudayaan Provinsi Maluku</span><br/>
              <span style="margin-left: 30px; font-weight: normal;">C.q Kabid Kepegawaian di Ambon</span>
            </div>
          </div>
        `;
        break;

      case "Surat Pengantar (PAK)":
        let uraianPak = (dynamicData.peserta_pak || [])
          .map(
            (p: any, i: any) => `
          <b>${i + 1}. ${p.nama}</b><br/>
          Nip : ${p.nip || "-"}<br/>
        `,
          )
          .join("");

        hasilSurat = `
          <div style="margin-top: 20px;">
            <table style="width: 100%; border: none;">
              <tr>
                <td style="width: 60%;">
                  Kepada.<br/>
                  Yth. Kepala Cabang Dinas Pendidikan Menengah<br/>
                  Dan Pendidikan Khusus Kabupaten Buru<br/>
                  Di –<br/>
                  <span style="margin-left: 20px; letter-spacing: 2px;">N a m l e a</span>
                </td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
              <span style="font-size: 14pt; font-weight: bold; text-decoration: underline;">SURAT PENGANTAR</span><br/>
              Nomor : 421.4 / ${no} / ${tahun}
            </div>

            <div style="margin-bottom: 15px;">Dengan hormat, kami sampaikan kepada Bapak :</div>

            <table style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 40px; border: 1.5px solid black;">
              <thead>
                <tr>
                  <th style="padding: 8px; width: 5%; border: 1.5px solid black;">NO</th>
                  <th style="padding: 8px; width: 45%; border: 1.5px solid black;">URAIAN</th>
                  <th style="padding: 8px; width: 20%; border: 1.5px solid black;">BANYAKNYA</th>
                  <th style="padding: 8px; width: 30%; border: 1.5px solid black;">KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px; vertical-align: top; border: 1.5px solid black;">1</td>
                  <td style="padding: 8px; text-align: left; vertical-align: top; border: 1.5px solid black;">
                    Surat Pengusulan PAK Integrasi an.<br/>
                    ${uraianPak}
                    guru SMA Negeri 3 Buru sebagaimana berkas terlampir.
                  </td>
                  <td style="padding: 8px; vertical-align: top; border: 1.5px solid black;">1 ( Satu ) Jepit</td>
                  <td style="padding: 8px; text-align: left; vertical-align: top; border: 1.5px solid black;">Disampaikan untuk dapat diketahui dan proses selanjutnya.</td>
                </tr>
              </tbody>
            </table>

            <div style="margin-bottom: 40px;">Atas perhatiannya disampaikan terima kasih.</div>

            <div style="display: flex; justify-content: flex-end;">
              <div style="text-align: left; width: 300px;">
                Waekerta, ${tglSurat}<br/>
                Plt Kepala Sekolah<br/><br/><br/><br/><br/>
                <b>ANTON LA HARI, S.Pd, M.Pd</b><br/>
                Nip. 19780703 200312 1 005
              </div>
            </div>

            <div style="margin-top: 30px; font-weight: bold; font-size: 10pt;">
              Tembusan:<br/>
              <span style="margin-left: 30px; font-weight: normal;">Yth, Kepala Dinas Pendidikan dan Kebudayaan Provinsi Maluku</span><br/>
              <span style="margin-left: 30px; font-weight: normal;">C.q Kabid Kepegawaian di Ambon</span>
            </div>
          </div>
        `;
        break;
      case "Surat Izin":
        hasilSurat = `<div style="text-align: center; margin-bottom: 20px;">
    <span style="font-weight: bold; text-decoration: underline; font-size: 14pt;">SURAT IZIN</span><br/>
    Nomor : 421.4 / ${no} / ${tahun}
</div>

Yang bertanda tangan dibawah ini Kepala SMA Negeri 3 Buru

<table style="width: 100%; margin-left: 20px; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px;">
    <tr><td style="width: 170px; padding: 2px 0;">N a m a</td><td style="width: 10px;">:</td><td><b>ANTON LA HARI, S.Pd, M.Pd</b></td></tr>
    <tr><td style="padding: 2px 0;">N i p</td><td>:</td><td>19780703 200312 1 005</td></tr>
    <tr><td style="padding: 2px 0;">Pangkat / Golongan</td><td>:</td><td>Pembina Utama Muda - IV/c</td></tr>
    <tr><td style="padding: 2px 0;">Jabatan</td><td>:</td><td>Kepala Sekolah</td></tr>
    <tr><td style="padding: 2px 0;">Alamat</td><td>:</td><td>Waekerta , Kec. Waeapo</td></tr>
</table>

Dengan ini Mengizinkan

<table style="width: 100%; margin-left: 20px; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
    <tr><td style="width: 170px; padding: 2px 0;">Nama</td><td style="width: 10px;">:</td><td><b>${dynamicData.nama || "..."}</b></td></tr>
    <tr><td style="padding: 2px 0;">Nip</td><td>:</td><td>${dynamicData.nip || "..."}</td></tr>
    <tr><td style="padding: 2px 0;">Pangkat/Golongan</td><td>:</td><td>${dynamicData.pangkat || "..."}</td></tr>
    <tr><td style="padding: 2px 0;">Jabatan</td><td>:</td><td>${dynamicData.jabatan || "..."}</td></tr>
    <tr><td style="padding: 2px 0;">Alamat</td><td>:</td><td>${dynamicData.alamat || "Waekerta, Kec Waeapo Kab Buru."}</td></tr>
</table>

<div style="text-align: justify; line-height: 1.5;">
    ${dynamicData.perihal2 || "..."}
    <br/><br/>
    Demikian Surat izin ini dibuat dan diberikan untuk dapat dipergunakan sebagaimana mestinya
</div>

<div style="float: right; width: 300px; margin-top: 30px;">
    <table style="width: 100%;">
        <tr><td style="width: 100px;">Diberikan di</td><td>: Waekerta</td></tr>
        <tr><td>Pada Tanggal</td><td>: ${tglSurat}</td></tr>
    </table>
    <div style="text-align: center; margin-top: 15px;">
        Kepala Sekolah<br/><br/><br/><br/><br/>
        <b>ANTON LA HARI, S.Pd, M.Pd</b><br/>
        Nip. 19780703 200312 1 005
    </div>
</div>
<div style="clear: both;"></div>`;
        break;

      case "Surat Tidak Ada SKHUN":
        hasilSurat = `<div style="text-align: center; margin-bottom: 20px;">
    <span style="font-weight: bold; text-decoration: underline; font-size: 14pt;">SURAT KETERANGAN</span><br/>
    Nomor : 421.4 / ${no} / ${tahun}
</div>

Yang bertanda tangan dibawah ini Kepala SMA Negeri 3 Buru

<table style="width: 100%; margin-left: 20px; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px;">
    <tr><td style="width: 170px; padding: 2px 0;">N a m a</td><td style="width: 10px;">:</td><td><b>ANTON LA HARI, S.Pd, M.Pd</b></td></tr>
    <tr><td style="padding: 2px 0;">N i p</td><td>:</td><td>19780703 200312 1 005</td></tr>
    <tr><td style="padding: 2px 0;">Pangkat / Golongan</td><td>:</td><td>Pembina Utama Muda - IV/c</td></tr>
    <tr><td style="padding: 2px 0;">Jabatan</td><td>:</td><td>Kepala Sekolah</td></tr>
    <tr><td style="padding: 2px 0;">Alamat</td><td>:</td><td>Waekerta , Kec. Waeapo</td></tr>
</table>

Dengan ini menerangkan bahwa

<table style="width: 100%; margin-left: 20px; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
    <tr><td style="width: 170px; padding: 2px 0;">Nama</td><td style="width: 10px;">:</td><td><b>${dynamicData.nama || "..."}</b></td></tr>
    <tr><td style="padding: 2px 0;">NISN</td><td>:</td><td>${dynamicData.nisn || "..."}</td></tr>
    <tr><td style="padding: 2px 0;">NPSN</td><td>:</td><td>${dynamicData.npsn || "60101015"}</td></tr>
    <tr><td style="padding: 2px 0;">Tempat Tgl Lahir</td><td>:</td><td>${dynamicData.ttl || "..."}</td></tr>
    <tr><td style="padding: 2px 0;">Alamat</td><td>:</td><td>${dynamicData.alamat || "..."}</td></tr>
</table>

<div style="text-align: justify; line-height: 1.5;">
    Adalah benar &ndash; benar tidak memiliki SKHUN, mengingat Tahun Pelajaran ${dynamicData.tahun_ajaran || "2025/2026"} Ujian Nasional telah ditiadakan oleh Menteri Pendidikan.
    <br/>
    Demikian Surat Keterangan ini dibuat dan diberikan untuk dapat dipergunakan sebagaimana mestinya
</div>

<div style="float: right; width: 300px; margin-top: 30px;">
    <table style="width: 100%;">
        <tr><td style="width: 100px;">Diberikan di</td><td>: Waekerta</td></tr>
        <tr><td>Pada Tanggal</td><td>: ${tglSurat}</td></tr>
    </table>
    <div style="text-align: center; margin-top: 15px;">
        Kepala Sekolah<br/><br/><br/><br/><br/>
        <b>ANTON LA HARI, S.Pd, M.Pd</b><br/>
        Nip. 19780703 200312 1 005
    </div>
</div>
<div style="clear: both;"></div>`;
        break;
      case "Rekapitulasi Absen":
        hasilSurat = `
          <div style="margin-top: 20px;">
            <div style="text-align: center; margin-top: 20px; margin-bottom: 30px; line-height: 1.5;">
              <span style="font-size: 12pt;">REKAPITULASI ABSEN KEHADIRAN PEGAWAI PPPK</span><br/>
              <span style="font-size: 12pt;">SMA NEGERI 3 BURU</span><br/>
              <span style="font-size: 12pt;">BULAN : ${dynamicData.periode_bulan || "........................................"}</span>
            </div>

            <table style="width: 100%; border: none; margin-bottom: 20px; font-size: 12pt;">
              <tr>
                <td style="width: 25%;">NAMA</td>
                <td style="width: 2%;">:</td>
                <td style="width: 73%; font-weight: bold;">${dynamicData.nama || "........................."}</td>
              </tr>
              <tr>
                <td>N I P</td>
                <td>:</td>
                <td>${dynamicData.nip || "........................."}</td>
              </tr>
              <tr>
                <td>PANGKAT/GOL</td>
                <td>:</td>
                <td>${dynamicData.pangkat || "........................."}</td>
              </tr>
              <tr>
                <td>JABATAN</td>
                <td>:</td>
                <td>${dynamicData.jabatan || "........................."}</td>
              </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 40px; font-size: 11pt; border: 2px solid black;">
              <thead>
                <tr>
                  <th rowspan="2" style="border: 1.5px solid black; padding: 10px; width: 20%;">Jumlah Hari<br/>Kerja</th>
                  <th rowspan="2" style="border: 1.5px solid black; padding: 10px; width: 20%;">Jumlah<br/>Kehadiran</th>
                  <th colspan="3" style="border: 1.5px solid black; padding: 5px; width: 30%;">Absensi</th>
                  <th rowspan="2" style="border: 1.5px solid black; padding: 10px; width: 30%;">Keterangan</th>
                </tr>
                <tr>
                  <th style="border: 1.5px solid black; padding: 8px; width: 10%;">A</th>
                  <th style="border: 1.5px solid black; padding: 8px; width: 10%;">S</th>
                  <th style="border: 1.5px solid black; padding: 8px; width: 10%;">I</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1.5px solid black; padding: 15px;">${dynamicData.jumlah_hari_kerja || "-"}</td>
                  <td style="border: 1.5px solid black; padding: 15px;">${dynamicData.jumlah_kehadiran || "-"}</td>
                  <td style="border: 1.5px solid black; padding: 15px;">${dynamicData.absen_a || "-"}</td>
                  <td style="border: 1.5px solid black; padding: 15px;">${dynamicData.absen_s || "-"}</td>
                  <td style="border: 1.5px solid black; padding: 15px;">${dynamicData.absen_i || "-"}</td>
                  <td style="border: 1.5px solid black; padding: 15px;">${dynamicData.keterangan_absen || ""}</td>
                </tr>
              </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end; margin-top: 50px;">
              <div style="text-align: left; width: 300px;">
                Waekerta, ${tglSurat}<br/>
                Plt Kepala Sekolah<br/><br/><br/><br/><br/>
                <b>ANTON LA HARI, S.Pd, M.Pd</b><br/>
                Nip. 19780703 200312 1 005
              </div>
            </div>
          </div>
        `;
        break;
      case "Berita Acara Dana BOSP":
        hasilSurat = `<div style="text-align: center; margin-bottom: 20px;">
    <span style="font-weight: bold; text-decoration: underline; font-size: 14pt;">BERITA ACARA PENCAIRAN DANA BOS P</span><br/>
    Nomor : 421.4 / ${no} / ${tahun}
</div>

<div style="text-align: justify; margin-bottom: 15px; margin-top:20px;">
    Pada hari ini : ${dynamicData.hari_tanggal || "..."} dicairkan Dana BOSP Tahap ${dynamicData.tahap || "..."} SMA Negeri 3 Buru :
</div>

<table style="width: 100%; margin-left: 20px; border-collapse: collapse; margin-bottom: 15px;">
    <tr><td style="width: 170px; padding: 2px 0;">N a m a</td><td style="width: 10px;">:</td><td><b>ANTON LA HARI, S.Pd, M.Pd</b></td></tr>
    <tr><td style="padding: 2px 0;">N i p</td><td>:</td><td>19780703 200312 1 005</td></tr>
    <tr><td style="padding: 2px 0;">Pangkat / Golongan</td><td>:</td><td>Pembina Utama Muda - IV/c</td></tr>
    <tr><td style="padding: 2px 0;">Jabatan</td><td>:</td><td>Kepala Sekolah</td></tr>
    <tr><td style="padding: 2px 0;">Alamat</td><td>:</td><td>Waekerta , Kec. Waeapo</td></tr>
</table>

<div style="text-align: justify; margin-bottom: 15px;">
    Bersama dengan seorang Bendahara :
</div>

<table style="width: 100%; margin-left: 20px; border-collapse: collapse; margin-bottom: 15px;">
    <tr><td style="width: 170px; padding: 2px 0;">Nama</td><td style="width: 10px;">:</td><td><b>BAHARUDIN PAPALIA, SE</b></td></tr>
    <tr><td style="padding: 2px 0;">Nip</td><td>:</td><td>197708291998021001</td></tr>
    <tr><td style="padding: 2px 0;">Pangkat/Golongan</td><td>:</td><td>Pengatur Tk. I-II/d</td></tr>
    <tr><td style="padding: 2px 0;">Jabatan</td><td>:</td><td>Bendahara BOSP</td></tr>
    <tr><td style="padding: 2px 0;">Alamat</td><td>:</td><td>Waekerta, Kec Waeapo Kab Buru</td></tr>
</table>

<div style="text-align: justify; margin-bottom: 15px; line-height: 1.6;">
    Pada ${dynamicData.bank || "..."} Sejumlah Rp. ${dynamicData.jumlah_angka || "..."},- (${dynamicData.jumlah_terbilang || "..."} Rupiah).
    <br/>
    Demikian berita acara ini dibuat untuk dapat digunakan sebagai bahan laporan pertanggungjawaban penggunaan Dana BOSP
</div>

<table style="width: 100%; margin-top: 30px; border-collapse: collapse;">
    <tr>
        <td style="width: 50%;"></td>
        <td style="width: 50%; padding-left: 40px;">Waekerta, ${tglSurat}</td>
    </tr>
    <tr>
        <td style="width: 50%; padding-left: 20px;">Kepala Sekolah</td>
        <td style="width: 50%; padding-left: 40px;">Bendahara BOSP</td>
    </tr>
    <tr>
        <td style="height: 80px;"></td>
        <td></td>
    </tr>
    <tr>
        <td style="padding-left: 20px;">
            <b>ANTON LA HARI, S.Pd, M.Pd</b><br/>
            Nip. 19780703 200312 1 005
        </td>
        <td style="padding-left: 40px;">
            <b>BAHARUDIN PAPALIA, SE</b><br/>
            Nip. 19770829 199802 1 001
        </td>
    </tr>
</table>
<div style="clear: both;"></div>`;
        break;

      default:
        hasilSurat = "Template belum tersedia. Hubungi Developer.";
        break;
    }
    return hasilSurat;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = new FormData();

    // 1. Kita buat salinan formData untuk dimodifikasi secara otomatis
    let dataSiapKirim = { ...formData };

    // 2. OTOMATISASI DATA (Mencegah Ditolak Server/Database)
    const autoData = getOtomatisTujuanDanPerihal(dataSiapKirim.jenis_surat, dynamicData);
    dataSiapKirim.tujuan = dataSiapKirim.tujuan || autoData.tujuan || "Pihak Terkait";
    dataSiapKirim.perihal = dataSiapKirim.perihal || autoData.perihal || "Surat Keluar";

    if (dataSiapKirim.jenis_surat === "Surat Pengantar (SK Berkala)") {
      dataSiapKirim.no_surat =
        dynamicData.nomor_surat_khusus || dataSiapKirim.no_surat || "-";
    } else if (dataSiapKirim.jenis_surat === "Surat Pengantar (PAK)") {
      dataSiapKirim.no_surat =
        dynamicData.nomor_surat_khusus || dataSiapKirim.no_surat || "-";
    } else if (dataSiapKirim.jenis_surat === "Rekapitulasi Absen") {
      dataSiapKirim.no_surat = dataSiapKirim.no_surat || "Tanpa Nomor";
    }

    // 3. Masukkan semua data yang sudah lengkap ke FormData
    Object.keys(dataSiapKirim).forEach((key) => {
      if (dataSiapKirim[key]) data.append(key, dataSiapKirim[key]);
    });

    // 4. Masukkan bentuk HTML cetakan suratnya
    data.append("isi_surat", compileSurat());

    try {
      await axios.post(
        "/api/surat-keluar",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      Swal.fire("Berhasil!", "Surat Keluar berhasil dibuat.", "success");
      setShowModal(false);
      fetchSurat();

      // Kosongkan Form Utama
      setFormData({
        no_surat: "",
        tahun_surat: new Date().getFullYear().toString(),
        tgl_surat: "",
        tujuan: "",
        jenis_surat: "",
        perihal: "",
        file_surat: null,
      });

      // Kosongkan Form Dinamis
      setDynamicData({ tugas_banyak: [], peserta_pak: [] });
    } catch (error) {
      console.error(error); // Membantu melacak pesan error dari server di inspect element
      Swal.fire(
        "Error!",
        "Gagal menyimpan. Pastikan semua kolom penting terisi.",
        "error",
      );
    }
  };

  const handleDelete = async (id: any) => {
    const result = await Swal.fire({
      title: "Hapus Surat?",
      text: "Data dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
    });
    if (result.isConfirmed) {
      await axios.delete(
        `/api/surat-keluar/${id}`,
      );
      fetchSurat();
    }
  };

  // --- FUNGSI CETAK ---
  const handleCetak = (isi_surat: any) => {
    if (!isi_surat)
      return Swal.fire("Kosong", "Tidak ada isi teks surat.", "warning");

    // Ambil logo dari props (Pengaturan Identitas & Logo) atau dari localStorage browser
    const savedLogoKiri = typeof window !== 'undefined' ? localStorage.getItem('logoKiriUrl') : null;
    const savedLogoKanan = typeof window !== 'undefined' ? localStorage.getItem('logoKananUrl') : null;
    const rawKiriSize = typeof window !== 'undefined' && localStorage.getItem('logoKiriSize') ? Number(localStorage.getItem('logoKiriSize')) : 80;
    const rawKananSize = typeof window !== 'undefined' && localStorage.getItem('logoKananSize') ? Number(localStorage.getItem('logoKananSize')) : 80;

    const activeLogoKiri = logoKiriUrl || savedLogoKiri || LOGO_MALUKU_BASE64;
    const activeLogoKanan = logoKananUrl || savedLogoKanan || LOGO_SMA3BURU_BASE64;

    // OWASP A03: Sanitasi URL Logo - cegah injection javascript: URI atau payload XSS
    const validateLogo = (url: string | null | undefined, fallback: string): string => {
      if (!url || typeof url !== 'string') return fallback;
      const clean = url.trim();
      if (clean.startsWith('data:image/') || clean.startsWith('/') || clean.startsWith('http://') || clean.startsWith('https://')) {
        if (!clean.includes('smantigaburu') && !clean.includes('wikimedia') && clean !== 'null' && clean !== 'undefined') {
          return clean;
        }
      }
      return fallback;
    };

    const validLogoKiri = validateLogo(activeLogoKiri, LOGO_MALUKU_BASE64);
    const validLogoKanan = validateLogo(activeLogoKanan, LOGO_SMA3BURU_BASE64);

    // Batasi ukuran dimensi logo secara numerik yang aman (clamped)
    const activeSizeKiri = Math.min(Math.max(Number(logoKiriSize || rawKiriSize) || 80, 30), 150);
    const activeSizeKanan = Math.min(Math.max(Number(logoKananSize || rawKananSize) || 80, 30), 150);

    // OWASP A03: Sanitasi isi surat sebelum disuntikkan ke DOM
    const cleanIsiSurat = String(isi_surat)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/on\w+\s*=\s*[^>\s]+/gi, '')
      .replace(/javascript:/gi, 'blocked:');

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="utf-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data: http: https:; script-src 'unsafe-inline';">
          <title>Cetak Surat Resmi</title>
          <style>
              @page { 
                  size: auto;
                  margin: 0mm;
              }
              body { 
                  font-family: 'Times New Roman', Times, serif; 
                  font-size: 12pt; 
                  color: black; 
                  margin: 0;
                  padding: 15mm 20mm 20mm 20mm;
                  max-width: 100%;
                  position: relative;
                  top: 0;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
              }
              .kop-surat { 
                  display: flex; 
                  align-items: center; 
                  justify-content: space-between; 
                  border-bottom: 3px solid black; 
                  padding-bottom: 5px; 
                  margin-bottom: 2px; 
              }
              .garis-bawah { 
                  border-bottom: 1px solid black; 
                  margin-bottom: 30px; 
              }
              .teks-kop { 
                  text-align: center; 
                  line-height: 1.2; 
                  flex: 1; 
                  margin: 0 10px; 
              }
              .logo-kiri {
                  height: ${activeSizeKiri}px;
                  width: auto;
                  max-height: 95px;
                  object-fit: contain;
                  display: block;
              }
              .logo-kanan {
                  height: ${activeSizeKanan}px;
                  width: auto;
                  max-height: 95px;
                  object-fit: contain;
                  display: block;
              }
              .content { 
                  line-height: 1.5; 
                  text-align: justify; 
              }
          </style>
      </head>
      <body>
          <div class="kop-surat">
              <img src="${validLogoKiri}" class="logo-kiri" alt="Logo Maluku" />
              <div class="teks-kop">
                  <div style="font-size: 14pt;">PEMERINTAH PROVINSI MALUKU</div>
                  <div style="font-size: 14pt;">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
                  <div style="font-size: 16pt; font-weight: bold;">SMA NEGERI 3 BURU</div>
                  <div style="font-size: 10pt;">Jl. Joyoboyo No. 04 Waekerta, Email: <span style="color: blue; text-decoration: underline;">smanegeri3buru@gmail.com</span> Kode pos 97574</div>
              </div>
              <img src="${validLogoKanan}" class="logo-kanan" alt="Logo SMA 3 Buru" />
          </div>
          <div class="garis-bawah"></div>
          
          <div class="content">${cleanIsiSurat}</div>

          <script>
            function triggerPrint() {
              var imgs = Array.from(document.images);
              if (imgs.length === 0) {
                window.print();
                return;
              }
              Promise.all(imgs.map(function(img) {
                if (img.complete) return Promise.resolve();
                return new Promise(function(resolve) {
                  img.onload = resolve;
                  img.onerror = resolve;
                });
              })).then(function() {
                setTimeout(function() {
                  window.print();
                }, 300);
              });
            }
            if (document.readyState === 'complete') {
              triggerPrint();
            } else {
              window.onload = triggerPrint;
            }
          </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --- FORM RENDERER ---
  const renderDynamicForm = () => {
    const inputStyle = {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      width: "100%",
      marginBottom: "10px",
    };

    switch (formData.jenis_surat) {
      case "Surat Tugas (Individu)":
        return (
          <div
            key="Surat Tugas (Individu)"
            style={{
              backgroundColor: "#f3f4f6",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>📝 Data Pegawai & Tugas</h4>
            <input
              style={inputStyle}
              type="text"
              name="perihal1"
              placeholder="Kalimat Pengantar (Cth: Dengan ini memberikan tugas kepada:)"
              value={dynamicData.perihal1 || ""}
              onChange={handleDynamicChange}
              required
            />
            <hr style={{ margin: "15px 0", borderColor: "#d1d5db" }} />

            {/* --- 1. DROPDOWN NAMA GURU (Bisa pilih dan otomatis isi) --- */}
            <select
              style={inputStyle}
              name="nama"
              value={dynamicData.nama || ""}
              onChange={(e) => {
                // Cari nama pegawai yang dipilih dari database DAFTAR_PEGAWAI
                const selected = DAFTAR_PEGAWAI.find(
                  (p) => p.nama === e.target.value,
                );
                if (selected) {
                  // Jika ketemu, otomatis update state nama, nip, dan pangkat
                  setDynamicData({
                    ...dynamicData,
                    nama: selected.nama,
                    nip: selected.nip !== "-" ? selected.nip : "",
                    pangkat: selected.pangkat !== "-" ? selected.pangkat : "",
                  });
                } else {
                  // Jika kembali ke "Pilih Nama", jalankan onChange biasa
                  handleDynamicChange(e);
                }
              }}
              required
            >
              <option value="">-- Pilih Nama Pegawai --</option>
              {DAFTAR_PEGAWAI.map((pegawai, index) => (
                <option key={index} value={pegawai.nama}>
                  {pegawai.nama}
                </option>
              ))}
            </select>

            {/* --- 2. INPUT NIP (Ditambah value agar bisa terisi otomatis) --- */}
            <input
              style={inputStyle}
              type="text"
              name="nip"
              value={dynamicData.nip || ""}
              placeholder="NIP (Kosongkan jika tidak ada)"
              onChange={handleDynamicChange}
            />

            {/* --- 3. INPUT PANGKAT (Ditambah value agar bisa terisi otomatis) --- */}
            <input
              style={inputStyle}
              type="text"
              name="pangkat"
              value={dynamicData.pangkat || ""}
              placeholder="Pangkat/Golongan (Cth: Penata / IIIc)"
              onChange={handleDynamicChange}
              required
            />

            <input
              style={inputStyle}
              type="text"
              name="jabatan"
              placeholder="Jabatan (Cth: Guru Mata Pelajaran)"
              value={dynamicData.jabatan || ""}
              onChange={handleDynamicChange}
              required
            />
            <input
              style={inputStyle}
              type="text"
              name="alamat"
              placeholder="Alamat (Cth: Waekerta, Kec Waeapo Kab Buru)"
              value={dynamicData.alamat !== undefined ? dynamicData.alamat : "Waekerta, Kec Waeapo Kab Buru"}
              onChange={handleDynamicChange}
            />
            <hr style={{ margin: "15px 0", borderColor: "#d1d5db" }} />
            <textarea
              style={{ ...inputStyle, resize: "vertical" }}
              name="perihal2"
              placeholder="Isi Tugas (Cth: Untuk mengikuti kegiatan sosialisasi pada tanggal...)"
              value={dynamicData.perihal2 || ""}
              rows={3}
              onChange={handleDynamicChange}
              required
            ></textarea>
          </div>
        );
      case "Surat Tugas (Banyak Orang)":
        return (
          <div
            key="Surat Tugas (Banyak Orang)"
            style={{
              backgroundColor: "#f3f4f6",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>
              📝 Data Tugas Kolektif (Banyak Orang)
            </h4>
            <input
              style={inputStyle}
              type="text"
              name="perihal1"
              placeholder="Kalimat Pengantar (Cth: Dengan ini menugaskan nama-nama berikut:)"
              value={dynamicData.perihal1 || ""}
              onChange={handleDynamicChange}
              required
            />
            <hr style={{ margin: "15px 0", borderColor: "#d1d5db" }} />

            <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
              Daftar Peserta Tugas:
            </div>

            {dynamicData.tugas_banyak &&
              dynamicData.tugas_banyak.map((peserta: any, index: any) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "6px",
                    border: "1px solid #e5e7eb",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: "#3b82f6" }}>
                      Peserta {index + 1}
                    </span>
                    {dynamicData.tugas_banyak.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newPeserta = dynamicData.tugas_banyak.filter(
                            (_: any, i: any) => i !== index,
                          );
                          setDynamicData({
                            ...dynamicData,
                            tugas_banyak: newPeserta,
                          });
                        }}
                        style={{
                          color: "red",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ❌ Hapus
                      </button>
                    )}
                  </div>

                  {/* --- 1. DROPDOWN NAMA PESERTA --- */}
                  <select
                    style={inputStyle}
                    name="nama"
                    value={peserta.nama || ""}
                    onChange={(e) => {
                      const selected = DAFTAR_PEGAWAI.find(
                        (p) => p.nama === e.target.value,
                      );
                      const newPeserta = [...dynamicData.tugas_banyak];

                      if (selected) {
                        // Jika nama ada di database, otomatis isi NIP dan Pangkat
                        newPeserta[index].nama = selected.nama;
                        newPeserta[index].nip =
                          selected.nip !== "-" ? selected.nip : "";
                        newPeserta[index].pangkat =
                          selected.pangkat !== "-" ? selected.pangkat : "";
                      } else {
                        // Jika tidak (kembali ke kosong), biarkan kosong
                        newPeserta[index].nama = e.target.value;
                        newPeserta[index].nip = "";
                        newPeserta[index].pangkat = "";
                      }

                      setDynamicData({
                        ...dynamicData,
                        tugas_banyak: newPeserta,
                      });
                    }}
                    required
                  >
                    <option value="">-- Pilih Nama Peserta --</option>
                    {DAFTAR_PEGAWAI.map((pegawai, idx) => (
                      <option key={idx} value={pegawai.nama}>
                        {pegawai.nama}
                      </option>
                    ))}
                  </select>

                  {/* --- 2. INPUT NIP PESERTA (Otomatis Terisi) --- */}
                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="NIP (Kosongkan jika tidak ada)"
                    value={peserta.nip || ""}
                    onChange={(e) => {
                      const newPeserta = [...dynamicData.tugas_banyak];
                      newPeserta[index].nip = e.target.value;
                      setDynamicData({
                        ...dynamicData,
                        tugas_banyak: newPeserta,
                      });
                    }}
                  />

                  {/* --- 3. INPUT PANGKAT PESERTA (Otomatis Terisi) --- */}
                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Pangkat/Golongan"
                    value={peserta.pangkat || ""}
                    onChange={(e) => {
                      const newPeserta = [...dynamicData.tugas_banyak];
                      newPeserta[index].pangkat = e.target.value;
                      setDynamicData({
                        ...dynamicData,
                        tugas_banyak: newPeserta,
                      });
                    }}
                    required
                  />

                  {/* --- 4. INPUT JABATAN PESERTA --- */}
                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Jabatan"
                    value={peserta.jabatan || ""}
                    onChange={(e) => {
                      const newPeserta = [...dynamicData.tugas_banyak];
                      newPeserta[index].jabatan = e.target.value;
                      setDynamicData({
                        ...dynamicData,
                        tugas_banyak: newPeserta,
                      });
                    }}
                    required
                  />

                  {/* --- 5. KETERANGAN TAMBAHAN --- */}
                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Keterangan (Cth: Koordinator, Anggota, dll)"
                    value={peserta.keterangan || ""}
                    onChange={(e) => {
                      const newPeserta = [...dynamicData.tugas_banyak];
                      newPeserta[index].keterangan = e.target.value;
                      setDynamicData({
                        ...dynamicData,
                        tugas_banyak: newPeserta,
                      });
                    }}
                  />
                </div>
              ))}

            {/* --- TOMBOL TAMBAH PESERTA --- */}
            <button
              type="button"
              onClick={() => {
                setDynamicData({
                  ...dynamicData,
                  tugas_banyak: [
                    ...(dynamicData.tugas_banyak || []),
                    {
                      nama: "",
                      nip: "",
                      pangkat: "",
                      jabatan: "",
                      keterangan: "",
                    },
                  ],
                });
              }}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              ➕ Tambah Peserta Baru
            </button>

            <hr style={{ margin: "15px 0", borderColor: "#d1d5db" }} />
            <textarea
              style={{ ...inputStyle, resize: "vertical" }}
              name="perihal2"
              placeholder="Isi Tugas (Cth: Untuk mengikuti kegiatan sosialisasi pada tanggal...)"
              rows={3}
              value={dynamicData.perihal2 || ""}
              onChange={handleDynamicChange}
              required
            ></textarea>
          </div>
        );
      case "Surat Izin":
        return (
          <div
            key="Surat Izin"
            style={{
              backgroundColor: "#f3f4f6",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>
              📝 Data Pegawai & Keterangan Izin
            </h4>

            {/* --- 1. DROPDOWN NAMA GURU (Bisa pilih dan otomatis isi) --- */}
            <select
              style={inputStyle}
              name="nama"
              value={dynamicData.nama || ""}
              onChange={(e) => {
                // Cari nama pegawai dari database
                const selected = DAFTAR_PEGAWAI.find(
                  (p) => p.nama === e.target.value,
                );
                if (selected) {
                  setDynamicData({
                    ...dynamicData,
                    nama: selected.nama,
                    nip: selected.nip !== "-" ? selected.nip : "",
                    pangkat: selected.pangkat !== "-" ? selected.pangkat : "",
                  });
                } else {
                  handleDynamicChange(e);
                }
              }}
              required
            >
              <option value="">-- Pilih Nama Pegawai --</option>
              {DAFTAR_PEGAWAI.map((pegawai, index) => (
                <option key={index} value={pegawai.nama}>
                  {pegawai.nama}
                </option>
              ))}
            </select>

            {/* --- 2. INPUT NIP (Otomatis Terisi) --- */}
            <input
              style={inputStyle}
              type="text"
              name="nip"
              value={dynamicData.nip || ""}
              placeholder="NIP (Kosongkan jika tidak ada)"
              onChange={handleDynamicChange}
            />

            {/* --- 3. INPUT PANGKAT (Otomatis Terisi) --- */}
            <input
              style={inputStyle}
              type="text"
              name="pangkat"
              value={dynamicData.pangkat || ""}
              placeholder="Pangkat/Golongan (Cth: Penata / IIIc)"
              onChange={handleDynamicChange}
              required
            />

            <input
              style={inputStyle}
              type="text"
              name="jabatan"
              placeholder="Jabatan (Cth: Guru)"
              value={dynamicData.jabatan || ""}
              onChange={handleDynamicChange}
              required
            />

            <input
              style={inputStyle}
              type="text"
              name="alamat"
              placeholder="Alamat (Cth: Waekerta, Kec. Waeapo Kab. Buru)"
              value={dynamicData.alamat || ""}
              onChange={handleDynamicChange}
              required
            />

            <hr style={{ margin: "15px 0", borderColor: "#d1d5db" }} />

            {/* KETERANGAN IZIN */}
            <textarea
              style={{ ...inputStyle, resize: "vertical" }}
              name="perihal2"
              placeholder="Alasan Izin (Cth: Untuk keperluan keluarga pada tanggal 15 sampai dengan 16 Juli 2026 di Ambon)"
              rows={3}
              value={dynamicData.perihal2 || ""}
              onChange={handleDynamicChange}
              required
            ></textarea>
          </div>
        );
      // --- FORM SURAT PENGANTAR (SK BERKALA) ---
      case "Surat Pengantar (SK Berkala)":
        return (
          <div
            key="Surat Pengantar (SK Berkala)"
            style={{
              backgroundColor: "#f3f4f6",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>📝 Data Usulan SK Berkala</h4>

            <select
              style={inputStyle}
              name="nama"
              value={dynamicData.nama || ""}
              onChange={(e) => {
                const selected = DAFTAR_PEGAWAI.find(
                  (p) => p.nama === e.target.value,
                );
                setDynamicData({
                  ...dynamicData,
                  nama: selected ? selected.nama : e.target.value,
                });
              }}
              required
            >
              <option value="">-- Pilih Pegawai yang Diusulkan --</option>
              {DAFTAR_PEGAWAI.map((pegawai, index) => (
                <option key={index} value={pegawai.nama}>
                  {pegawai.nama}
                </option>
              ))}
            </select>
          </div>
        );

      // --- FORM SURAT PENGANTAR (PAK) ---
      case "Surat Pengantar (PAK)":
        return (
          <div
            key="Surat Pengantar (PAK)"
            style={{
              backgroundColor: "#f3f4f6",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>
              📝 Data Usulan PAK (Banyak Orang)
            </h4>

            <hr style={{ margin: "15px 0", borderColor: "#d1d5db" }} />

            <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
              Daftar Pegawai yang Diusulkan:
            </div>

            {/* Tabel Input Banyak Orang untuk PAK */}
            {dynamicData.peserta_pak &&
              dynamicData.peserta_pak.map((peserta: any, index: any) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "6px",
                    border: "1px solid #e5e7eb",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: "#3b82f6" }}>
                      Pegawai {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newPeserta = dynamicData.peserta_pak.filter(
                          (_: any, i: any) => i !== index,
                        );
                        setDynamicData({
                          ...dynamicData,
                          peserta_pak: newPeserta,
                        });
                      }}
                      style={{
                        color: "red",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      ❌ Hapus
                    </button>
                  </div>

                  <select
                    style={inputStyle}
                    name="nama"
                    value={peserta.nama || ""}
                    onChange={(e) => {
                      const selected = DAFTAR_PEGAWAI.find(
                        (p) => p.nama === e.target.value,
                      );
                      const newPeserta = [...dynamicData.peserta_pak];
                      if (selected) {
                        newPeserta[index].nama = selected.nama;
                        newPeserta[index].nip =
                          selected.nip !== "-" ? selected.nip : "";
                      } else {
                        newPeserta[index].nama = e.target.value;
                      }
                      setDynamicData({
                        ...dynamicData,
                        peserta_pak: newPeserta,
                      });
                    }}
                    required
                  >
                    <option value="">-- Pilih Pegawai --</option>
                    {DAFTAR_PEGAWAI.map((peg, idx) => (
                      <option key={idx} value={peg.nama}>
                        {peg.nama}
                      </option>
                    ))}
                  </select>

                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="NIP (Terisi Otomatis)"
                    value={peserta.nip || ""}
                    onChange={(e) => {
                      const newPeserta = [...dynamicData.peserta_pak];
                      newPeserta[index].nip = e.target.value;
                      setDynamicData({
                        ...dynamicData,
                        peserta_pak: newPeserta,
                      });
                    }}
                  />
                </div>
              ))}

            <button
              type="button"
              onClick={() => {
                setDynamicData({
                  ...dynamicData,
                  peserta_pak: [
                    ...(dynamicData.peserta_pak || []),
                    { nama: "", nip: "" },
                  ],
                });
              }}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ➕ Tambah Pegawai
            </button>
          </div>
        );
      case "Surat Tidak Ada SKHUN":
        return (
          <div
            key="Surat Tidak Ada SKHUN"
            style={{
              backgroundColor: "#f3f4f6",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>📝 Data Siswa</h4>
            <input
              style={inputStyle}
              type="text"
              name="nama"
              placeholder="Nama Siswa"
              value={dynamicData.nama || ""}
              onChange={handleDynamicChange}
              required
            />
            <input
              style={inputStyle}
              type="text"
              name="nisn"
              placeholder="NISN"
              value={dynamicData.nisn || ""}
              onChange={handleDynamicChange}
              required
            />
            <input
              style={inputStyle}
              type="text"
              name="npsn"
              placeholder="NPSN (Default: 60101015)"
              value={dynamicData.npsn !== undefined ? dynamicData.npsn : "60101015"}
              onChange={handleDynamicChange}
            />
            <input
              style={inputStyle}
              type="text"
              name="ttl"
              placeholder="Tempat, Tanggal Lahir"
              value={dynamicData.ttl || ""}
              onChange={handleDynamicChange}
              required
            />
            <input
              style={inputStyle}
              type="text"
              name="alamat"
              placeholder="Alamat Siswa"
              value={dynamicData.alamat || ""}
              onChange={handleDynamicChange}
              required
            />
            <hr style={{ margin: "15px 0", borderColor: "#d1d5db" }} />
            <input
              style={inputStyle}
              type="text"
              name="tahun_ajaran"
              placeholder="Tahun Pelajaran (Default: 2025/2026)"
              value={dynamicData.tahun_ajaran !== undefined ? dynamicData.tahun_ajaran : "2025/2026"}
              onChange={handleDynamicChange}
            />
          </div>
        );
      // --- FORM REKAPITULASI ABSEN ---
      case "Rekapitulasi Absen":
        return (
          <div
            key="Rekapitulasi Absen"
            style={{
              backgroundColor: "#f3f4f6",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>📝 Data Rekapitulasi Absen</h4>

            <input
              style={inputStyle}
              type="text"
              name="periode_bulan"
              placeholder="Periode Bulan (Cth: Januari 2025 - Desember 2025)"
              value={dynamicData.periode_bulan || ""}
              onChange={handleDynamicChange}
              required
            />

            <hr style={{ margin: "15px 0", borderColor: "#d1d5db" }} />
            <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
              Data Pegawai:
            </div>

            {/* Dropdown Nama Pintar */}
            <select
              style={inputStyle}
              name="nama"
              value={dynamicData.nama || ""}
              onChange={(e) => {
                const selected = DAFTAR_PEGAWAI.find(
                  (p) => p.nama === e.target.value,
                );
                setDynamicData({
                  ...dynamicData,
                  nama: selected ? selected.nama : e.target.value,
                  nip: selected && selected.nip !== "-" ? selected.nip : "",
                  pangkat:
                    selected && selected.pangkat !== "-"
                      ? selected.pangkat
                      : "",
                });
              }}
              required
            >
              <option value="">-- Pilih Pegawai --</option>
              {DAFTAR_PEGAWAI.map((pegawai, index) => (
                <option key={index} value={pegawai.nama}>
                  {pegawai.nama}
                </option>
              ))}
            </select>

            <input
              style={inputStyle}
              type="text"
              name="nip"
              value={dynamicData.nip || ""}
              placeholder="NIP (Otomatis)"
              onChange={handleDynamicChange}
            />
            <input
              style={inputStyle}
              type="text"
              name="pangkat"
              value={dynamicData.pangkat || ""}
              placeholder="Pangkat/Gol (Otomatis)"
              onChange={handleDynamicChange}
            />
            <input
              style={inputStyle}
              type="text"
              name="jabatan"
              placeholder="Jabatan (Cth: Guru)"
              value={dynamicData.jabatan || ""}
              onChange={handleDynamicChange}
              required
            />

            <hr style={{ margin: "15px 0", borderColor: "#d1d5db" }} />
            <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
              Detail Kehadiran:
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                type="text"
                name="jumlah_hari_kerja"
                placeholder="Jml Hari Kerja (Cth: 268)"
                value={dynamicData.jumlah_hari_kerja || ""}
                onChange={handleDynamicChange}
                required
              />
              <input
                style={{ ...inputStyle, flex: 1 }}
                type="text"
                name="jumlah_kehadiran"
                placeholder="Jml Kehadiran (Cth: 268)"
                value={dynamicData.jumlah_kehadiran || ""}
                onChange={handleDynamicChange}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                type="text"
                name="absen_a"
                placeholder="Alpa (A) Cth: -"
                value={dynamicData.absen_a || ""}
                onChange={handleDynamicChange}
              />
              <input
                style={{ ...inputStyle, flex: 1 }}
                type="text"
                name="absen_s"
                placeholder="Sakit (S) Cth: -"
                value={dynamicData.absen_s || ""}
                onChange={handleDynamicChange}
              />
              <input
                style={{ ...inputStyle, flex: 1 }}
                type="text"
                name="absen_i"
                placeholder="Izin (I) Cth: -"
                value={dynamicData.absen_i || ""}
                onChange={handleDynamicChange}
              />
            </div>

            <input
              style={inputStyle}
              type="text"
              name="keterangan_absen"
              placeholder="Keterangan (Boleh dikosongkan)"
              value={dynamicData.keterangan_absen || ""}
              onChange={handleDynamicChange}
            />
          </div>
        );
      case "Berita Acara Dana BOSP":
        return (
          <div
            key="Berita Acara Dana BOSP"
            style={{
              backgroundColor: "#f3f4f6",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>📝 Data Pencairan BOSP</h4>
            <div
              style={{
                color: "#4b5563",
                fontSize: "12px",
                marginBottom: "10px",
              }}
            >
              *Data Kepala Sekolah & Bendahara sudah otomatis terisi.
            </div>
            <input
              style={inputStyle}
              type="text"
              name="hari_tanggal"
              placeholder="Hari & Tanggal Pencairan (Cth: Rabu 24 Juni 2026)"
              value={dynamicData.hari_tanggal || ""}
              onChange={handleDynamicChange}
              required
            />
            <input
              style={inputStyle}
              type="text"
              name="tahap"
              placeholder="Tahap & Periode (Cth: I ( Januari - Juni 2026))"
              value={dynamicData.tahap || ""}
              onChange={handleDynamicChange}
              required
            />
            <input
              style={inputStyle}
              type="text"
              name="bank"
              placeholder="Nama Bank (Cth: Bank maluku Unit Mako)"
              value={dynamicData.bank !== undefined ? dynamicData.bank : "Bank maluku Unit Mako"}
              onChange={handleDynamicChange}
              required
            />
            <hr style={{ margin: "15px 0", borderColor: "#d1d5db" }} />
            <input
              style={inputStyle}
              type="text"
              name="jumlah_angka"
              placeholder="Jumlah Angka (Cth: 58.405.000)"
              value={dynamicData.jumlah_angka || ""}
              onChange={handleDynamicChange}
              required
            />
            <input
              style={inputStyle}
              type="text"
              name="jumlah_terbilang"
              placeholder="Terbilang (Cth: Lima Puluh Delapan Juta Empat Ratus Lima Ribu)"
              value={dynamicData.jumlah_terbilang || ""}
              onChange={handleDynamicChange}
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  const filteredSurat = suratList.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (s.no_surat && s.no_surat.toLowerCase().includes(term)) ||
      (s.tujuan && s.tujuan.toLowerCase().includes(term)) ||
      (s.perihal && s.perihal.toLowerCase().includes(term)) ||
      (s.jenis_surat && s.jenis_surat.toLowerCase().includes(term));
    const matchJenis = filterJenis === "ALL" || s.jenis_surat === filterJenis;
    return matchSearch && matchJenis;
  });

  return (
    <div className="space-y-5">
      {/* Header Bar */}
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
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Arsip & Generator Surat Keluar
            </h2>
            <p className="text-xs text-slate-500">
              Pembuatan otomatis, cetak kop resmi (12pt Times New Roman), dan arsip surat keluar
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Filter Jenis */}
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Semua Jenis Surat</option>
            <option value="Surat Tugas (Individu)">Surat Tugas (Individu)</option>
            <option value="Surat Tugas (Banyak Orang)">Surat Tugas (Kolektif)</option>
            <option value="Surat Izin">Surat Izin</option>
            <option value="Surat Tidak Ada SKHUN">Surat Keterangan SKHUN</option>
            <option value="Berita Acara Dana BOSP">Berita Acara BOSP</option>
            <option value="Surat Pengantar (SK Berkala)">Pengantar SK Berkala</option>
            <option value="Surat Pengantar (PAK)">Pengantar PAK</option>
            <option value="Rekapitulasi Absen">Rekapitulasi Absen</option>
          </select>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari surat keluar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Surat Keluar</span>
          </button>
        </div>
      </div>

      {/* Tabel Data Surat Keluar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nomor & Tanggal Surat</th>
                <th className="py-3.5 px-4">Tujuan / Penerima</th>
                <th className="py-3.5 px-4">Jenis Surat</th>
                <th className="py-3.5 px-4">Perihal Surat</th>
                <th className="py-3.5 px-4 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Send className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">
                        {searchTerm || filterJenis !== "ALL"
                          ? "Tidak ada surat yang sesuai kriteria filter"
                          : "Belum ada arsip surat keluar"}
                      </p>
                      <p className="text-xs text-slate-400">
                        Klik tombol &ldquo;Buat Surat Keluar&rdquo; untuk mencetak dan mengarsipkan surat baru.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSurat.map((surat, index) => (
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
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {surat.tujuan || "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-lg text-[11px] font-semibold inline-block">
                        {surat.jenis_surat || "Surat Keluar"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate" title={surat.perihal}>
                      {surat.perihal || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {surat.isi_surat && (
                          <button
                            onClick={() => handleCetak(surat.isi_surat)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                            title="Cetak Surat Resmi"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Cetak</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(surat.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Surat Keluar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              width: "95%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3
              style={{
                marginBottom: "16px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Buat Surat Keluar Baru
            </h3>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <select
                name="jenis_surat"
                value={formData.jenis_surat || ""}
                onChange={handleChange}
                required
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #3b82f6",
                  backgroundColor: "#eff6ff",
                  cursor: "pointer",
                  fontWeight: "bold",
                  outline: "none",
                }}
              >
                <option value="">-- Pilih Jenis Surat --</option>
                <option value="Surat Tugas (Individu)">
                  Surat Tugas (Individu - 1 Orang)
                </option>
                <option value="Surat Tugas (Banyak Orang)">
                  Surat Tugas (Banyak Orang - Sesuai Undangan)
                </option>
                <option value="Surat Izin">Surat Izin</option>
                <option value="Surat Tidak Ada SKHUN">
                  Surat Tidak Ada SKHUN
                </option>
                <option value="Berita Acara Dana BOSP">
                  Berita Acara Dana BOSP
                </option>
                <option value="Surat Pengantar (SK Berkala)">
                  Surat Pengantar (SK Berkala)
                </option>
                <option value="Surat Pengantar (PAK)">
                  Surat Pengantar (PAK)
                </option>
                <option value="Rekapitulasi Absen">Rekapitulasi Absen</option>
              </select>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px",
                }}
              >
                <div>
                  <label style={{ fontSize: "12px" }}>
                    Nomor Surat (Cth: 034)
                  </label>
                  <input
                    type="text"
                    name="no_surat"
                    placeholder="Cth: 034"
                    value={formData.no_surat || ""}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      width: "100%",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px" }}>
                    Tahun Surat (Otomatis)
                  </label>
                  <input
                    type="text"
                    name="tahun_surat"
                    value={formData.tahun_surat || new Date().getFullYear().toString()}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      width: "100%",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px" }}>Tanggal Surat</label>
                  <input
                    type="date"
                    name="tgl_surat"
                    value={formData.tgl_surat || ""}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      width: "100%",
                    }}
                  />
                </div>
                <div style={{ gridColumn: "span 3" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>
                      Tujuan Surat
                    </label>
                    <span style={{ fontSize: "11px", color: "#059669", backgroundColor: "#ecfdf5", padding: "2px 8px", borderRadius: "9999px", fontWeight: "500", border: "1px solid #a7f3d0" }}>
                      ⚡ Otomatis oleh Sistem
                    </span>
                  </div>
                  <input
                    type="text"
                    name="tujuan"
                    placeholder="Otomatis terisi saat memilih jenis surat / data formulir..."
                    value={formData.tujuan || ""}
                    onChange={handleChange}
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #93c5fd",
                      backgroundColor: "#f8fafc",
                      color: "#1e293b",
                      fontWeight: "500",
                      width: "100%",
                    }}
                  />
                </div>
                <div style={{ gridColumn: "span 3" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>
                      Perihal Surat
                    </label>
                    <span style={{ fontSize: "11px", color: "#059669", backgroundColor: "#ecfdf5", padding: "2px 8px", borderRadius: "9999px", fontWeight: "500", border: "1px solid #a7f3d0" }}>
                      ⚡ Otomatis oleh Sistem
                    </span>
                  </div>
                  <input
                    type="text"
                    name="perihal"
                    placeholder="Otomatis terisi saat memilih jenis surat / data formulir..."
                    value={formData.perihal || ""}
                    onChange={handleChange}
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #93c5fd",
                      backgroundColor: "#f8fafc",
                      color: "#1e293b",
                      fontWeight: "500",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              {renderDynamicForm()}

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Simpan Surat
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};



