'use client';

import React from 'react';
import { profilSekolah } from '@/data/mockData';
import { LOGO_MALUKU_BASE64, LOGO_SMA3BURU_BASE64 } from '@/lib/logos';

export type TipeSuratResmi = 'SKHUN' | 'IZIN' | 'TUGAS_SATUAN' | 'TUGAS_BANYAK' | 'PAK';

export interface DataSuratSkhun {
  nomorSurat: string;
  namaSiswa: string;
  nisn: string;
  npsn: string;
  tempatTglLahir: string;
  alamatSiswa: string;
  tahunPelajaran: string;
  tanggalSurat: string;
}

export interface DataSuratIzin {
  nomorSurat: string;
  namaPegawai: string;
  nipPegawai: string;
  pangkatGolongan: string;
  jabatan: string;
  alamatPegawai: string;
  keperluanIzin: string;
  tanggalMulaiSelesai: string;
  tanggalSurat: string;
}

export interface DataSuratTugasSatuan {
  nomorSurat: string;
  namaPegawai: string;
  nipPegawai: string;
  pangkatGolongan: string;
  jabatan: string;
  alamatPegawai: string;
  uraianTugas: string;
  tanggalTugas: string;
  tempatTugas: string;
  tanggalSurat: string;
}

export interface DataSuratTugasBanyak {
  nomorSurat: string;
  daftarPeserta: Array<{
    no: number;
    nama: string;
    nip: string;
    pangkatGolongan: string;
    jabatan: string;
    alamat: string;
  }>;
  keperluanTugas: string;
  tanggalSurat: string;
}

export interface DataSuratPak {
  nomorSurat: string;
  tujuanSurat: string;
  kotaTujuan: string;
  namaPegawaiPak: string;
  nipPegawaiPak: string;
  banyaknya: string;
  keterangan: string;
  tanggalSurat: string;
  isPlt: boolean;
}

interface CetakSuratResmiProps {
  tipe: TipeSuratResmi;
  dataSkhun?: DataSuratSkhun;
  dataIzin?: DataSuratIzin;
  dataTugasSatuan?: DataSuratTugasSatuan;
  dataTugasBanyak?: DataSuratTugasBanyak;
  dataPak?: DataSuratPak;
  isEditable?: boolean;
  onUpdateSkhun?: (data: DataSuratSkhun) => void;
  onUpdateIzin?: (data: DataSuratIzin) => void;
  onUpdateTugasSatuan?: (data: DataSuratTugasSatuan) => void;
  onUpdateTugasBanyak?: (data: DataSuratTugasBanyak) => void;
  onUpdatePak?: (data: DataSuratPak) => void;
  logoKiriUrl?: string | null;
  logoKananUrl?: string | null;
  logoKiriSize?: number;
  logoKananSize?: number;
}

// Komponen Pembantu: Inline Editable Text
function InsetText({
  value,
  onChange,
  className = '',
  isBold = false,
  isUnderline = false
}: {
  value: string;
  onChange?: (val: string) => void;
  className?: string;
  isBold?: boolean;
  isUnderline?: boolean;
}) {
  if (!onChange) {
    return (
      <span className={`${isBold ? 'font-bold' : ''} ${isUnderline ? 'underline' : ''} ${className}`}>
        {value}
      </span>
    );
  }

  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const text = e.currentTarget.textContent || '';
        if (text !== value) {
          onChange(text);
        }
      }}
      className={`outline-none hover:bg-amber-100/60 focus:bg-amber-100 focus:ring-1 focus:ring-blue-400 rounded px-0.5 transition-colors cursor-text print:hover:bg-transparent print:focus:bg-transparent print:focus:ring-0 ${
        isBold ? 'font-bold' : ''
      } ${isUnderline ? 'underline' : ''} ${className}`}
      title="Klik untuk mengedit langsung di kertas"
    >
      {value}
    </span>
  );
}

