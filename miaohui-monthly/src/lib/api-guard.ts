import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ==========================================
// Upstash Redis 初始化
// ==========================================

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// ==========================================
// 1. 速率限制（Upstash Redis 版）
//    跨所有 Vercel Serverless instances 共享
// ==========================================

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1m'),
});

export async function checkRateLimit(request: NextRequest): Promise<boolean> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const { success } = await ratelimit.limit(ip);
  return success;
}

// ==========================================
// 2. 評分防重複（Upstash Redis 版）
// ==========================================

export async function hasAlreadyVoted(slug: string, request: NextRequest): Promise<boolean> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const key = `voted:${slug}:${ip}`;
  const exists = await redis.get(key);
  return !!exists;
}

export async function markAsVoted(slug: string, request: NextRequest): Promise<void> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const key = `voted:${slug}:${ip}`;
  await redis.set(key, '1', { ex: 365 * 24 * 3600 });
}

// ==========================================
// 3. 輸入消毒（HTML 實體編碼）
// ==========================================

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, 200);
}

// ==========================================
// 4. Slug 驗證
// ==========================================

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 100;
}

// ==========================================
// 5. UUID 驗證
// ==========================================

export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(id);
}

// ==========================================
// 6. 回傳過濾
// ==========================================

export function safeErrorResponse(error: unknown, status: number = 500) {
  const isDev = process.env.NODE_ENV === 'development';
  const message = isDev && error instanceof Error
    ? error.message
    : 'Internal Server Error';

  console.error('[API Error]', error);

  return NextResponse.json(
    { success: false, error: message },
    { status },
  );
}

// ==========================================
// 7. Constant-time 字串比較（防 Timing Attack）
// ==========================================

export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}