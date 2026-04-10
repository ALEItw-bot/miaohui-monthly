import { NextResponse } from 'next/server';
import { verifySignature, replyMessage } from '@/lib/line';
import { getNearbySpots, getCoupons, getEvents } from '@/lib/notion';
import {
  buildNearbyCarousel,
  buildCategoryQuickReply,
  buildCouponCarousel,
} from '@/lib/line-flex-nearby';

// ==========================================
// POST /api/line/webhook
// ==========================================

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-line-signature') || '';

  // 簽章驗證
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const data = JSON.parse(body);
  const events = data.events || [];

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      await handleTextMessage(event);
    }

    if (event.type === 'follow') {
      await handleFollow(event);
    }
  }

  return NextResponse.json({ status: 'ok' });
}

// ==========================================
// 文字訊息處理
// ==========================================

async function handleTextMessage(event: any) {
  const text = event.message.text.trim();
  const replyToken = event.replyToken;

  // ---- 📍 周邊推薦 ----
  if (text === '周邊推薦') {
    // 取得近期活動列表，讓用戶選
    const { events: activeEvents } = await getEvents({ limit: 5 });

    if (activeEvents.length === 0) {
      return replyMessage(replyToken, {
        type: 'text',
        text: '目前沒有進行中的活動，敬請期待！🙏',
      });
    }

    // 如果只有一個活動，直接跳到分類選單
    if (activeEvents.length === 1) {
      return replyMessage(
        replyToken,
        buildCategoryQuickReply(activeEvents[0].id),
      );
    }

    // 多個活動，顯示活動選擇 Carousel
    const bubbles = activeEvents.map((evt) => ({
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: evt.title,
            weight: 'bold',
            size: 'lg',
            wrap: true,
          },
          {
            type: 'text',
            text: evt.date?.start || '日期待公布',
            size: 'sm',
            color: '#888888',
            margin: 'sm',
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'message',
              label: '📍 看周邊推薦',
              text: `周邊:${evt.id}:全部`,
            },
            style: 'primary',
            color: '#FF6B35',
          },
        ],
      },
    }));

    return replyMessage(replyToken, {
      type: 'flex',
      altText: '請選擇活動',
      contents: { type: 'carousel', contents: bubbles },
    });
  }

  // ---- 周邊:eventId:category（分類選擇回覆）----
  if (text.startsWith('周邊:')) {
    const parts = text.split(':');
    const eventId = parts[1];
    const categoryInput = parts[2];

    // 如果是「全部」，先顯示分類選單
    if (categoryInput === '全部') {
      // 先查有沒有店家
      const { spots } = await getNearbySpots({ eventId });
      if (spots.length === 0) {
        return replyMessage(replyToken, {
          type: 'text',
          text: '這個活動目前還沒有周邊推薦，敬請期待！🙏',
        });
      }

      // 有店家，顯示分類 Quick Reply + 全部店家 Carousel
      return replyMessage(replyToken, [
        buildNearbyCarousel(spots),
        buildCategoryQuickReply(eventId),
      ]);
    }

    // 指定分類
    const { spots } = await getNearbySpots({
      eventId,
      category: categoryInput,
    });

    if (spots.length === 0) {
      return replyMessage(replyToken, {
        type: 'text',
        text: `此分類目前沒有推薦店家，試試其他分類吧！`,
        quickReply: {
          items: [
            {
              type: 'action',
              action: { type: 'message', label: '🔍 看全部', text: `周邊:${eventId}:全部` },
            },
          ],
        },
      });
    }

    return replyMessage(replyToken, buildNearbyCarousel(spots));
  }

  // ---- 🎫 好康優惠 / 優惠券 ----
  if (text === '好康優惠' || text === '優惠券') {
    const { spots } = await getCoupons({});
    return replyMessage(replyToken, buildCouponCarousel(spots));
  }

  // ---- 快捷查詢：大甲美食 / 白沙屯美食 ----
  if (text.includes('美食') && (text.includes('大甲') || text.includes('白沙屯'))) {
    const keyword = text.includes('大甲') ? '大甲' : '白沙屯';
    const { events: matchEvents } = await getEvents({ limit: 20 });
    const matched = matchEvents.find((e) => e.title.includes(keyword));

    if (matched) {
      const { spots } = await getNearbySpots({
        eventId: matched.id,
        category: '🍜 美食小吃',
      });
      if (spots.length > 0) {
        return replyMessage(replyToken, buildNearbyCarousel(spots));
      }
    }

    return replyMessage(replyToken, {
      type: 'text',
      text: `目前還沒有${keyword}周邊美食推薦，敬請期待！🍜`,
    });
  }

  // ---- 其他關鍵字（後續遷移）----
  // TODO: 熱鬧資訊、我要投稿、廟會合作、關於我們
  // 目前先回覆預設訊息
}

// ==========================================
// 新好友加入
// ==========================================

async function handleFollow(event: any) {
  return replyMessage(event.replyToken, {
    type: 'text',
    text: '歡迎加入廟會月報！🏮\n\n' +
      '我們是台灣最完整的廟會資訊平台，\n' +
      '提供全台廟會活動、遶境路線、周邊美食推薦。\n\n' +
      '👇 點選下方選單開始使用：\n' +
      '🔥 熱鬧資訊 — 查看近期活動\n' +
      '📍 周邊推薦 — 遶境沿途好吃好玩\n' +
      '🎫 好康優惠 — 獨家優惠券\n' +
      '📥 我要投稿 — 分享你的廟會體驗',
  });
}