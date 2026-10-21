import { NextRequest, NextResponse } from 'next/server';
import { getMySQLPool, isMySQLConfigured } from '@/lib/db';
import { verifyRequestAuth } from '@/lib/auth';
import { safeCompare } from '@/lib/security';

export async function GET(request: NextRequest) {
  // OWASP A01: Broken Access Control Fix
  // Akses rute status database hanya diizinkan untuk:
  // 1. Permintaan yang membawa header 'x-diagnostic-secret' yang cocok dengan DIAGNOSTIC_SECRET_KEY, ATAU
  // 2. Pengguna terautentikasi dengan sesi aktif Admin
  const secretKey = process.env.DIAGNOSTIC_SECRET_KEY;
  const clientKey = request.headers.get('x-diagnostic-secret') || '';
  const isKeyValid = Boolean(secretKey && safeCompare(clientKey, secretKey));

  const session = verifyRequestAuth(request);
  const isAdmin = Boolean(session && session.role === 'admin');

  if (!isKeyValid && !isAdmin) {
    return NextResponse.json(
      { message: 'Akses ditolak: Diperlukan otorisasi diagnostik atau login Administrator.' },
      { status: 403 }
    );
  }

  const configured = isMySQLConfigured();
  if (!configured) {
    return NextResponse.json({
      connected: false,
      configured: false,
      message: 'Konfigurasi database belum lengkap.'
    }, { status: 200 });
  }

  const p = getMySQLPool();
  if (!p) {
    return NextResponse.json({
      connected: false,
      configured: true,
      message: 'Pool koneksi MySQL belum tersedia.'
    }, { status: 500 });
  }

  try {
    const conn = await p.getConnection();
    try {
      await conn.query('SELECT 1');
      return NextResponse.json({
        connected: true,
        configured: true,
        message: 'Koneksi ke sistem database aktif dan normal.',
        timestamp: new Date().toISOString()
      }, { status: 200 });
    } finally {
      conn.release();
    }
  } catch {
    // OWASP A05: Jangan ekspos detail SQL error ke response client
    return NextResponse.json({
      connected: false,
      configured: true,
      message: 'Gagal terhubung ke database. Silakan periksa log server.'
    }, { status: 200 });
  }
}
