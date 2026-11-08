const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// 1. Baca env
const possiblePaths = [
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), '.env.local'),
  '/www/wwwroot/simtu.smanegeri3buru.my.id/.env'
];

for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

async function run() {
  console.log('=== MEMULAI PERBAIKAN ALAMAT DI DATABASE ===');
  
  // 1. Coba perbaiki di MySQL jika terkonfigurasi
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || process.env.DB_USERNAME;
  const password = process.env.DB_PASS || process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.DB_DATABASE;

  if (user && database) {
    try {
      console.log(`Menghubungkan ke MySQL ${user}@${host}:${port}/${database}...`);
      const conn = await mysql.createConnection({ host, port, user, password, database });
      
      const queries = [
        "UPDATE `surat_keluar` SET `isi_surat` = REPLACE(`isi_surat`, '>...<', '>Waekerta, Kec Waeapo Kab Buru<')",
        "UPDATE `surat_keluar` SET `isi_surat` = REPLACE(`isi_surat`, '> ... <', '>Waekerta, Kec Waeapo Kab Buru<')",
        "UPDATE `surat_keluar` SET `isi_surat` = REPLACE(`isi_surat`, '>... </td>', '>Waekerta, Kec Waeapo Kab Buru</td>')",
        "UPDATE `surat_keluar` SET `isi_surat` = REPLACE(`isi_surat`, '> ...</td>', '>Waekerta, Kec Waeapo Kab Buru</td>')"
      ];

      let totalUpdated = 0;
      for (const q of queries) {
        const [res] = await conn.query(q);
        totalUpdated += res.affectedRows || 0;
      }

      console.log(`SUKSES MySQL: ${totalUpdated} baris surat di database berhasil diperbarui!`);
      await conn.end();
    } catch (e) {
      console.warn('Peringatan MySQL:', e.message);
    }
  } else {
    console.log('MySQL tidak terkonfigurasi di env, memeriksa file JSON lokal...');
  }

  // 2. Perbaiki di data/surat-keluar.json jika ada
  const jsonPath = path.join(process.cwd(), 'data', 'surat-keluar.json');
  if (fs.existsSync(jsonPath)) {
    try {
      let content = fs.readFileSync(jsonPath, 'utf8');
      content = content.replace(/>\s*\.{2,}\s*</g, '>Waekerta, Kec Waeapo Kab Buru<');
      fs.writeFileSync(jsonPath, content, 'utf8');
      console.log('SUKSES JSON: data/surat-keluar.json berhasil diperbarui!');
    } catch (e) {
      console.warn('Gagal update JSON:', e.message);
    }
  }

  console.log('=== SELESAI ===');
}

run();
