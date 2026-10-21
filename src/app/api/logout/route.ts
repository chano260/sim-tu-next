import { NextResponse } from 'next/server';
import { destroySession, verifyRequestAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = verifyRequestAuth(request);
    if (session) {
      destroySession(session.token);
    }

    const response = NextResponse.json({ message: 'Berhasil keluar.' });
    response.cookies.set('simtu_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Logout selesai.' });
  }
}
