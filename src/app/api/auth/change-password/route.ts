import { NextResponse } from 'next/server';
import { verifyRequestAuth, changeUserPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = verifyRequestAuth(request);
    if (!session) {
      return NextResponse.json(
        { message: 'Akses ditolak. Sesi Anda tidak valid atau telah berakhir.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Kata sandi saat ini dan kata sandi baru wajib diisi.' },
        { status: 400 }
      );
    }

    const result = changeUserPassword(session.username, currentPassword, newPassword);
    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
