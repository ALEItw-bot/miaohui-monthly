import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = process.env.GAS_DEPLOY_URL || '';
const GAS_KEY = process.env.GAS_API_KEY || '';

// ISR: 10 分鐘重新驗證
export const revalidate = 600;

export async function GET(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get('pageId');
  if (!pageId) {
    return NextResponse.json({ success: false, error: '缺少 pageId' });
  }

  try {
    const url = `${GAS_URL}?action=getPageContent&pageId=${pageId}&key=${GAS_KEY}`;
    const res = await fetch(url, {
      next: { revalidate: 30 },  // Next.js fetch 快取 10 分鐘
    });
    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: '取得內容失敗' });
  }
}