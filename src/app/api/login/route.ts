import { NextResponse } from 'next/server';
import { 
  findUser, 
  verifyPassword, 
  createSession, 
  checkRateLimit, 
  recordFailedAttempt, 
  resetRateLimit, 
  getClientIp 
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    
    // Check Rate Limit (Anti Brute-Force)
    const rateCheck = checkRateLimit(clientIp);
    if (rateCheck.locked) {
      return NextResponse.json(
        { 
          message: `Terlalu banyak percobaan masuk yang salah. Akses dikunci sementara selama ${rateCheck.remainingMinutes} menit demi keamanan.` 
        },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();
    const cleanUser = (email || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanUser || !cleanPass) {
      return NextResponse.json(
        { message: 'Username dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const user = findUser(cleanUser);
    if (!user || !verifyPassword(cleanPass, user.passwordHash)) {
      const fail = recordFailedAttempt(clientIp);
      if (fail.locked) {
        return NextResponse.json(
          { message: 'Terlalu banyak percobaan salah. Akses dikunci selama 15 menit.' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { 
          message: `Username atau kata sandi tidak valid. Sisa kesempatan: ${fail.remainingAttempts} kali.` 
        },
        { status: 401 }
      );
    }

    // Login Sukses - Reset rate limit & Buat Sesi Baru
    resetRateLimit(clientIp);
    const token = createSession(user);

    const isDefault = user.mustChangePassword || cleanPass === 'admin123' || cleanPass === 'tu123';

    const response = NextResponse.json({
      message: 'SUKSES',
      user: {
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        must_change_password: isDefault
      },
      token
    });

    // Set secure HTTP-only cookie
    response.cookies.set('simtu_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 3600, // 24 hours
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server login.' }, { status: 500 });
  }
}
