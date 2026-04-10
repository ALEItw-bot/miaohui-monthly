import { NextRequest, NextResponse } from 'next/server';
import { submitRating } from '@/lib/notion';
import { isValidSlug, checkRateLimit, safeErrorResponse, hasAlreadyVoted, markAsVoted } from '@/lib/api-guard';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // 1. 速率限制
  if (!(await checkRateLimit(request))) {
    return NextResponse.json(
      { success: false, error: 'Too many requests' },
      { status: 429 },
    );
  }

  // 2. slug 驗證
  if (!isValidSlug(slug)) {
    return NextResponse.json({ success: false, error: 'Invalid slug' }, { status: 400 });
  }

  // 3. 防重複評分（伺服器端）
  if (await hasAlreadyVoted(slug, request)) {
    return NextResponse.json(
      { success: false, error: '你已經評過分了' },
      { status: 409 },
    );
  }

  try {
    const body = await request.json();
    const { score } = body;

    // 4. score 驗證
    if (!score || score < 1 || score > 5 || !Number.isInteger(score)) {
      return NextResponse.json(
        { success: false, error: 'Score must be integer 1-5' },
        { status: 400 },
      );
    }

    const result = await submitRating(slug, score);

    // 5. 評分成功後標記已投票
    await markAsVoted(slug, request);

    return NextResponse.json(result);
  } catch (err) {
    return safeErrorResponse(err);
  }
}