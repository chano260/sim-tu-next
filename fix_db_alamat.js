const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// 1. Baca env secara komprehensif
const possiblePaths = [
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), '.env.local'),
  path.join(process.cwd(), '.env.production'),
  '/www/wwwroot/simtu.smanegeri3buru.my.id/.env',
  '/www/wwwroot/simtu.smanegeri3buru.my.id/.env.local',
  '/www/wwwroot/sim-tu-next/.env'
];

let envFound = false;
for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    envFound = true;
    console.log('Membaca konfigurasi env dari:', envPath);
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

function fixHtmlAlamat(html) {
  if (!html || typeof html !== 'string') return html;
  return html
    .replace(/(<td[^>]*>)\s*(\.{2,}|…|&hellip;)\s*(<\/td>)/gi, '$1Waekerta, Kec Waeapo Kab Buru$3')
    .replace(/>\s*(\.{2,}|…|&hellip;)\s*</g, '>Waekerta, Kec Waeapo Kab Buru<');
}

async function run() {
  console.log('====================================================');
  console.log('  MEMULAI PERBAIKAN ALAMAT TITIK-TITIK DI DATABASE  ');
  console.log('====================================================');

  let totalUpdated = 0;

  // 1. Coba perbaiki via MySQL
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || process.env.DB_USERNAME;
  const password = process.env.DB_PASS || process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.DB_DATABASE;

  if (user && database) {
    try {
      console.log(`\n[MySQL] Menghubungkan ke ${user}@${host}:${port}/${database}...`);
      const conn = await mysql.createConnection({ host, port, user, password, database });
      console.log('[MySQL] Terhubung sukses!');

      const [rows] = await conn.query('SELECT id, no_surat, isi_surat, raw_data FROM `surat_keluar`');
      console.log(`[MySQL] Memeriksa ${rows.length} surat di tabel surat_keluar...`);

      for (const row of rows) {
        let needsUpdate = false;
        let newIsi = row.isi_surat;
        let newRaw = row.raw_data;

        if (row.isi_surat && row.isi_surat.includes('..')) {
          const fixed = fixHtmlAlamat(row.isi_surat);
          if (fixed !== row.isi_surat) {
            newIsi = fixed;
            needsUpdate = true;
          }
        }

        if (row.raw_data && row.raw_data.includes('..')) {
          const fixedRaw = fixHtmlAlamat(row.raw_data);
          if (fixedRaw !== row.raw_data) {
            newRaw = fixedRaw;
            needsUpdate = true;
          }
        }

        if (needsUpdate) {
          await conn.query(
            'UPDATE `surat_keluar` SET `isi_surat` = ?, `raw_data` = ? WHERE `id` = ?',
            [newIsi, newRaw, row.id]
          );
          totalUpdated++;
          console.log(`  -> SUKSES UPDATE SURAT: [No: ${row.no_surat || row.id}] Alamat berhasil diperbaiki!`);
        }
      }

      await conn.end();
      console.log(`[MySQL] Selesai. Total surat yang diperbaiki di MySQL: ${totalUpdated}`);
    } catch (e) {
      console.warn('[MySQL Warning]:', e.message);
    }
  } else {
    console.log('\n[Info] Kredensial MySQL tidak ditemukan di env.');
  }

  // 2. Coba perbaiki via file JSON lokal (jika memakai fallback JSON)
  const dataDir = path.join(process.cwd(), 'data');
  const jsonFiles = ['surat-keluar.json', 'surat_keluar.json'];

  for (const jf of jsonFiles) {
    const jsonPath = path.join(dataDir, jf);
    if (fs.existsSync(jsonPath)) {
      console.log(`\n[JSON] Memeriksa file lokal ${jf}...`);
      try {
        const raw = fs.readFileSync(jsonPath, 'utf8');
        const list = JSON.parse(raw);
        let jsonUpdatedCount = 0;

        if (Array.isArray(list)) {
          for (const item of list) {
            if (item.isi_surat && item.isi_surat.includes('..')) {
              const fixed = fixHtmlAlamat(item.isi_surat);
              if (fixed !== item.isi_surat) {
                item.isi_surat = fixed;
                jsonUpdatedCount++;
                console.log(`  -> SUKSES UPDATE JSON: [No: ${item.no_surat || item.id}] Alamat diperbaiki!`);
              }
            }
          }

          if (jsonUpdatedCount > 0) {
            fs.writeFileSync(jsonPath, JSON.stringify(list, null, 2), 'utf8');
            console.log(`[JSON] File ${jf} berhasil disimpan (${jsonUpdatedCount} surat diperbarui).`);
          } else {
            console.log(`[JSON] Semua surat di ${jf} sudah rapi.`);
          }
        }
      } catch (err) {
        console.warn(`[JSON Warning] Gagal memproses ${jf}:`, err.message);
      }
    }
  }

  console.log('\n====================================================');
  console.log('                 PROSES SELESAI                     ');
  console.log('====================================================');
}

run();
