import crypto from 'crypto';

/**
 * OWASP A03: Pencegahan XSS dengan sanitasi teks dan HTML encoding
 */
export function sanitizeString(input: unknown, maxLen = 255): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLen)
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&#39;';
        case '"': return '&quot;';
        case '&': return '&amp;';
        default: return char;
      }
    });
}

/**
 * Sanitasi string identifier (hanya alphanumeric, strip, underscore)
 * Mencegah Path Traversal & Identifier Injection
 */
export function sanitizeIdentifier(input: string, maxLen = 64): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, maxLen);
}

/**
 * Validasi URL logo aman (Hanya mengizinkan Data URI gambar, URL lokal berawalan /, atau HTTPS resmi)
 * Mencegah XSS via javascript: URI & Open Redirect / SSRF
 */
export function sanitizeLogoUrl(url: unknown, defaultFallback: string): string {
  if (typeof url !== 'string' || !url.trim()) return defaultFallback;
  const trimmed = url.trim();

  // Izinkan Base64 data URI gambar
  if (trimmed.startsWith('data:image/png;base64,') || 
      trimmed.startsWith('data:image/jpeg;base64,') || 
      trimmed.startsWith('data:image/webp;base64,')) {
    return trimmed;
  }

  // Izinkan path lokal absolut aplikasi (contoh: /logo-maluku.png)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Izinkan HTTPS terpercaya
  if (/^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed)) {
    return trimmed;
  }

  return defaultFallback;
}

/**
 * Sanitasi HTML untuk Dokumen Cetak
 * Mengizinkan format teks & tabel resmi, namun menghapus total script, iframe, dan event handler
 */
export function sanitizeSuratHtml(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== 'string') return '';
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^>\s]+/gi, '')
    .replace(/javascript:/gi, 'blocked:');
}

/**
 * Timing-Safe Comparison untuk mencegah Timing Attacks (OWASP A02)
 */
export function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
