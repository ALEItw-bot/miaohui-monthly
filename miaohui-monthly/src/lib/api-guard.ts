import { NextRequest, NextResponse } from 'next/server';

// ==========================================
// 1. 速率限制（In-Memory 版本）
// ⚠️ 注意：此版本在 Vercel Serverless 上效果有限
//    （每個 function instance 各自有獨立的 Map）
//    未來建議改用 Upstash Redis 或 Vercel KV 做跨實例限速
//    目前仍可在同一 instance 內提供基本防護
// ==========================================

const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 分鐘
const RATE_LIMIT_MAX = 30; // 每分鐘最多 30 次（從 60 降低，更保守）

export function checkRateLimit(request: NextRequest): boolean {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false; // 超過限制
  }

  record.count++;
  return true;
}

// ==========================================
// 2. 輸入消毒（防止 XSS / Injection）
//    改用 HTML 實體編碼，而非直接移除字元
// ==========================================

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, 200); // 限制長度
}

// ==========================================
// 3. Slug 驗證（只允許安全字元）
// ==========================================

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 100;
}

// ==========================================
// 4. UUID 驗證（用於商家詳情等 Notion Page ID 路由）
// ==========================================

export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(id);
}

// ==========================================
// 5. 回傳過濾（不將內部錯誤訊息暴露給前端）
// ==========================================

export function safeErrorResponse(error: unknown, status: number = 500) {
  // 生產環境不暴露錯誤細節
  const isDev = process.env.NODE_ENV === 'development';
  const message = isDev && error instanceof Error
    ? error.message
    : 'Internal Server Error';

  console.error('[API Error]', error); // Server log 可以看到

  return NextResponse.json(
    { success: false, error: message },
    { status },
  );
}

// ==========================================
// 6. Constant-time 字串比較（防 Timing Attack）
// ==========================================

export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}