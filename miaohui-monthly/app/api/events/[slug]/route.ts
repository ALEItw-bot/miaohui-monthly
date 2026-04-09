import { NextRequest, NextResponse } from 'next/server';
import { getEventBySlug } from '@/lib/notion';
import { isValidSlug, safeErrorResponse } from '@/lib/api-guard';

export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // slug 驗證
  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { success: false, error: 'Invalid slug' },
      { status: 400 },
    );
  }

  try {
    const data = await getEventBySlug(slug);

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: data.error || 'Event not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return safeErrorResponse(err);
  }
}