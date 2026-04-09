import { NextRequest, NextResponse } from 'next/server';

// ==========================================
// 1. 速率限制（簡易版，防止濫用）
// ==========================================

const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 分鐘
const RATE_LIMIT_MAX = 60; // 每分鐘最多 60 次

export function checkRateLimit(request: NextRequest): boolean {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
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
// ==========================================

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>"'&]/g, '') // 移除 HTML 特殊字元
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
// 4. 回傳過濾（不將內部錯誤訊息暴露給前端）
// ==========================================

export function safeErrorResponse(error: unknown, status: number = 500) {
  // 生產環境不暴露錯誤細節
  const isDev = process.env.NODE_ENV === 'development';
  const message =
    isDev && error instanceof Error ? error.message : 'Internal Server Error';

  console.error('[API Error]', error); // Server log 可以看到

  return NextResponse.json({ success: false, error: message }, { status });
}
