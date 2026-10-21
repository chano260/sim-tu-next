import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { verifyRequestAuth } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function GET(request: Request) {
  try {
    const session = verifyRequestAuth(request);
    if (!session) {
      return NextResponse.json({ message: 'Akses ditolak. Silakan masuk terlebih dahulu.' }, { status: 401 });
    }

    const data = await readDb('surat-masuk');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Error membaca data surat masuk' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = verifyRequestAuth(request);
    if (!session) {
      return NextResponse.json({ message: 'Akses ditolak. Sesi tidak valid atau telah berakhir.' }, { status: 401 });
    }

    const formData = await request.formData();
    const data = await readDb('surat-masuk');
    
    let fileUrl = null;
    const file = formData.get('file_surat') as File;
    if (file && file.size > 0) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: 'Ukuran file melebihi batas maksimal (10 MB).' },
          { status: 400 }
        );
      }

      // Validate file extension
      const ext = path.extname(file.name || '').toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          { message: 'Format file tidak diizinkan. Gunakan berkas PDF, DOC/DOCX, atau gambar (JPG/PNG).' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const safeBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
      const randomSuffix = crypto.randomBytes(4).toString('hex');
      const fileName = `${Date.now()}-${randomSuffix}-${safeBase}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      
      fileUrl = `/uploads/${fileName}`;
    }

    const newEntry = {
      id: crypto.randomUUID(),
      no_surat: sanitizeString(formData.get('no_surat')),
      tgl_surat: sanitizeString(formData.get('tgl_surat'), 50),
      tgl_diterima: sanitizeString(formData.get('tgl_diterima'), 50),
      pengirim: sanitizeString(formData.get('pengirim')),
      perihal: sanitizeString(formData.get('perihal')),
      file_surat: fileUrl,
      created_by: session.username,
      created_at: new Date().toISOString()
    };
    
    data.push(newEntry);
    await writeDb('surat-masuk', data);
    
    return NextResponse.json({ message: 'Surat berhasil disimpan', data: newEntry });
  } catch (error) {
    console.error('Surat Masuk save error:', error);
    return NextResponse.json({ message: 'Gagal menyimpan surat masuk' }, { status: 500 });
  }
}
