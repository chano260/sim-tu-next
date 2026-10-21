import { NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = verifyRequestAuth(request);
  if (!session) {
    return NextResponse.json({ authenticated: false, message: 'Tidak terotentikasi' }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.username,
      name: session.name,
      role: session.role,
      email: session.email
    }
  });
}
