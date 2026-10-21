import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const usersFile = path.join(dataDir, 'users.json');
const sessionsFile = path.join(dataDir, 'sessions.json');
const rateLimitFile = path.join(dataDir, 'rate_limit.json');

export interface UserAccount {
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'tu';
  passwordHash: string; // salt:hash
  mustChangePassword?: boolean;
}

export interface SessionData {
  token: string;
  username: string;
  role: string;
  name: string;
  email: string;
  expiresAt: number;
}

// 1. Password Hashing (PBKDF2 with SHA-512, 100,000 iterations)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(':')) return false;
  try {
    const [salt, originalHash] = stored.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

// 2. Users Management
function initDefaultUsers(): UserAccount[] {
  const adminPass = process.env.SIMTU_ADMIN_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'Admin@SMAN3Buru#2026!');
  const tuPass = process.env.SIMTU_TU_PASSWORD || process.env.TU_INITIAL_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'StafTU@SMAN3Buru#2026!');
  return [
    {
      username: 'admin',
      email: 'admin@smanegeri3buru.my.id',
      name: 'Administrator TU',
      role: 'admin',
      passwordHash: hashPassword(adminPass),
      mustChangePassword: true
    },
    {
      username: 'tu',
      email: 'tu@smanegeri3buru.my.id',
      name: 'Staf Layanan TU',
      role: 'tu',
      passwordHash: hashPassword(tuPass),
      mustChangePassword: true
    }
  ];
}

export function getUsers(): UserAccount[] {
  if (!fs.existsSync(usersFile)) {
    const defaults = initDefaultUsers();
    fs.writeFileSync(usersFile, JSON.stringify(defaults, null, 2), 'utf-8');
    return defaults;
  }
  try {
    const raw = fs.readFileSync(usersFile, 'utf-8');
    const users = JSON.parse(raw);
    if (!Array.isArray(users) || users.length === 0) {
      const defaults = initDefaultUsers();
      fs.writeFileSync(usersFile, JSON.stringify(defaults, null, 2), 'utf-8');
      return defaults;
    }
    return users;
  } catch {
    const defaults = initDefaultUsers();
    fs.writeFileSync(usersFile, JSON.stringify(defaults, null, 2), 'utf-8');
    return defaults;
  }
}

export function saveUsers(users: UserAccount[]) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');
}

export function findUser(query: string): UserAccount | null {
  const users = getUsers();
  const q = query.trim().toLowerCase();
  return users.find(u => u.username.toLowerCase() === q || u.email.toLowerCase() === q) || null;
}

const WEAK_PASSWORDS = new Set([
  'admin123', 'admin', 'password', '12345678', 'sman3buru', 'tu123', 'qwerty123'
]);

export function changeUserPassword(username: string, oldPass: string, newPass: string): { success: boolean; message: string } {
  const users = getUsers();
  const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if (index === -1) {
    return { success: false, message: 'Pengguna tidak ditemukan.' };
  }

  const user = users[index];
  if (!verifyPassword(oldPass, user.passwordHash)) {
    return { success: false, message: 'Kata sandi saat ini tidak sesuai.' };
  }

  if (newPass.length < 8) {
    return { success: false, message: 'Kata sandi baru minimal harus 8 karakter.' };
  }

  if (!/[A-Z]/.test(newPass) || !/[a-z]/.test(newPass) || !/[0-9]/.test(newPass)) {
    return { success: false, message: 'Kata sandi harus mengandung kombinasi huruf besar, huruf kecil, dan angka.' };
  }

  if (WEAK_PASSWORDS.has(newPass.toLowerCase())) {
    return { success: false, message: 'Kata sandi terlalu mudah ditebak. Silakan gunakan kombinasi yang lebih kuat.' };
  }

  users[index].passwordHash = hashPassword(newPass);
  users[index].mustChangePassword = false;
  saveUsers(users);
  return { success: true, message: 'Kata sandi berhasil diperbarui.' };
}

// 3. Rate Limiting (Anti Brute-Force)
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
}

function getRateLimits(): Record<string, RateLimitRecord> {
  if (!fs.existsSync(rateLimitFile)) return {};
  try {
    return JSON.parse(fs.readFileSync(rateLimitFile, 'utf-8'));
  } catch {
    return {};
  }
}

function saveRateLimits(data: Record<string, RateLimitRecord>) {
  fs.writeFileSync(rateLimitFile, JSON.stringify(data, null, 2), 'utf-8');
}

export function checkRateLimit(key: string): { locked: boolean; remainingMinutes?: number } {
  const limits = getRateLimits();
  const record = limits[key];
  if (!record) return { locked: false };

  const now = Date.now();
  if (record.lockedUntil && record.lockedUntil > now) {
    const rem = Math.ceil((record.lockedUntil - now) / (60 * 1000));
    return { locked: true, remainingMinutes: rem };
  }
  return { locked: false };
}

export function recordFailedAttempt(key: string): { locked: boolean; remainingAttempts: number } {
  const limits = getRateLimits();
  const now = Date.now();
  const record = limits[key] || { attempts: 0, lockedUntil: 0 };
  record.attempts += 1;
  limits[key] = record;
  if (record.attempts >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
    saveRateLimits(limits);
    return { locked: true, remainingAttempts: 0 };
  }

  saveRateLimits(limits);
  return { locked: false, remainingAttempts: 5 - record.attempts };
}

export function resetRateLimit(key: string) {
  const limits = getRateLimits();
  if (limits[key]) {
    delete limits[key];
    saveRateLimits(limits);
  }
}

// 4. Session Tokens Management
function getSessions(): SessionData[] {
  if (!fs.existsSync(sessionsFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(sessionsFile, 'utf-8'));
  } catch {
    return [];
  }
}

function saveSessions(sessions: SessionData[]) {
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2), 'utf-8');
}

export function createSession(user: UserAccount): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = now + 24 * 3600 * 1000; // 24 hours

  let sessions = getSessions().filter(s => s.expiresAt > now);
  sessions.push({
    token,
    username: user.username,
    role: user.role,
    name: user.name,
    email: user.email,
    expiresAt
  });

  if (sessions.length > 50) {
    sessions = sessions.slice(-50);
  }

  saveSessions(sessions);
  return token;
}

export function verifySessionToken(token: string): SessionData | null {
  if (!token || token.length < 32) return null;
  const now = Date.now();
  const sessions = getSessions();
  const session = sessions.find(s => s.token === token && s.expiresAt > now);
  return session || null;
}

export function destroySession(token: string) {
  if (!token) return;
  const sessions = getSessions().filter(s => s.token !== token);
  saveSessions(sessions);
}

// 5. Client IP Extractor
export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

// 6. Verify Request Helper
export function verifyRequestAuth(request: Request): SessionData | null {
  // Check Authorization Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim();
    const session = verifySessionToken(token);
    if (session) return session;
  }

  // Check simtu_session cookie
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/simtu_session=([^;]+)/);
    if (match && match[1]) {
      const session = verifySessionToken(match[1]);
      if (session) return session;
    }
  }

  return null;
}
