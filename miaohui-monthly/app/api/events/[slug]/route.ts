import { NextResponse } from 'next/server';
import { getEventBySlug } from '@/lib/notion';

export const revalidate = 60;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const data = await getEventBySlug(slug);
    if (!data.success) {
      return NextResponse.json(data, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[/api/events/slug] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event detail' },
      { status: 500 }
    );
  }
}