// Logo SMA Negeri 3 Buru Resmi (Vector)
function LogoSma3BuruVector() {
  return (
    <svg viewBox="0 0 100 120" className="w-[80px] h-[96px] ml-auto drop-shadow-xs" aria-label="Logo SMA Negeri 3 Buru">
      {/* Perisai Biru */}
      <path
        d="M 50 2 C 78 2 96 15 96 40 C 96 85 50 116 50 118 C 50 116 4 85 4 40 C 4 15 22 2 50 2 Z"
        fill="#1e3a8a"
        stroke="#facc15"
        strokeWidth="3"
      />
      {/* Pita Atas */}
      <path
        d="M 20 22 C 35 15 65 15 80 22 C 82 28 82 32 80 34 C 65 27 35 27 20 34 Z"
        fill="#ffffff"
      />
      <text x="50" y="27" textAnchor="middle" fill="#1e3a8a" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
        SMA NEGERI
      </text>
      <text x="50" y="38" textAnchor="middle" fill="#facc15" fontSize="13" fontWeight="900" fontFamily="sans-serif">
        3
      </text>

      {/* Daun Sayap Hijau */}
      <path
        d="M 22 62 C 16 50 26 38 34 46 C 26 56 30 70 36 78 C 30 76 24 70 22 62 Z"
        fill="#22c55e"
      />
      <path
        d="M 78 62 C 84 50 74 38 66 46 C 74 56 70 70 64 78 C 70 76 76 70 78 62 Z"
        fill="#22c55e"
      />

      {/* Obor Kuning Emas */}
      <path
        d="M 47 48 L 53 48 L 52 75 L 48 75 Z"
        fill="#f59e0b"
      />
      <path
        d="M 50 38 C 45 42 45 46 50 50 C 55 46 55 42 50 38 Z"
        fill="#ef4444"
      />

      {/* Pita Bawah BURU */}
      <path
        d="M 22 88 L 78 88 L 84 98 L 76 96 L 50 99 L 24 96 L 16 98 Z"
        fill="#ffffff"
        stroke="#1e3a8a"
        strokeWidth="1.5"
      />
      <text x="50" y="95" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">
        BURU
      </text>
    </svg>
  );
}

