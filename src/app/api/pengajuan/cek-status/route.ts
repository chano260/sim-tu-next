import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { verifyRequestAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryNisn = (searchParams.get('nisn') || '').trim();
    const queryId = (searchParams.get('id') || '').trim();

    const data = await readDb('pengajuan');

    // OWASP A01 Fix: Otorisasi Staf TU dapat melihat seluruh daftar
    const session = verifyRequestAuth(request);
    if (session) {
      return NextResponse.json(data);
    }

    // Pengunjung publik wajib menyertakan NISN atau ID spesifik pengajuan miliknya sendiri
    if (!queryNisn && !queryId) {
      return NextResponse.json(
        { 
          message: 'Parameter identitas (NISN atau ID Pengajuan) diperlukan untuk memeriksa status permohonan surat.' 
        },
        { status: 400 }
      );
    }

    // Filter hanya record yang cocok dan buang atribut internal yang sensitif
    const filtered = (data || [])
      .filter((item: any) => {
        if (queryId && String(item.id) === queryId) return true;
        if (queryNisn && String(item.nisn) === queryNisn) return true;
        return false;
      })
      .map((item: any) => ({
        id: item.id,
        nama: item.nama || item.name || '',
        jenis_surat: item.jenis_surat || item.keperluan || '',
        status: item.status || 'Menunggu Persetujuan',
        tanggal: item.tanggal || '',
        catatan_admin: item.catatan_admin || null
      }));

    if (filtered.length === 0) {
      return NextResponse.json(
        { message: 'Permohonan surat dengan NISN atau ID tersebut tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memproses pengecekan status pengajuan.' }, { status: 500 });
  }
}
