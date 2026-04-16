import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const ONLINE_WINDOW_MS = 5 * 60 * 1000; // 5 分鐘視為「在線」

export async function POST(req: NextRequest) {
  try {
    const { visitorId, type = 'pageview' } = await req.json();
    if (!visitorId || typeof visitorId !== 'string') {
      return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 });
    }

    const now = Date.now();
    const pipe = redis.pipeline();

    // 只有 pageview 才增加總瀏覽數
    if (type === 'pageview') {
      pipe.incr('site:total_views');
    } else {
      pipe.get('site:total_views');
    }

    pipe.zadd('site:online_users', { score: now, member: visitorId });
    pipe.zremrangebyscore('site:online_users', 0, now - ONLINE_WINDOW_MS);
    pipe.zcard('site:online_users');

    const results = await pipe.exec();

    const totalViews = results[0] as number;
    const onlineCount = results[3] as number;

    return NextResponse.json({ totalViews, onlineCount });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET：純讀取（給 SSR 或其他用途）
export async function GET() {
  try {
    const now = Date.now();

    const pipe = redis.pipeline();
    pipe.get('site:total_views');
    pipe.zremrangebyscore('site:online_users', 0, now - ONLINE_WINDOW_MS);
    pipe.zcard('site:online_users');

    const results = await pipe.exec();

    const totalViews = (results[0] as number) ?? 0;
    const onlineCount = results[2] as number;

    return NextResponse.json({ totalViews, onlineCount });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}