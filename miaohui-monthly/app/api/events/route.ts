import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/notion';

export const revalidate = 60; // ISR：每 60 秒重新驗證

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') || undefined;
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const data = await getEvents({ region, limit });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[/api/events] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 },
    );
  }
}
