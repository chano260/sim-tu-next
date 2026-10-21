import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// OWASP A03: Whitelist resmi tabel yang diizinkan untuk mencegah SQL Identifier Injection
export const ALLOWED_TABLES = ['surat_keluar', 'surat_masuk', 'pengajuan', 'users'] as const;
export type AllowedTable = typeof ALLOWED_TABLES[number];

export function isAllowedTable(name: string): name is AllowedTable {
  return (ALLOWED_TABLES as readonly string[]).includes(name);
}

// Helper untuk membaca file .env secara otomatis di lingkungan Standalone Node.js
export function loadEnvFile(): void {
  const possiblePaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
    '/www/wwwroot/simtu.smanegeri3buru.my.id/.env'
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(/*turbopackIgnore: true*/ envPath)) {
      try {
        const content = fs.readFileSync(/*turbopackIgnore: true*/ envPath, 'utf8');
        const lines = content.split('\n');
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
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch (e) {
        console.warn('Peringatan: Gagal membaca file env di', envPath);
      }
    }
  }
}

// Jalankan pembacaan env saat pertama kali di-import
loadEnvFile();

// OWASP A02: Zero Hardcoded Credentials - Seluruh konfigurasi database berasal dari environment
export function getDbConfig() {
  loadEnvFile();
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || process.env.DB_USERNAME || '';
  const password = process.env.DB_PASS || process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.DB_DATABASE || '';

  return { host, port, user, password, database };
}

let pool: mysql.Pool | null = null;
let tablesInitialized = false;

export function isMySQLConfigured(): boolean {
  const cfg = getDbConfig();
  return Boolean(cfg.user && cfg.database);
}

