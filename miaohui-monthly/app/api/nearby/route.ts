import { NextResponse } from 'next/server';
import { getNearbySpots, getCoupons } from '@/lib/notion';

export const revalidate = 60; // ISR: 每 60 秒重新驗證

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId') || undefined;
  const category = searchParams.get('category') || undefined;
  const mode = searchParams.get('mode'); // 'coupons' | null
  const limit = Number(searchParams.get('limit')) || 10;

  try {
    if (mode === 'coupons') {
      const data = await getCoupons({ eventId, limit });
      return NextResponse.json(data);
    }

    const data = await getNearbySpots({ eventId, category, limit });
    return NextResponse.json(data);
  } catch (error) {
    console.error('[api/nearby] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}