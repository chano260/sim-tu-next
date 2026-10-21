import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { verifyRequestAuth } from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = verifyRequestAuth(request);
    if (!session) {
      return NextResponse.json({ message: 'Akses ditolak. Sesi tidak valid.' }, { status: 401 });
    }

    const { id } = await params;
    const data = await readDb('surat-masuk');
    const filtered = data.filter((item: any) => item.id !== id);
    
    await writeDb('surat-masuk', filtered);
    return NextResponse.json({ message: 'SUKSES' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
