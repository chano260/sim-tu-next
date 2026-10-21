import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { verifyRequestAuth } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = verifyRequestAuth(request);
    if (!session) {
      return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const data = await readDb('pengajuan');
    const index = data.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      return NextResponse.json({ message: 'Pengajuan tidak ditemukan' }, { status: 404 });
    }
    
    data[index].status = body.status;
    data[index].catatan_admin = body.catatan_admin;
    
    await writeDb('pengajuan', data);
    return NextResponse.json({ message: 'Status berhasil diubah', data: data[index] });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