export default function CetakSuratResmi({
  tipe,
  dataSkhun,
  dataIzin,
  dataTugasSatuan,
  dataTugasBanyak,
  dataPak,
  isEditable = false,
  onUpdateSkhun,
  onUpdateIzin,
  onUpdateTugasSatuan,
  onUpdateTugasBanyak,
  onUpdatePak,
  logoKiriUrl,
  logoKananUrl,
  logoKiriSize = 82,
  logoKananSize = 82
}: CetakSuratResmiProps) {
  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 1.5cm 2cm;
          }
        }
      `}</style>
      <div className="bg-white text-black font-['Arial',_Helvetica,_sans-serif] text-[12pt] leading-[1.5] p-[1.5cm_2cm] w-[210mm] min-h-[297mm] mx-auto box-border shadow-[0_0_10px_rgba(0,0,0,0.3)] print:shadow-none print:m-0 print:p-0 print:w-full print:min-h-0 relative selection:bg-amber-200">
        {/* ======================================================== */}
        {/* KOP SURAT RESMI SMA NEGERI 3 BURU */}
        {/* ======================================================== */}
        <div className="border-b-[4px] border-double border-black pb-1 mb-[20px]">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              {/* Logo Provinsi Maluku */}
              <td className="w-[15%] align-middle">
                <div className="flex items-center justify-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoKiriUrl || LOGO_MALUKU_BASE64}
                    alt="Logo Kiri"
                    style={{ height: `${logoKiriSize}px`, width: 'auto' }}
                    className="drop-shadow-xs object-contain max-w-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = LOGO_MALUKU_BASE64;
                    }}
                  />
                </div>
              </td>

              {/* Teks Kop Resmi */}
              <td className="w-[70%] text-center align-middle">
                <div className="text-[14pt] text-black">PEMERINTAH PROVINSI MALUKU</div>
                <div className="text-[14pt] text-black">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
                <div className="text-[16pt] font-bold my-0.5 text-black">SMA NEGERI 3 BURU</div>
                <div className="text-[10pt] leading-tight text-black">
                  Jl. Joyoboyo No. 04 Waekerta, Email: <span className="text-blue-700 underline">smanegeri3buru@gmail.com</span> Kode pos 97574
                </div>
              </td>

              {/* Logo Kanan */}
              <td className="w-[15%] align-middle">
                <div className="flex items-center justify-end">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoKananUrl || LOGO_SMA3BURU_BASE64}
                    alt="Logo SMA Negeri 3 Buru"
                    style={{ height: `${logoKananSize}px`, width: 'auto' }}
                    className="drop-shadow-xs object-contain max-w-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = LOGO_SMA3BURU_BASE64;
                    }}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ======================================================== */}
      {/* TEMPLATE 1: SURAT KETERANGAN TIDAK MEMILIKI SKHUN */}
      {/* ======================================================== */}
      {tipe === 'SKHUN' && dataSkhun && (
        <div>
          <div className="text-center my-6">
            <h2 className="text-[13pt] font-bold underline uppercase tracking-wider m-0">
              SURAT KETERANGAN
            </h2>
            <p className="text-[12pt] mt-1">
              Nomor :{' '}
              <InsetText
                value={dataSkhun.nomorSurat}
                onChange={onUpdateSkhun ? (val) => onUpdateSkhun({ ...dataSkhun, nomorSurat: val }) : undefined}
                className="font-medium"
              />
            </p>
          </div>

          <p className="mb-3">Yang bertanda tangan dibawah ini Kepala SMA Negeri 3 Buru</p>

          <table className="w-full ml-4 mb-4 text-[12pt]">
            <tbody>
              <tr>
                <td className="w-[28%] py-0.5">N a m a</td>
                <td className="w-[3%] py-0.5">:</td>
                <td className="w-[69%] py-0.5 font-bold">{profilSekolah.kepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-0.5">N i p</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">{profilSekolah.nipKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-0.5">Pangkat / Golongan</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">{profilSekolah.pangkatKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-0.5">Jabatan</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">{profilSekolah.jabatanKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-0.5">Alamat</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">{profilSekolah.alamatKepalaSekolah}</td>
              </tr>
            </tbody>
          </table>

          <p className="mb-3">Dengan ini menerangkan bahwa</p>

          <table className="w-full ml-4 mb-5 text-[12pt]">
            <tbody>
              <tr>
                <td className="w-[28%] py-0.5">Nama</td>
                <td className="w-[3%] py-0.5">:</td>
                <td className="w-[69%] py-0.5 font-bold uppercase">
                  <InsetText
                    value={dataSkhun.namaSiswa}
                    onChange={onUpdateSkhun ? (val) => onUpdateSkhun({ ...dataSkhun, namaSiswa: val.toUpperCase() }) : undefined}
                    isBold
                  />
                </td>
              </tr>
              <tr>
                <td className="py-0.5">NISN</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">
                  <InsetText
                    value={dataSkhun.nisn}
                    onChange={onUpdateSkhun ? (val) => onUpdateSkhun({ ...dataSkhun, nisn: val }) : undefined}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-0.5">NPSN</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">
                  <InsetText
                    value={dataSkhun.npsn}
                    onChange={onUpdateSkhun ? (val) => onUpdateSkhun({ ...dataSkhun, npsn: val }) : undefined}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-0.5">Tempat Tgl Lahir</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">
                  <InsetText
                    value={dataSkhun.tempatTglLahir}
                    onChange={onUpdateSkhun ? (val) => onUpdateSkhun({ ...dataSkhun, tempatTglLahir: val }) : undefined}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-0.5">Alamat</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">
                  <InsetText
                    value={dataSkhun.alamatSiswa}
                    onChange={onUpdateSkhun ? (val) => onUpdateSkhun({ ...dataSkhun, alamatSiswa: val }) : undefined}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-justify leading-relaxed mb-4">
            Adalah benar – benar tidak memiliki SKHUN, mengingat Tahun Pelajaran{' '}
            <InsetText
              value={dataSkhun.tahunPelajaran}
              onChange={onUpdateSkhun ? (val) => onUpdateSkhun({ ...dataSkhun, tahunPelajaran: val }) : undefined}
            />{' '}
            Ujian Nasional telah ditiadakan oleh Menteri Pendidikan.
          </p>

          <p className="text-justify leading-relaxed mb-12">
            Demikian Surat Keterangan ini dibuat dan diberikan untuk dapat dipergunakan sebagaimana mestinya
          </p>

          {/* Tanda Tangan */}
          <div className="w-[48%] ml-auto text-left text-[12pt] space-y-1">
            <div className="flex">
              <span className="w-32">Diberikan di</span>
              <span>: Waekerta</span>
            </div>
            <div className="flex">
              <span className="w-32">Pada Tanggal</span>
              <span>
                :{' '}
                <InsetText
                  value={dataSkhun.tanggalSurat}
                  onChange={onUpdateSkhun ? (val) => onUpdateSkhun({ ...dataSkhun, tanggalSurat: val }) : undefined}
                />
              </span>
            </div>
            <div className="pt-2 text-center">
              <div>Kepala Sekolah</div>
              <div className="h-24"></div>
              <div className="font-bold underline">{profilSekolah.kepalaSekolah}</div>
              <div>Nip. {profilSekolah.nipKepalaSekolah}</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TEMPLATE 2: SURAT IZIN GURU / PEGAWAI */}
      {/* ======================================================== */}
      {tipe === 'IZIN' && dataIzin && (
        <div>
          <div className="text-center my-6">
            <h2 className="text-[13pt] font-bold underline tracking-wider m-0">
              SURAT IZIN
            </h2>
            <p className="text-[12pt] mt-1">
              Nomor :{' '}
              <InsetText
                value={dataIzin.nomorSurat}
                onChange={onUpdateIzin ? (val) => onUpdateIzin({ ...dataIzin, nomorSurat: val }) : undefined}
              />
            </p>
          </div>

          <p className="mb-3">Yang bertanda tangan dibawah ini Kepala SMA Negeri 3 Buru</p>

          <table className="w-full ml-[1.5cm] mb-4 text-[12pt]">
            <tbody>
              <tr>
                <td className="w-[30%] py-[1px]">N a m a</td>
                <td className="w-[3%] py-[1px]">:</td>
                <td className="w-[67%] py-[1px] font-bold">{profilSekolah.kepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-[1px]">N i p</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">{profilSekolah.nipKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-[1px]">Pangkat / Golongan</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">{profilSekolah.pangkatKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-[1px]">Jabatan</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">{profilSekolah.jabatanKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-[1px]">Alamat</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">{profilSekolah.alamatKepalaSekolah}</td>
              </tr>
            </tbody>
          </table>

          <p className="mb-3">Dengan ini Mengizinkan</p>

          <table className="w-full ml-[1.5cm] mb-5 text-[12pt]">
            <tbody>
              <tr>
                <td className="w-[30%] py-[1px]">Nama</td>
                <td className="w-[3%] py-[1px]">:</td>
                <td className="w-[67%] py-[1px] font-bold">
                  <InsetText
                    value={dataIzin.namaPegawai}
                    onChange={onUpdateIzin ? (val) => onUpdateIzin({ ...dataIzin, namaPegawai: val }) : undefined}
                    isBold
                  />
                </td>
              </tr>
              <tr>
                <td className="py-[1px]">Nip</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">
                  <InsetText
                    value={dataIzin.nipPegawai}
                    onChange={onUpdateIzin ? (val) => onUpdateIzin({ ...dataIzin, nipPegawai: val }) : undefined}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-[1px]">Pangkat/Golongan</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">
                  <InsetText
                    value={dataIzin.pangkatGolongan}
                    onChange={onUpdateIzin ? (val) => onUpdateIzin({ ...dataIzin, pangkatGolongan: val }) : undefined}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-[1px]">Jabatan</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">
                  <InsetText
                    value={dataIzin.jabatan}
                    onChange={onUpdateIzin ? (val) => onUpdateIzin({ ...dataIzin, jabatan: val }) : undefined}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-[1px]">Alamat</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">
                  <InsetText
                    value={dataIzin.alamatPegawai}
                    onChange={onUpdateIzin ? (val) => onUpdateIzin({ ...dataIzin, alamatPegawai: val }) : undefined}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-justify leading-[1.5] mb-4 text-[12pt]">
            Untuk <InsetText
              value={dataIzin.keperluanIzin}
              onChange={onUpdateIzin ? (val) => onUpdateIzin({ ...dataIzin, keperluanIzin: val }) : undefined}
            /> pada tanggal{' '}
            <InsetText
              value={dataIzin.tanggalMulaiSelesai}
              onChange={onUpdateIzin ? (val) => onUpdateIzin({ ...dataIzin, tanggalMulaiSelesai: val }) : undefined}
            />
          </div>

          <div className="text-justify leading-[1.5] mb-12 text-[12pt]">
            Demikian Surat izin ini dibuat dan diberikan untuk dapat dipergunakan sebagaimana mestinya
          </div>

          {/* Tanda Tangan */}
          <div className="w-[50%] ml-auto text-left text-[12pt] space-y-1 pr-8">
            <div className="flex">
              <span className="w-[45%]">Diberikan di</span>
              <span className="w-[55%]">: Waekerta</span>
            </div>
            <div className="flex">
              <span className="w-[45%]">Pada Tanggal</span>
              <span className="w-[55%]">
                :{' '}
                <InsetText
                  value={dataIzin.tanggalSurat}
                  onChange={onUpdateIzin ? (val) => onUpdateIzin({ ...dataIzin, tanggalSurat: val }) : undefined}
                />
              </span>
            </div>
            <div className="pt-4 text-center">
              <div>Kepala Sekolah</div>
              <div className="h-24"></div>
              <div className="font-bold underline">{profilSekolah.kepalaSekolah}</div>
              <div>Nip. {profilSekolah.nipKepalaSekolah}</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TEMPLATE 3: SURAT TUGAS PERORANGAN */}
      {/* ======================================================== */}
      {tipe === 'TUGAS_SATUAN' && dataTugasSatuan && (
        <div>
          <div className="text-center my-6">
            <h2 className="text-[13pt] font-bold underline tracking-wider m-0">
              SURAT TUGAS
            </h2>
            <p className="text-[12pt] mt-1">
              Nomor :{' '}
              <InsetText
                value={dataTugasSatuan.nomorSurat}
                onChange={onUpdateTugasSatuan ? (val) => onUpdateTugasSatuan({ ...dataTugasSatuan, nomorSurat: val }) : undefined}
              />
            </p>
          </div>

          <p className="mb-3">Yang bertanda tangan dibawah ini Kepala SMA Negeri 3 Buru</p>

          <table className="w-full ml-[1.5cm] mb-4 text-[12pt]">
            <tbody>
              <tr>
                <td className="w-[30%] py-[1px]">N a m a</td>
                <td className="w-[3%] py-[1px]">:</td>
                <td className="w-[67%] py-[1px] font-bold">{profilSekolah.kepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-[1px]">N i p</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">{profilSekolah.nipKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-[1px]">Pangkat / Golongan</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">{profilSekolah.pangkatKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-[1px]">Jabatan</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">{profilSekolah.jabatanKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-[1px]">Alamat</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">{profilSekolah.alamatKepalaSekolah}</td>
              </tr>
            </tbody>
          </table>

          <p className="mb-3">Dengan ini memberi Tugas kepada:</p>

          <table className="w-full ml-[1.5cm] mb-5 text-[12pt]">
            <tbody>
              <tr>
                <td className="w-[30%] py-[1px]">Nama</td>
                <td className="w-[3%] py-[1px]">:</td>
                <td className="w-[67%] py-[1px] font-bold">
                  <InsetText
                    value={dataTugasSatuan.namaPegawai}
                    onChange={onUpdateTugasSatuan ? (val) => onUpdateTugasSatuan({ ...dataTugasSatuan, namaPegawai: val }) : undefined}
                    isBold
                  />
                </td>
              </tr>
              <tr>
                <td className="py-[1px]">Nip</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">
                  <InsetText
                    value={dataTugasSatuan.nipPegawai}
                    onChange={onUpdateTugasSatuan ? (val) => onUpdateTugasSatuan({ ...dataTugasSatuan, nipPegawai: val }) : undefined}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-[1px]">Pangkat/Golongan</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">
                  <InsetText
                    value={dataTugasSatuan.pangkatGolongan}
                    onChange={onUpdateTugasSatuan ? (val) => onUpdateTugasSatuan({ ...dataTugasSatuan, pangkatGolongan: val }) : undefined}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-[1px]">Jabatan</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">
                  <InsetText
                    value={dataTugasSatuan.jabatan}
                    onChange={onUpdateTugasSatuan ? (val) => onUpdateTugasSatuan({ ...dataTugasSatuan, jabatan: val }) : undefined}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-[1px]">Alamat</td>
                <td className="py-[1px]">:</td>
                <td className="py-[1px]">
                  <InsetText
                    value={dataTugasSatuan.alamatPegawai}
                    onChange={onUpdateTugasSatuan ? (val) => onUpdateTugasSatuan({ ...dataTugasSatuan, alamatPegawai: val }) : undefined}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-justify leading-[1.5] mb-2 text-[12pt]">
            Sebagai Peserta dalam kegiatan <InsetText
              value={dataTugasSatuan.uraianTugas}
              onChange={onUpdateTugasSatuan ? (val) => onUpdateTugasSatuan({ ...dataTugasSatuan, uraianTugas: val }) : undefined}
            /> yang akan dilaksanakan Pada Tanggal{' '}
            <InsetText
              value={dataTugasSatuan.tanggalTugas}
              onChange={onUpdateTugasSatuan ? (val) => onUpdateTugasSatuan({ ...dataTugasSatuan, tanggalTugas: val }) : undefined}
            />{' '}
            Di{' '}
            <InsetText
              value={dataTugasSatuan.tempatTugas}
              onChange={onUpdateTugasSatuan ? (val) => onUpdateTugasSatuan({ ...dataTugasSatuan, tempatTugas: val }) : undefined}
            />.
          </div>

          <div className="text-justify leading-[1.5] mb-12 text-[12pt]">
            Demikian Surat Tugas ini dibuat dan diberikan untuk dapat dipergunakan sebagaimana mestinya.
          </div>

          {/* Tanda Tangan */}
          <div className="w-[50%] ml-auto text-left text-[12pt] space-y-1 pr-8">
            <div className="flex">
              <span className="w-[45%]">Diberikan di</span>
              <span className="w-[55%]">: Waekerta</span>
            </div>
            <div className="flex">
              <span className="w-[45%]">Pada Tanggal</span>
              <span className="w-[55%]">
                :{' '}
                <InsetText
                  value={dataTugasSatuan.tanggalSurat}
                  onChange={onUpdateTugasSatuan ? (val) => onUpdateTugasSatuan({ ...dataTugasSatuan, tanggalSurat: val }) : undefined}
                />
              </span>
            </div>
            <div className="pt-4 text-center">
              <div>Kepala Sekolah</div>
              <div className="h-24"></div>
              <div className="font-bold">{profilSekolah.kepalaSekolah}</div>
              <div>Nip. {profilSekolah.nipKepalaSekolah}</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TEMPLATE 4: SURAT TUGAS BANYAK ORANG (KOLEKTIF) */}
      {/* ======================================================== */}
      {tipe === 'TUGAS_BANYAK' && dataTugasBanyak && (
        <div>
          <div className="text-center my-6">
            <h2 className="text-[13pt] font-bold underline uppercase tracking-wider m-0">
              SURAT TUGAS
            </h2>
            <p className="text-[12pt] mt-1">
              Nomor :{' '}
              <InsetText
                value={dataTugasBanyak.nomorSurat}
                onChange={onUpdateTugasBanyak ? (val) => onUpdateTugasBanyak({ ...dataTugasBanyak, nomorSurat: val }) : undefined}
                className="font-medium"
              />
            </p>
          </div>

          <p className="mb-3">Yang bertanda tangan dibawah ini Kepala SMA Negeri 3 Buru</p>

          <table className="w-full ml-4 mb-4 text-[12pt]">
            <tbody>
              <tr>
                <td className="w-[28%] py-0.5">N a m a</td>
                <td className="w-[3%] py-0.5">:</td>
                <td className="w-[69%] py-0.5 font-bold">{profilSekolah.kepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-0.5">N i p</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">{profilSekolah.nipKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-0.5">Pangkat / Golongan</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">{profilSekolah.pangkatKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-0.5">Jabatan</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">{profilSekolah.jabatanKepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-0.5">Alamat</td>
                <td className="py-0.5">:</td>
                <td className="py-0.5">{profilSekolah.alamatKepalaSekolah}</td>
              </tr>
            </tbody>
          </table>

          <p className="mb-3">Dengan ini memberikan tugas kepada:</p>

          {/* Tabel Peserta Banyak Orang */}
          <table className="w-full border-collapse border border-black mb-5 text-[10pt]">
            <thead>
              <tr className="bg-gray-100 text-center font-bold">
                <th className="border border-black p-1.5 w-[7%]">NO</th>
                <th className="border border-black p-1.5 w-[36%]">Nama</th>
                <th className="border border-black p-1.5 w-[22%]">Pangkat/Golongan</th>
                <th className="border border-black p-1.5 w-[15%]">Jabatan</th>
                <th className="border border-black p-1.5 w-[20%]">Alamat</th>
              </tr>
            </thead>
            <tbody>
              {dataTugasBanyak.daftarPeserta.map((peserta, idx) => (
                <tr key={peserta.no || idx}>
                  <td className="border border-black p-2 text-center align-top">{peserta.no}</td>
                  <td className="border border-black p-2 align-top">
                    <div className="font-bold">
                      <InsetText
                        value={peserta.nama}
                        onChange={onUpdateTugasBanyak ? (val) => {
                          const copy = [...dataTugasBanyak.daftarPeserta];
                          copy[idx].nama = val;
                          onUpdateTugasBanyak({ ...dataTugasBanyak, daftarPeserta: copy });
                        } : undefined}
                        isBold
                      />
                    </div>
                    <div className="font-mono text-[9pt]">
                      <InsetText
                        value={peserta.nip}
                        onChange={onUpdateTugasBanyak ? (val) => {
                          const copy = [...dataTugasBanyak.daftarPeserta];
                          copy[idx].nip = val;
                          onUpdateTugasBanyak({ ...dataTugasBanyak, daftarPeserta: copy });
                        } : undefined}
                      />
                    </div>
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    <InsetText
                      value={peserta.pangkatGolongan}
                      onChange={onUpdateTugasBanyak ? (val) => {
                        const copy = [...dataTugasBanyak.daftarPeserta];
                        copy[idx].pangkatGolongan = val;
                        onUpdateTugasBanyak({ ...dataTugasBanyak, daftarPeserta: copy });
                      } : undefined}
                    />
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    <InsetText
                      value={peserta.jabatan}
                      onChange={onUpdateTugasBanyak ? (val) => {
                        const copy = [...dataTugasBanyak.daftarPeserta];
                        copy[idx].jabatan = val;
                        onUpdateTugasBanyak({ ...dataTugasBanyak, daftarPeserta: copy });
                      } : undefined}
                    />
                  </td>
                  <td className="border border-black p-2 text-center align-top">
                    <InsetText
                      value={peserta.alamat}
                      onChange={onUpdateTugasBanyak ? (val) => {
                        const copy = [...dataTugasBanyak.daftarPeserta];
                        copy[idx].alamat = val;
                        onUpdateTugasBanyak({ ...dataTugasBanyak, daftarPeserta: copy });
                      } : undefined}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-justify leading-relaxed mb-4">
            Untuk{' '}
            <InsetText
              value={dataTugasBanyak.keperluanTugas}
              onChange={onUpdateTugasBanyak ? (val) => onUpdateTugasBanyak({ ...dataTugasBanyak, keperluanTugas: val }) : undefined}
            />
          </p>

          <p className="text-justify leading-relaxed mb-12">
            Demikian Surat Tugas ini dibuat dan diberikan untuk dapat dipergunakan sebagaimana mestinya.
          </p>

          {/* Tanda Tangan */}
          <div className="w-[48%] ml-auto text-left text-[12pt] space-y-1">
            <div className="flex">
              <span className="w-32">Diberikan di</span>
              <span>: Waekerta</span>
            </div>
            <div className="flex">
              <span className="w-32">Pada Tanggal</span>
              <span>
                :{' '}
                <InsetText
                  value={dataTugasBanyak.tanggalSurat}
                  onChange={onUpdateTugasBanyak ? (val) => onUpdateTugasBanyak({ ...dataTugasBanyak, tanggalSurat: val }) : undefined}
                />
              </span>
            </div>
            <div className="pt-2 text-center">
              <div>Kepala Sekolah</div>
              <div className="h-24"></div>
              <div className="font-bold underline">{profilSekolah.kepalaSekolah}</div>
              <div>Nip. {profilSekolah.nipKepalaSekolah}</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TEMPLATE 5: SURAT PENGANTAR (PAK INTEGRASI GURU) */}
      {/* ======================================================== */}
      {tipe === 'PAK' && dataPak && (
        <div>
          {/* Alamat Tujuan Surat */}
          <div className="mb-4 text-[12pt]">
            <div>Kepada.</div>
            <div>
              Yth.{' '}
              <InsetText
                value={dataPak.tujuanSurat}
                onChange={onUpdatePak ? (val) => onUpdatePak({ ...dataPak, tujuanSurat: val }) : undefined}
              />
            </div>
            <div>Dan Pendidikan Khusus Kabupaten Buru</div>
            <div>Di –</div>
            <div className="ml-8 tracking-widest font-semibold">
              <InsetText
                value={dataPak.kotaTujuan}
                onChange={onUpdatePak ? (val) => onUpdatePak({ ...dataPak, kotaTujuan: val }) : undefined}
              />
            </div>
          </div>

          <div className="text-center my-6">
            <h2 className="text-[13pt] font-bold underline uppercase tracking-wider m-0">
              SURAT PENGANTAR
            </h2>
            <p className="text-[12pt] mt-1">
              Nomor :{' '}
              <InsetText
                value={dataPak.nomorSurat}
                onChange={onUpdatePak ? (val) => onUpdatePak({ ...dataPak, nomorSurat: val }) : undefined}
                className="font-medium"
              />
            </p>
          </div>

          <p className="mb-3">Dengan hormat, kami sampaikan kepada Bapak :</p>

          {/* Tabel Pengantar */}
          <table className="w-full border-collapse border border-black mb-5 text-[10.5pt]">
            <thead>
              <tr className="bg-gray-100 text-center font-bold">
                <th className="border border-black p-2 w-[8%]">NO</th>
                <th className="border border-black p-2 w-[52%]">URAIAN</th>
                <th className="border border-black p-2 w-[18%]">BANYAKNYA</th>
                <th className="border border-black p-2 w-[22%]">KETERANGAN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-3 text-center align-top">1</td>
                <td className="border border-black p-3 align-top leading-relaxed">
                  Surat Pengusulan PAK Integrasi an.<br />
                  <strong className="block my-0.5">
                    1.{' '}
                    <InsetText
                      value={dataPak.namaPegawaiPak}
                      onChange={onUpdatePak ? (val) => onUpdatePak({ ...dataPak, namaPegawaiPak: val }) : undefined}
                      isBold
                    />
                  </strong>
                  Nip :{' '}
                  <InsetText
                    value={dataPak.nipPegawaiPak}
                    onChange={onUpdatePak ? (val) => onUpdatePak({ ...dataPak, nipPegawaiPak: val }) : undefined}
                  />
                  <br />
                  guru SMA Negeri 3 Buru sebagaimana berkas terlampir.
                </td>
                <td className="border border-black p-3 text-center align-top">
                  <InsetText
                    value={dataPak.banyaknya}
                    onChange={onUpdatePak ? (val) => onUpdatePak({ ...dataPak, banyaknya: val }) : undefined}
                  />
                </td>
                <td className="border border-black p-3 text-justify align-top leading-relaxed">
                  <InsetText
                    value={dataPak.keterangan}
                    onChange={onUpdatePak ? (val) => onUpdatePak({ ...dataPak, keterangan: val }) : undefined}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mb-12">Atas perhatiannya disampaikan terima kasih.</p>

          {/* Tanda Tangan */}
          <div className="w-[48%] ml-auto text-center text-[12pt] space-y-1">
            <div>
              Waekerta,{' '}
              <InsetText
                value={dataPak.tanggalSurat}
                onChange={onUpdatePak ? (val) => onUpdatePak({ ...dataPak, tanggalSurat: val }) : undefined}
              />
            </div>
            <div>{dataPak.isPlt ? 'Plt Kepala Sekolah' : 'Kepala Sekolah'}</div>
            <div className="h-24"></div>
            <div className="font-bold underline">{profilSekolah.kepalaSekolah}</div>
            <div>Nip. {profilSekolah.nipKepalaSekolah}</div>
          </div>

          {/* Tembusan */}
          <div className="mt-8 text-[9.5pt] text-gray-800">
            <div className="font-bold">Tembusan:</div>
            <div className="ml-4 leading-relaxed">
              <div>Yth, Kepala Dinas Pendidikan dan Kebudayaan Provinsi Maluku</div>
              <div>C.q Kabid Kepegawaian di Ambon</div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