export function getMySQLPool(): mysql.Pool | null {
  if (!isMySQLConfigured()) return null;
  const cfg = getDbConfig();
  if (!pool) {
    pool = mysql.createPool({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return pool;
}

// Otomatis membuat tabel-tabel di MySQL jika belum ada
export async function ensureTablesExist(): Promise<void> {
  if (tablesInitialized) return;
  const p = getMySQLPool();
  if (!p) return;

  try {
    const conn = await p.getConnection();
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS \`surat_keluar\` (
          \`id\` varchar(64) NOT NULL,
          \`no_surat\` varchar(255) DEFAULT NULL,
          \`tanggal_surat\` varchar(100) DEFAULT NULL,
          \`tujuan\` varchar(255) DEFAULT NULL,
          \`perihal\` varchar(255) DEFAULT NULL,
          \`jenis_surat\` varchar(100) DEFAULT NULL,
          \`isi_surat\` longtext DEFAULT NULL,
          \`file_surat\` text DEFAULT NULL,
          \`raw_data\` longtext DEFAULT NULL,
          \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS \`surat_masuk\` (
          \`id\` varchar(64) NOT NULL,
          \`no_surat\` varchar(255) DEFAULT NULL,
          \`pengirim\` varchar(255) DEFAULT NULL,
          \`tanggal_surat\` varchar(100) DEFAULT NULL,
          \`tanggal_terima\` varchar(100) DEFAULT NULL,
          \`perihal\` varchar(255) DEFAULT NULL,
          \`status\` varchar(100) DEFAULT NULL,
          \`file_surat\` text DEFAULT NULL,
          \`raw_data\` longtext DEFAULT NULL,
          \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS \`pengajuan\` (
          \`id\` varchar(64) NOT NULL,
          \`nama_pemohon\` varchar(255) DEFAULT NULL,
          \`nisn\` varchar(50) DEFAULT NULL,
          \`kelas\` varchar(50) DEFAULT NULL,
          \`jenis_surat\` varchar(100) DEFAULT NULL,
          \`keperluan\` text DEFAULT NULL,
          \`status\` varchar(50) DEFAULT 'Menunggu',
          \`is_hidden\` tinyint(1) DEFAULT 0,
          \`raw_data\` longtext DEFAULT NULL,
          \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS \`users\` (
          \`username\` varchar(100) NOT NULL,
          \`email\` varchar(255) DEFAULT NULL,
          \`name\` varchar(255) DEFAULT NULL,
          \`role\` varchar(50) DEFAULT 'tu',
          \`password_hash\` text NOT NULL,
          \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`username\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // OWASP A02: Zero Hardcoded Credentials
      // Pembuatan akun admin hanya dilakukan secara dinamis melalui env variable aman
      const [rows]: any = await conn.query('SELECT COUNT(*) as cnt FROM \`users\`');
      if (rows && rows[0] && rows[0].cnt === 0) {
        const adminPass = process.env.INITIAL_ADMIN_PASSWORD || process.env.SIMTU_ADMIN_PASSWORD;
        if (adminPass) {
          const salt = crypto.randomBytes(16).toString('hex');
          const hash = crypto.pbkdf2Sync(adminPass, salt, 100000, 64, 'sha512').toString('hex');
          const finalHash = `${salt}:${hash}`;
          await conn.query(
            'INSERT INTO \`users\` (\`username\`, \`email\`, \`name\`, \`role\`, \`password_hash\`) VALUES (?, ?, ?, ?, ?)',
            ['admin', 'admin@smanegeri3buru.my.id', 'Administrator TU', 'admin', finalHash]
          );
        }
      }

      tablesInitialized = true;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Peringatan: Gagal menginisialisasi tabel MySQL, fallback ke JSON:', err);
  }
}

export function sanitizeCollectionName(name: string): string {
  return path.basename(name).replace(/[^a-zA-Z0-9_-]/g, '');
}

function collectionToTableName(collection: string): string {
  const clean = sanitizeCollectionName(collection).replace(/-/g, '_');
  if (!isAllowedTable(clean)) {
    throw new Error('Akses ditolak: Nama koleksi atau tabel tidak sah.');
  }
  return clean;
}

// BACA DATABASE (Mendukung MySQL dengan fallback JSON)
export async function readDb(collectionName: string): Promise<any[]> {
  const p = getMySQLPool();
  if (p) {
    try {
      await ensureTablesExist();
      const tableName = collectionToTableName(collectionName);
      // OWASP A03: Table name divalidasi ketat via Whitelist
      const [rows]: any = await p.query(`SELECT * FROM \`${tableName}\` ORDER BY created_at DESC`);
      if (Array.isArray(rows)) {
        return rows.map((row) => {
          if (row.raw_data) {
            try {
              const parsed = JSON.parse(row.raw_data);
              return { ...row, ...parsed };
            } catch (e) {
              return row;
            }
          }
          return row;
        });
      }
    } catch (e) {
      console.warn('MySQL read error, fallback ke JSON:', e);
    }
  }

  // Fallback lokal JSON
  const safeName = sanitizeCollectionName(collectionName);
  const filePath = path.join(dataDir, `${safeName}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// TULIS DATABASE (Mendukung MySQL dengan fallback JSON)
export async function writeDb(collectionName: string, data: any[]): Promise<void> {
  const p = getMySQLPool();
  if (p) {
    try {
      await ensureTablesExist();
      const tableName = collectionToTableName(collectionName);
      const conn = await p.getConnection();
      try {
        await conn.beginTransaction();
        await conn.query(`TRUNCATE TABLE \`${tableName}\``);
        for (const item of data) {
          const id = item.id || `item_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
          const rawData = JSON.stringify(item);

          if (tableName === 'surat_keluar') {
            await conn.query(
              `INSERT INTO \`surat_keluar\` (id, no_surat, tanggal_surat, tujuan, perihal, jenis_surat, isi_surat, file_surat, raw_data)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                id,
                item.no_surat || null,
                item.tanggal_surat || item.tgl_surat || null,
                item.tujuan || item.tujuan_surat || null,
                item.perihal || null,
                item.jenis_surat || null,
                item.isi_surat || null,
                item.file_surat || item.file_lampiran || null,
                rawData,
              ]
            );
          } else if (tableName === 'surat_masuk') {
            await conn.query(
              `INSERT INTO \`surat_masuk\` (id, no_surat, pengirim, tanggal_surat, tanggal_terima, perihal, status, file_surat, raw_data)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                id,
                item.no_surat || null,
                item.pengirim || null,
                item.tanggal_surat || null,
                item.tanggal_terima || null,
                item.perihal || null,
                item.status || null,
                item.file_surat || item.file_lampiran || null,
                rawData,
              ]
            );
          } else if (tableName === 'pengajuan') {
            await conn.query(
              `INSERT INTO \`pengajuan\` (id, nama_pemohon, nisn, kelas, jenis_surat, keperluan, status, is_hidden, raw_data)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                id,
                item.nama_pemohon || item.nama || null,
                item.nisn || null,
                item.kelas || null,
                item.jenis_surat || null,
                item.keperluan || null,
                item.status || 'Menunggu',
                item.is_hidden ? 1 : 0,
                rawData,
              ]
            );
          } else {
            await conn.query(
              `INSERT INTO \`${tableName}\` (id, raw_data) VALUES (?, ?)`,
              [id, rawData]
            );
          }
        }
        await conn.commit();
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    } catch (e) {
      console.warn('MySQL write error, fallback ke JSON:', e);
    }
  }

  // Selalu simpan juga ke file JSON sebagai cadangan lokal (redundant safety)
  const safeName = sanitizeCollectionName(collectionName);
  const filePath = path.join(dataDir, `${safeName}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Gagal menulis backup JSON lokal:', err);
  }
}
