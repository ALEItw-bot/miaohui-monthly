import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { safeErrorResponse, safeCompare } from '@/lib/api-guard';

export async function POST(request: NextRequest) {
  // 從 Header 讀取密鑰（避免 URL 記錄洩漏）
  const secret = request.headers.get('x-revalidate-secret') || '';
  const expected = process.env.REVALIDATE_SECRET || '';

  // 使用 constant-time 比較，防止 Timing Attack
  if (!secret || !expected || !safeCompare(secret, expected)) {
    return NextResponse.json(
      { success: false, error: 'Invalid secret' },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { path } = body;

    if (path) {
      revalidatePath(path);
    } else {
      // 預設刷新首頁和主要列表頁
      revalidatePath('/');
      revalidatePath('/events');
      revalidatePath('/announcements');
      revalidatePath('/gallery');
      revalidatePath('/sponsors');
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      now: Date.now(),
    });
  } catch (err) {
    return safeErrorResponse(err);
  }
}