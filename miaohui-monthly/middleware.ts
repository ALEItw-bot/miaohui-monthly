@"
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://miaohui.tw',
  'https://www.miaohui.tw',
  'https://miaohui-monthly.vercel.app',
  'http://localhost:3000',
];

export function middleware(request: NextRequest) {
  // 只對 API routes 套用 CORS
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin') || '';
    const response = NextResponse.next();

    // 只允許白名單的 origin
    if (ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-revalidate-secret');

    // Preflight OPTIONS 請求
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    return response;
  }
}

export const config = {
  matcher: '/api/:path*',
};
"@ | Out-File -FilePath middleware.ts -Encoding utf8