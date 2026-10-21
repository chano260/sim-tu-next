import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { verifyRequestAuth } from '@/lib/auth';
import crypto from 'crypto';

function sanitizeStr(str: any, maxLen: number = 255): string {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim().slice(0, maxLen);
}

export async function GET(request: Request) {
  try {
    const session = verifyRequestAuth(request);
    if (!session) {
      return NextResponse.json({ message: 'Akses ditolak: Operasi ini membutuhkan sesi login.' }, { status: 401 });
    }

    const data = await readDb('pengajuan');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Error membaca data pengajuan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const rawNama = sanitizeStr(body.nama || body.name, 80);
    const rawNisn = sanitizeStr(body.nisn, 20).replace(/[^0-9]/g, '');
    const rawKelas = sanitizeStr(body.kelas || body.grade, 30);
    const rawJenis = sanitizeStr(body.jenis_surat || body.jenisSurat, 80);
    const rawKeperluan = sanitizeStr(body.keperluan || body.alasan, 500);
    const rawNoHp = sanitizeStr(body.no_hp || body.phone, 25).replace(/[^0-9+\-\s()]/g, '');

    // Validasi Field Wajib
    if (!rawNama || rawNama.length < 2) {
      return NextResponse.json({ message: 'Nama pemohon wajib diisi minimal 2 karakter.' }, { status: 400 });
    }

    if (!rawNisn || rawNisn.length < 5) {
      return NextResponse.json({ message: 'NISN pemohon wajib berupa angka valid minimal 5 digit.' }, { status: 400 });
    }

    if (!rawJenis) {
      return NextResponse.json({ message: 'Jenis surat yang diajukan wajib dipilih.' }, { status: 400 });
    }

    const data = await readDb('pengajuan');
    
    // Whitelist konstruksi objek untuk mencegah Mass Assignment Vulnerability
    const newEntry = {
      id: crypto.randomUUID(),
      nama: rawNama,
      nisn: rawNisn,
      kelas: rawKelas,
      jenis_surat: rawJenis,
      keperluan: rawKeperluan,
      no_hp: rawNoHp,
      status: 'Menunggu Persetujuan',
      tanggal: new Date().toISOString()
    };
    
    data.push(newEntry);
    await writeDb('pengajuan', data);
    
    return NextResponse.json({ message: 'Pengajuan surat berhasil dikirim dan dicatat.', data: newEntry }, { status: 201 });
  } catch (error) {
    console.error('Pengajuan save error:', error);
    return NextResponse.json({ message: 'Gagal menyimpan pengajuan surat.' }, { status: 500 });
  }
}
