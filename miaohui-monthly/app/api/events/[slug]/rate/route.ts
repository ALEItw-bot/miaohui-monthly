import { NextRequest, NextResponse } from 'next/server';
import { submitRating } from '@/lib/notion';
import { isValidSlug, checkRateLimit, safeErrorResponse } from '@/lib/api-guard';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Next.js 15+ params 是 Promise

  // 1. 速率限制（防止刷評分）
  if (!checkRateLimit(request)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests' },
      { status: 429 }
    );
  }

  // 2. slug 驗證
  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { success: false, error: 'Invalid slug' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { score } = body;

    // 3. score 驗證：必須是 1-5 的整數
    if (!score || score < 1 || score > 5 || !Number.isInteger(score)) {
      return NextResponse.json(
        { success: false, error: 'Score must be integer 1-5' },
        { status: 400 }
      );
    }

    const result = await submitRating(slug, score);
    return NextResponse.json(result);
  } catch (err) {
    return safeErrorResponse(err);
  }
}