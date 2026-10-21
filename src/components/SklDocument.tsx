'use client';

import React from 'react';
import { Siswa } from '@/types';
import { profilSekolah } from '@/data/mockData';

interface SklDocumentProps {
  siswa: Siswa;
  mode?: 'SKL' | 'TRANSKRIP' | 'BOTH';
  paperSize?: 'A4' | 'F4' | 'LEGAL';
  logoSize?: number;
  logoKiriUrl?: string | null;
  logoKananUrl?: string | null;
}

export default function SklDocument({
  siswa,
  mode = 'BOTH',
  paperSize = 'A4',
  logoSize = 66,
  logoKiriUrl,
  logoKananUrl,
}: SklDocumentProps) {
  const showSkl = mode === 'SKL' || mode === 'BOTH';
  const showTranskrip = mode === 'TRANSKRIP' || mode === 'BOTH';

  const defaultLogoKiri = '/logo-maluku.png';
  const defaultLogoKanan = '/logo-sma3buru.png';

  const activeLogoKiri = logoKiriUrl || defaultLogoKiri;
  const activeLogoKanan = logoKananUrl || defaultLogoKanan;

  // Lebar kertas dokumen
  const paperWidthStyle =
    paperSize === 'LEGAL' ? 'w-[216mm]' :
    paperSize === 'F4' ? 'w-[215mm]' :
    'w-[210mm]';

  // Ukuran cetak untuk @page
  const printPageSize =
    paperSize === 'LEGAL' ? 'legal portrait' :
    paperSize === 'F4' ? '215mm 330mm portrait' :
    'A4 portrait';

  // Filter nilai SKL berdasarkan kelompok
  const mapelA = siswa.nilaiSkl.filter((n) => n.kelompok === 'A');
  const mapelB = siswa.nilaiSkl.filter((n) => n.kelompok === 'B');
  const mapelC = siswa.nilaiSkl.filter((n) => n.kelompok === 'C');

  return (
    <div className="skl-document-container text-black font-['Times_New_Roman',_Times,_serif] text-[9.5pt] leading-[1.25] antialiased">
      {/* Dynamic @page style untuk printer sesuai pilihan kertas (A4, F4, Legal) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: ${printPageSize};
            margin: 10mm 15mm 10mm 15mm;
          }
        }
      `}} />

      {/* ========================================================================= */}
      {/* HALAMAN 1: SURAT KETERANGAN LULUS (SKL)                                  */}
      {/* ========================================================================= */}
      {showSkl && (
        <div className={`sheet-page bg-white shadow-md print:shadow-none mx-auto mb-8 print:mb-0 box-border p-[0.7cm_1.5cm_0.7cm_1.5cm] ${paperWidthStyle} print:w-full print:p-0 relative`}>
          {/* KOP SURAT DINAS (Tabel Presisi, Logo Sama Besar & Seimbang) */}
          <table className="w-full border-collapse m-0 p-0 table-fixed">
            <tbody>
              <tr>
                {/* Logo Kiri (Provinsi Maluku) */}
                <td style={{ width: `${logoSize + 8}px` }} className="align-middle text-center p-0">
                  <div
                    style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                    className="flex items-center justify-center mx-auto"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeLogoKiri}
                      alt="Logo Provinsi Maluku"
                      style={{
                        width: `${logoSize}px`,
                        height: `${logoSize}px`,
                        objectFit: 'contain',
                      }}
                      className="block mx-auto"
                    />
                  </div>
                </td>

                {/* Teks Kop Tengah */}
                <td className="text-center align-middle px-1 py-0">
                  <div className="text-[12pt] font-bold tracking-wide uppercase leading-tight">
                    {profilSekolah.instansiAtas1}
                  </div>
                  <div className="text-[12pt] font-bold tracking-wide uppercase leading-tight">
                    {profilSekolah.instansiAtas2}
                  </div>
                  <div className="text-[14.5pt] font-extrabold tracking-wider uppercase leading-tight my-0.5">
                    {profilSekolah.nama}
                  </div>
                  <div className="text-[8.5pt] leading-tight text-black">
                    {profilSekolah.alamat}
                  </div>
                </td>

                {/* Logo Kanan (SMA Negeri 3 Buru - Ukuran Sama Persis dengan Kiri) */}
                <td style={{ width: `${logoSize + 8}px` }} className="align-middle text-center p-0">
                  <div
                    style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                    className="flex items-center justify-center mx-auto"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeLogoKanan}
                      alt="Logo SMA Negeri 3 Buru"
                      style={{
                        width: `${logoSize}px`,
                        height: `${logoSize}px`,
                        objectFit: 'contain',
                      }}
                      className="block mx-auto"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Garis Pembatas Kop Tebal (Menempel Rapat di Bawah Alamat) */}
          <div className="border-b-[3px] border-black mt-1 mb-2.5"></div>

          {/* JUDUL DOKUMEN & NOMOR SURAT */}
          <div className="text-center mb-2.5">
            <h1 className="text-[12.5pt] font-bold uppercase tracking-wide underline inline-block leading-tight">
              SURAT KETERANGAN LULUS
            </h1>
            <p className="text-[10pt] font-bold mt-0.5 leading-tight">
              Nomor : 421.4/ {siswa.nomorSuratSkl} /{siswa.tahunAjaran.split('/')[1] || '2026'}
            </p>
          </div>

          {/* PREAMBULE / DASAR KELULUSAN */}
          <div className="text-[9.5pt] leading-[1.3] text-justify mb-2">
            <p>
              Kepala SMA Negeri 3 Buru selaku Ketua Penyelenggara Ujian Sekolah Berbasis Android (USBA) Tahun Pelajaran {siswa.tahunAjaran}, Berdasarkan :
            </p>
            <div className="pl-4 my-1 space-y-0.5">
              <p>1. Ketuntasan dari seluruh program pembelajaran Kurikulum 2013</p>
              <p>2. Kriteria Kelulusan dari Satuan pendidikan sesuai dengan peraturan perundang-undangan</p>
              <p>3. Rapat Pleno Dewan Guru SMA Negeri 3 Buru Tentang Penetapan Kelulusan pada tanggal {profilSekolah.tanggalRapat}</p>
            </div>
            <p className="mt-0.5">Menerangkan bahwa :</p>
          </div>

          {/* TABEL IDENTITAS SISWA (Rapat & Sejajar) */}
          <table className="w-full text-[9.5pt] ml-4 mb-2 border-collapse leading-[1.3]">
            <tbody>
              <tr>
                <td className="w-[200px] py-[1px]">Nama</td>
                <td className="w-[15px] py-[1px] text-center">:</td>
                <td className="py-[1px] font-bold uppercase">{siswa.namaLengkap}</td>
              </tr>
              <tr>
                <td className="py-[1px]">Tempat, Tanggal Lahir</td>
                <td className="py-[1px] text-center">:</td>
                <td className="py-[1px]">{siswa.tempatLahir}, {siswa.tanggalLahir}</td>
              </tr>
              <tr>
                <td className="py-[1px]">Nomor Induk Siswa Nasional</td>
                <td className="py-[1px] text-center">:</td>
                <td className="py-[1px]">{siswa.nisn}</td>
              </tr>
              <tr>
                <td className="py-[1px]">Peminatan</td>
                <td className="py-[1px] text-center">:</td>
                <td className="py-[1px] uppercase">{siswa.peminatanSkl || (siswa.jurusan === 'MIPA' ? 'ILMU PENGETAHUAN ALAM' : 'ILMU PENGETAHUAN SOSIAL')}</td>
              </tr>
              <tr>
                <td className="py-[1px]">NPSN</td>
                <td className="py-[1px] text-center">:</td>
                <td className="py-[1px]">{siswa.npsn || profilSekolah.npsn}</td>
              </tr>
              <tr>
                <td className="py-[1px]">Dinyatakan</td>
                <td className="py-[1px] text-center">:</td>
                <td className="py-[1px]">
                  <span className="font-bold italic underline">{siswa.statusKelulusan}</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* KALIMAT PENGANTAR NILAI */}
          <p className="text-[9.5pt] mb-1">Dengan hasil sebagai berikut :</p>

          {/* TABEL NILAI KURIKULUM 2013 */}
          <table className="w-full border-collapse border border-black text-[9pt]">
            <thead>
              <tr className="text-center font-bold">
                <th className="border border-black py-1 px-1.5 w-[38px]">No</th>
                <th className="border border-black py-1 px-2 text-center">
                  Mata Pelajaran<br />
                  <span className="font-normal">(Kurikulum 2013)</span>
                </th>
                <th className="border border-black py-1 px-2 w-[85px]">Nilai</th>
              </tr>
            </thead>
            <tbody>
              {/* Kelompok A */}
              <tr className="font-bold">
                <td className="border border-black"></td>
                <td className="border border-black py-[2px] px-2">Kelompok A</td>
                <td className="border border-black"></td>
              </tr>
              {mapelA.map((item, idx) => (
                <tr key={`a-${item.id || idx}`}>
                  <td className="border border-black text-center py-[2px] px-1">{item.no || idx + 1}</td>
                  <td className={`border border-black py-[2px] px-2 ${item.isItalic ? 'italic' : ''}`}>{item.nama}</td>
                  <td className="border border-black text-center py-[2px] px-1">{item.nilai}</td>
                </tr>
              ))}

              {/* Kelompok B */}
              <tr className="font-bold">
                <td className="border border-black"></td>
                <td className="border border-black py-[2px] px-2">Kelompok B</td>
                <td className="border border-black"></td>
              </tr>
              {mapelB.map((item, idx) => (
                <tr key={`b-${item.id || idx}`}>
                  <td className="border border-black text-center py-[2px] px-1">{item.no || idx + 1}</td>
                  <td className={`border border-black py-[2px] px-2 ${item.isItalic ? 'italic' : ''}`}>{item.nama}</td>
                  <td className="border border-black text-center py-[2px] px-1">{item.nilai}</td>
                </tr>
              ))}

              {/* Kelompok C */}
              <tr className="font-bold">
                <td className="border border-black"></td>
                <td className="border border-black py-[2px] px-2">Kelompok C</td>
                <td className="border border-black"></td>
              </tr>
              {mapelC.map((item, idx) => (
                <tr key={`c-${item.id || idx}`}>
                  <td className="border border-black text-center py-[2px] px-1">{item.no || idx + 1}</td>
                  <td className={`border border-black py-[2px] px-2 ${item.isItalic ? 'italic' : ''}`}>{item.nama}</td>
                  <td className="border border-black text-center py-[2px] px-1">{item.nilai}</td>
                </tr>
              ))}

              {/* Rata-Rata */}
              <tr className="font-bold">
                <td colSpan={2} className="border border-black text-center py-1 px-2 italic">
                  Rata - rata
                </td>
                <td className="border border-black text-center py-1 px-2 font-bold">
                  {siswa.rataRataSkl}
                </td>
              </tr>
            </tbody>
          </table>

          {/* BAGIAN TANDA TANGAN & PASFOTO */}
          <div className="mt-3">
            <div className="flex items-end justify-between">
              {/* Spacer Kiri */}
              <div className="w-[160px]"></div>

              {/* Kotak Pas Foto Ukuran 3 X 4 */}
              <div className="w-[2.6cm] h-[3.5cm] border border-dashed border-black flex flex-col items-center justify-center text-[8.5pt] leading-tight text-center text-gray-800 shrink-0 mx-auto">
                <span>pas foto</span>
                <span>ukuran</span>
                <span>3 X 4</span>
              </div>

              {/* Tanda Tangan Kepala Sekolah */}
              <div className="w-[220px] text-left text-[9.5pt] leading-tight shrink-0">
                <p>Buru, &nbsp;{siswa.tanggalKelulusan || profilSekolah.tanggalTerbit}</p>
                <p className="mt-0.5">Kepala Sekolah</p>
                <div className="h-[52px]"></div>
                <p className="font-bold text-[10pt]">{profilSekolah.kepalaSekolah}</p>
                <p className="font-bold text-[9pt]">NIP. {profilSekolah.nipKepalaSekolah}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Break Antara Halaman 1 & 2 Saat Cetak Keduanya */}
      {showSkl && showTranskrip && (
        <div className="page-break" style={{ pageBreakAfter: 'always', breakAfter: 'page' }}></div>
      )}

      {/* ========================================================================= */}
      {/* HALAMAN 2: TRANSKRIP NILAI RESMI                                         */}
      {/* ========================================================================= */}
      {showTranskrip && (
        <div className={`sheet-page bg-white shadow-md print:shadow-none mx-auto mb-8 print:mb-0 box-border p-[0.7cm_1.5cm_0.7cm_1.5cm] ${paperWidthStyle} print:w-full print:p-0 relative`}>
          {/* KOP SURAT DINAS TRANSKRIP (Tabel Presisi, Logo Sama Besar) */}
          <table className="w-full border-collapse m-0 p-0 table-fixed">
            <tbody>
              <tr>
                {/* Logo Kiri */}
                <td style={{ width: `${logoSize + 8}px` }} className="align-middle text-center p-0">
                  <div
                    style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                    className="flex items-center justify-center mx-auto"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeLogoKiri}
                      alt="Logo Provinsi Maluku"
                      style={{
                        width: `${logoSize}px`,
                        height: `${logoSize}px`,
                        objectFit: 'contain',
                      }}
                      className="block mx-auto"
                    />
                  </div>
                </td>

                {/* Teks Kop Tengah */}
                <td className="text-center align-middle px-1 py-0">
                  <div className="text-[12pt] font-bold tracking-wide uppercase leading-tight">
                    PEMERINTAH PROVINSI MALUKU
                  </div>
                  <div className="text-[12pt] font-bold tracking-wide uppercase leading-tight">
                    {profilSekolah.instansiAtas2}
                  </div>
                  <div className="text-[14.5pt] font-extrabold tracking-wider uppercase leading-tight my-0.5">
                    {profilSekolah.nama}
                  </div>
                  <div className="text-[8.5pt] leading-tight text-black">
                    {profilSekolah.alamatTranskrip || profilSekolah.alamat}
                  </div>
                </td>

                {/* Logo Kanan (Sama Besar) */}
                <td style={{ width: `${logoSize + 8}px` }} className="align-middle text-center p-0">
                  <div
                    style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                    className="flex items-center justify-center mx-auto"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeLogoKanan}
                      alt="Logo SMA Negeri 3 Buru"
                      style={{
                        width: `${logoSize}px`,
                        height: `${logoSize}px`,
                        objectFit: 'contain',
                      }}
                      className="block mx-auto"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Garis Pembatas Kop Tebal */}
          <div className="border-b-[3px] border-black mt-1 mb-2.5"></div>

          {/* JUDUL TRANSKRIP NILAI & NOMOR */}
          <div className="text-center mb-2.5">
            <h1 className="text-[13pt] font-bold uppercase tracking-wider inline-block leading-tight">
              TRANSKRIP NILAI
            </h1>
            <p className="text-[10pt] mt-0.5 leading-tight">
              Nomor : 421.4 / {siswa.nomorSuratTranskrip} / {siswa.tahunAjaran.split('/')[1] || '2026'}
            </p>
          </div>

          {/* TABEL IDENTITAS SISWA TRANSKRIP (Urutan Persis Gambar 2) */}
          <table className="w-full text-[9.5pt] mb-2.5 border-collapse leading-[1.3]">
            <tbody>
              <tr>
                <td className="w-[230px] py-[1.5px]">Nomor Pokok Sekolah Nasional</td>
                <td className="w-[15px] py-[1.5px] text-center">:</td>
                <td className="py-[1.5px]">{siswa.npsn || profilSekolah.npsn}</td>
              </tr>
              <tr>
                <td className="py-[1.5px]">Nama Lengkap</td>
                <td className="py-[1.5px] text-center">:</td>
                <td className="py-[1.5px] font-medium">{siswa.namaLengkap}</td>
              </tr>
              <tr>
                <td className="py-[1.5px]">Tempat,Tanggal Lahir</td>
                <td className="py-[1.5px] text-center">:</td>
                <td className="py-[1.5px]">{siswa.tempatLahir}, {siswa.tanggalLahir}</td>
              </tr>
              <tr>
                <td className="py-[1.5px]">Nomor Induk Siswa Nasional</td>
                <td className="py-[1.5px] text-center">:</td>
                <td className="py-[1.5px]">{siswa.nisn}</td>
              </tr>
              <tr>
                <td className="py-[1.5px]">Nomor Ijazah</td>
                <td className="py-[1.5px] text-center">:</td>
                <td className="py-[1.5px]">{siswa.nomorIjazah}</td>
              </tr>
              <tr>
                <td className="py-[1.5px]">Tanggal Kelulusan</td>
                <td className="py-[1.5px] text-center">:</td>
                <td className="py-[1.5px]">{siswa.tanggalKelulusan || profilSekolah.tanggalTerbit}</td>
              </tr>
              <tr>
                <td className="py-[1.5px]">Peminatan</td>
                <td className="py-[1.5px] text-center">:</td>
                <td className="py-[1.5px]">{siswa.peminatanTranskrip || (siswa.jurusan === 'MIPA' ? 'Matematika dan Ilmu Pengetahuan Alam' : 'Ilmu Pengetahuan Sosial')}</td>
              </tr>
            </tbody>
          </table>

          {/* TABEL NILAI BERURUTAN (1 - 14 Tanpa Header Kelompok) */}
          <table className="w-full border-collapse border border-black text-[9.5pt]">
            <thead>
              <tr className="text-center font-bold">
                <th className="border border-black py-1 px-1.5 w-[40px]">No</th>
                <th className="border border-black py-1 px-2.5 text-center">Mata Pelajaran</th>
                <th className="border border-black py-1 px-2.5 w-[95px]">Nilai</th>
              </tr>
            </thead>
            <tbody>
              {siswa.nilaiTranskrip.map((item) => (
                <tr key={`trans-${item.no}`}>
                  <td className="border border-black text-center py-[2px] px-1">{item.no}</td>
                  <td className="border border-black py-[2px] px-2.5">{item.nama}</td>
                  <td className="border border-black text-center py-[2px] px-2">{item.nilai}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* BAGIAN TANDA TANGAN KEPALA SEKOLAH */}
          <div className="mt-4 flex justify-end">
            <div className="w-[230px] text-left text-[9.5pt] leading-tight">
              <p>Kabupaten Buru, {siswa.tanggalKelulusan || profilSekolah.tanggalTerbit}</p>
              <p className="mt-0.5">Kepala,</p>
              <div className="h-[52px]"></div>
              <p className="font-bold text-[10pt]">{profilSekolah.kepalaSekolah}</p>
              <p className="font-bold text-[9pt]">NIP. {profilSekolah.nipKepalaSekolah}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
