import { NextResponse } from 'next/server';
import { getAnnouncements } from '@/lib/notion';

export const revalidate = 120; // 最新消息 2 分鐘快取

export async function GET() {
  try {
    const data = await getAnnouncements();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[/api/announcements] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}