import { NextResponse } from 'next/server';
import { verifySignature, replyMessage } from '@/lib/line';
import { getNearbySpots, getCoupons, getEvents, getActiveSponsors } from '@/lib/notion';
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

  if (!verifySignature(body, signature)) {
    console.log('[webhook] SIGNATURE FAILED');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const data = JSON.parse(body);
  const events = data.events || [];
  console.log('[webhook] events count:', events.length);

  for (const event of events) {
    if (event.type === 'message') {
      const msgType = event.message.type;
      console.log('[webhook] message type:', msgType);

      if (msgType === 'text') {
        try { await handleTextMessage(event); }
        catch (err) { console.error('[webhook] text ERROR:', err); }

      } else if (msgType === 'location') {
        try { await handleLocationMessage(event); }
        catch (err) { console.error('[webhook] location ERROR:', err); }

      } else if (msgType === 'image') {
        // 照片投稿：目前先回覆提示，Phase 2 串接 storage
        try {
          await replyMessage(event.replyToken, {
            type: 'text',
            text: '📷 感謝傳照片！\n\n目前照片功能升級中，請先用文字投稿：\n輸入「活動情報」即可開始 📝',
          });
        } catch (err) { console.error('[webhook] image ERROR:', err); }
      }
    }

    if (event.type === 'follow') {
      await handleFollow(event);
    }
  }

  return NextResponse.json({ status: 'ok' });
}

// ==========================================
// 文字訊息處理（完整版 — 全關鍵字）
// ==========================================

async function handleTextMessage(event: any) {
  const text = event.message.text.trim();
  const replyToken = event.replyToken;

  // ---- 🔥 熱鬧資訊（含封面圖 + 詳細按鈕 + 工商卡片）----
  if (text === '熱鬧資訊') {
    const { events: activeEvents } = await getEvents({ limit: 5 });
    // 取得合作中的工商夥伴（穿插在活動卡片中曝光）
    let sponsors: any[] = [];
    try { sponsors = (await getActiveSponsors())?.sponsors || []; }
    catch { /* sponsors 查詢失敗不影響主流程 */ }
    return replyMessage(replyToken, buildEventCarousel(activeEvents, '📅 近期熱門活動', sponsors));
  }

  // ---- 🔍 大甲 / 鎮瀾宮（排在「大甲美食」之前，用 !includes 美食排除）----
  if ((text.includes('大甲') || text.includes('鎮瀾宮')) && !text.includes('美食')) {
    const { events: all } = await getEvents({ limit: 20 });
    const filtered = all.filter((e: any) =>
      e.title?.includes('大甲') || e.title?.includes('鎮瀾宮')
    );
    return replyMessage(replyToken, buildEventCarousel(filtered.slice(0, 5), '🔥 大甲媽祖相關活動'));
  }

  // ---- 🔍 白沙屯 ----
  if (text.includes('白沙屯') && !text.includes('美食')) {
    const { events: all } = await getEvents({ limit: 20 });
    const filtered = all.filter((e: any) => e.title?.includes('白沙屯'));
    return replyMessage(replyToken, buildEventCarousel(filtered.slice(0, 5), '🔥 白沙屯媽祖相關活動'));
  }

  // ---- 📍 商家推薦 ----
  if (text === '商家推薦') {
    const { events: activeEvents } = await getEvents({ limit: 5 });

    if (activeEvents.length === 0) {
      return replyMessage(replyToken, {
        type: 'text', text: '目前沒有進行中的活動，敬請期待！🙏',
      });
    }

    if (activeEvents.length === 1) {
      return replyMessage(replyToken, buildCategoryQuickReply(activeEvents[0].id));
    }

    const bubbles = activeEvents.map((evt: any) => ({
      type: 'bubble',
      body: {
        type: 'box', layout: 'vertical',
        contents: [
          { type: 'text', text: evt.title, weight: 'bold', size: 'lg', wrap: true },
          { type: 'text', text: evt.date?.start || '日期待公布', size: 'sm', color: '#888888', margin: 'sm' },
        ],
      },
      footer: {
        type: 'box', layout: 'vertical',
        contents: [{
          type: 'button',
          action: { type: 'message', label: '📍 看商家推薦', text: `周邊:${evt.id}:全部` },
          style: 'primary', color: '#FF6B35',
        }],
      },
    }));

    return replyMessage(replyToken, {
      type: 'flex', altText: '請選擇活動',
      contents: { type: 'carousel', contents: bubbles },
    });
  }

  // ---- 周邊:eventId:category ----
  if (text.startsWith('周邊:')) {
    const parts = text.split(':');
    const eventId = parts[1];
    const categoryInput = parts[2];

    if (categoryInput === '全部') {
      const { spots } = await getNearbySpots({ eventId });
      if (spots.length === 0) {
        return replyMessage(replyToken, {
          type: 'text', text: '這個活動目前還沒有商家推薦，敬請期待！🙏',
        });
      }
      return replyMessage(replyToken, [
        buildNearbyCarousel(spots),
        buildCategoryQuickReply(eventId),
      ]);
    }

    const { spots } = await getNearbySpots({ eventId, category: categoryInput });
    if (spots.length === 0) {
      return replyMessage(replyToken, {
        type: 'text', text: '此分類目前沒有推薦店家，試試其他分類吧！',
        quickReply: {
          items: [{
            type: 'action',
            action: { type: 'message', label: '🔍 看全部', text: `周邊:${eventId}:全部` },
          }],
        },
      });
    }
    return replyMessage(replyToken, buildNearbyCarousel(spots));
  }

  // ---- 🎫 好康優惠 / 優惠券 / 廟會小物 ----
  if (text === '好康優惠' || text === '優惠券' || text === '廟會小物') {
    const { spots } = await getCoupons({});
    return replyMessage(replyToken, buildCouponCarousel(spots));
  }

  // ---- 快捷：大甲美食 / 白沙屯美食 ----
  if (text.includes('美食') && (text.includes('大甲') || text.includes('白沙屯'))) {
    const keyword = text.includes('大甲') ? '大甲' : '白沙屯';
    const { events: matchEvents } = await getEvents({ limit: 20 });
    const matched = matchEvents.find((e: any) => e.title.includes(keyword));
    if (matched) {
      const { spots } = await getNearbySpots({ eventId: matched.id, category: '🍜 美食小吃' });
      if (spots.length > 0) return replyMessage(replyToken, buildNearbyCarousel(spots));
    }
    return replyMessage(replyToken, {
      type: 'text', text: `目前還沒有${keyword}周邊美食推薦，敬請期待！🍜`,
    });
  }

  // ---- 📥 我要投稿 / 報馬仔 ----
  if (text.includes('我要投稿') || text.startsWith('報馬仔')) {
    return replyMessage(replyToken, [
      { type: 'text', text: '🏮 報馬仔投稿模式 ON！選一個吧：' },
      { type: 'flex', altText: '選擇投稿類型', contents: buildSubmissionMenu() },
    ]);
  }

  // ---- 投稿格式偵測 ----
  if (
    text.includes('🌟活動名稱') ||
    text.includes('活動名稱：') ||
    text.includes('活動名稱:')
  ) {
    const sub = parseSubmission(text);
    // TODO: 寫入 Notion Inbox（需設定 NOTION_INBOX_DB_ID 環境變數）
    return replyMessage(replyToken, {
      type: 'text',
      text:
        '✅ 收到投稿！\n\n' +
        '📌 活動：' + sub.name + '\n' +
        '📍 地點：' + sub.location + '\n' +
        '📅 日期：' + sub.date + '\n\n' +
        '📷 有現場照片嗎？直接傳過來就行囉！\n' +
        '💡 想分享廟會記錄照片？輸入「廟會分享」',
    });
  }

  // ---- 活動情報（投稿格式提示）----
  if (text === '活動情報') {
    return replyMessage(replyToken, {
      type: 'text',
      text:
        '📝 活動情報投稿\n\n' +
        '請用以下格式傳送：\n\n' +
        '🌟活動名稱：○○○\n' +
        '📍地點：○○○\n' +
        '📅日期：○/○\n' +
        '💬備註：(其他資訊)\n\n' +
        '我收到後會自動幫你存進資料庫！',
    });
  }

  // ---- 廟會分享（照片投稿提示）----
  if (text === '廟會分享') {
    return replyMessage(replyToken, {
      type: 'text',
      text:
        '📷 廟會記錄分享\n\n' +
        '直接傳照片給我就可以了！\n\n' +
        '如果想加說明，可以先傳照片，\n' +
        '再傳一段文字描述就好囉！\n\n' +
        '你的廟會記錄會被收藏起來 🫡',
    });
  }

  // ---- 💼 工商服務 ----
  if (text === '工商服務') {
    return replyMessage(replyToken, {
      type: 'text',
      text:
        '💼 工商服務\n\n' +
        '廟會月報提供以下合作方案：\n\n' +
        '🔥 精選曝光 — 活動卡片置頂推播\n' +
        '📣 進階曝光 — 活動頁面商家展示\n' +
        '🤝 基本合作 — 商家資訊收錄\n\n' +
        '📧 洽詢合作：tony0917tw@gmail.com\n' +
        '或直接輸入「廟會合作」了解更多！',
    });
  }

  // ---- 🤝 廟會合作 / 合作洽談 ----
  if (text === '廟會合作' || text === '合作洽談') {
    return replyMessage(replyToken, {
      type: 'text',
      text:
        '🤝 廟會合作諮詢\n\n' +
        '想讓你的廟會活動曝光度 UP？\n' +
        '我們提供活動報導、粉絲專題、\n' +
        '社群曝光等合作方案💪\n\n' +
        '📧 請聯繫：tony0917tw@gmail.com\n' +
        '或直接在這裡留言告訴我們你的需求！',
    });
  }

  // ---- 💰 給予合作 ----
  if (text === '給予合作') {
    return replyMessage(replyToken, {
      type: 'text',
      text:
        '💰 贊助 & 合作支持\n\n' +
        '感謝你想支持廟會月報！🏮\n' +
        '我們接受品牌合作、廣告刺繡、\n' +
        '活動贊助等各種形式✨\n\n' +
        '📧 請聯繫：tony0917tw@gmail.com\n' +
        '我們會盡快回覆你！',
    });
  }

  // ---- 📖 關於我們 ----
  if (text === '關於我們') {
    return replyMessage(replyToken, {
      type: 'text',
      text:
        '🏮 關於廟會月報\n\n' +
        '我們是一群熱愛台灣廟會文化的團隊，\n' +
        '專門報導全台各地的廟會活動資訊🔥\n\n' +
        '📱 官網：https://miaohui.tw\n' +
        '📣 使命：全台鬧熱，報你知！\n\n' +
        '謝謝你的支持，有你我們才能越做越好！🙏',
    });
  }

  // ---- 預設回覆 ----
  return replyMessage(replyToken, {
    type: 'text',
    text:
      '嗨！我是廟會月報 🏮\n\n' +
      '你可以：\n' +
      '🔥 點「熱鬧資訊」看最新廟會\n' +
      '🔍 輸入廟宇名稱查活動（如「大甲」「白沙屯」）\n' +
      '📥 點「我要投稿」當報馬仔\n' +
      '📷 輸入「廟會分享」傳現場照片記錄\n\n' +
      '或直接點下面的選單 👇',
  });
}

// ==========================================
// 位置訊息處理（附近活動搜尋 — 10km）
// ==========================================
// Phase 2：待 Events DB Place 欄位經緯度補齊後啟用完整版

async function handleLocationMessage(event: any) {
  const replyToken = event.replyToken;

  // 暫時先引導，Phase 2 啟用 Haversine 10km 搜尋
  return replyMessage(replyToken, {
    type: 'text',
    text:
      '📍 收到你的位置！\n\n' +
      '附近活動搜尋功能即將上線 🔜\n' +
      '目前請先點「熱鬧資訊」查看近期活動！',
    quickReply: {
      items: [
        { type: 'action', action: { type: 'message', label: '🔥 熱鬧資訊', text: '熱鬧資訊' } },
        { type: 'action', action: { type: 'message', label: '📍 商家推薦', text: '商家推薦' } },
      ],
    },
  });
}

// ==========================================
// 新好友加入
// ==========================================

async function handleFollow(event: any) {
  return replyMessage(event.replyToken, {
    type: 'text',
    text:
      '歡迎加入廟會月報！🏮🎉\n\n' +
      '我們專門報導全台灣最鬧熱的廟會活動 🔥\n\n' +
      '你可以：\n' +
      '🔥 點選單「熱鬧資訊」→ 看近期廟會\n' +
      '🔍 直接搜廟名 → 例如「大甲」「白沙屯」\n' +
      '📥 點選單「我要投稿」→ 回報廟會活動情報\n' +
      '📷 輸入「廟會分享」→ 傳你拍的廟會照片記錄\n\n' +
      '全台鬧熱，報你知！💪',
  });
}

// ==========================================
// 工具函式
// ==========================================

/** 活動列表 → Flex Carousel（含封面圖 + 詳細按鈕 + 工商卡片穿插）*/
function buildEventCarousel(events: any[], headerText: string, sponsors: any[] = []) {
  if (!events || events.length === 0) {
    return {
      type: 'text',
      text: headerText + '\n\n目前沒有找到相關活動 😢\n有新消息我會再通知你！',
    };
  }

  const bubbles: any[] = events.slice(0, 10).map((evt: any) => {
    const bubble: any = {
      type: 'bubble',
      size: 'mega',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: evt.title || '未命名活動',
            weight: 'bold',
            size: 'lg',
            wrap: true,
          },
          {
            type: 'text',
            text: '📅 ' + (evt.date?.start || '日期待定'),
            size: 'sm',
            color: '#888888',
            margin: 'md',
          },
          {
            type: 'text',
            text: '📍 ' + (evt.city || '') + ' ' + (evt.district || ''),
            size: 'sm',
            color: '#888888',
            margin: 'sm',
          },
          {
            type: 'text',
            text: '🏷️ ' + (evt.region || ''),
            size: 'xs',
            color: '#C41E3A',
            margin: 'sm',
          },
        ],
      },
    };

    // 封面圖（如果活動有上傳封面）
    if (evt.coverImage && evt.coverImage.length > 0) {
      bubble.hero = {
        type: 'image',
        url: evt.coverImage[0],
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      };
    }

    // 查看詳細資訊按鈕（導向官網活動頁）
    if (evt.slug) {
      bubble.footer = {
        type: 'box',
        layout: 'vertical',
        contents: [{
          type: 'button',
          action: {
            type: 'uri',
            label: '🏛️ 查看詳細資訊',
            uri: `https://miaohui.tw/events/${evt.slug}`,
          },
          style: 'primary',
          color: '#C80000',
          height: 'sm',
        }],
      };
    }

    return bubble;
  });

  // 穿插工商合作卡片（最多 2 張，避免第一張就是廣告）
  if (sponsors.length > 0) {
    const sponsorBubbles = sponsors.slice(0, 2).map(buildSponsorBubble);
    sponsorBubbles.forEach((sb: any) => {
      const pos = Math.floor(Math.random() * bubbles.length) + 1;
      bubbles.splice(Math.min(pos, bubbles.length), 0, sb);
    });
  }

  // LINE carousel 最多 12 個 bubble
  return [
    { type: 'text', text: headerText },
    {
      type: 'flex',
      altText: headerText,
      contents: { type: 'carousel', contents: bubbles.slice(0, 12) },
    },
  ];
}

/** 工商合作夥伴 → Flex Bubble（精選/進階/基本等級標示）*/
function buildSponsorBubble(sponsor: any) {
  let levelBadge = '🤝 合作夥伴';
  let badgeColor = '#666666';
  if (sponsor.level === '精選') { levelBadge = '⭐ 精選合作'; badgeColor = '#C41E3A'; }
  else if (sponsor.level === '進階') { levelBadge = '🔷 進階合作'; badgeColor = '#1A3C6E'; }

  const bodyContents: any[] = [
    { type: 'text', text: levelBadge, size: 'xxs', color: badgeColor, weight: 'bold' },
    { type: 'text', text: sponsor.name, weight: 'bold', size: 'md', wrap: true, margin: 'sm' },
  ];

  if (sponsor.feature) {
    bodyContents.push({ type: 'text', text: sponsor.feature, size: 'xs', color: '#888888', wrap: true, margin: 'sm' });
  }
  if (sponsor.categories?.length > 0) {
    bodyContents.push({ type: 'text', text: '🏷️ ' + sponsor.categories.join('、'), size: 'xxs', color: '#AAAAAA', margin: 'sm' });
  }

  const bubble: any = {
    type: 'bubble',
    size: 'kilo',
    body: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#FFF8F0',
      paddingAll: '16px',
      contents: bodyContents,
    },
  };

  if (sponsor.website) {
    bubble.footer = {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#FFF8F0',
      paddingAll: '10px',
      contents: [{
        type: 'button',
        action: { type: 'uri', label: '🔗 查看詳情', uri: sponsor.website },
        style: 'secondary',
        height: 'sm',
      }],
    };
  }

  return bubble;
}

/** 投稿選單 — 雙卡片 Carousel（活動情報 / 廟會分享）*/
function buildSubmissionMenu() {
  return {
    type: 'carousel',
    contents: [
      {
        type: 'bubble',
        size: 'kilo',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#C41E3A',
          paddingAll: '16px',
          contents: [
            { type: 'text', text: '📝', size: 'xxl', align: 'center' },
            {
              type: 'text',
              text: '活動情報',
              color: '#FFFFFF',
              weight: 'bold',
              size: 'lg',
              align: 'center',
              margin: 'sm',
            },
          ],
        },
        body: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#FFFFFF',
          paddingAll: '16px',
          contents: [
            {
              type: 'text',
              text: '回報廟會活動資訊',
              weight: 'bold',
              size: 'sm',
              color: '#C41E3A',
              align: 'center',
            },
            {
              type: 'text',
              text: '知道哪裡有廟會活動？\n幫我們回報活動名稱、\n地點和日期！',
              size: 'xs',
              color: '#666666',
              align: 'center',
              wrap: true,
              margin: 'md',
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#FFFFFF',
          paddingAll: '12px',
          contents: [
            {
              type: 'button',
              action: {
                type: 'message',
                label: '📌 我要回報情報',
                text: '活動情報',
              },
              style: 'primary',
              color: '#C41E3A',
              height: 'sm',
            },
          ],
        },
      },
      {
        type: 'bubble',
        size: 'kilo',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#1A3C6E',
          paddingAll: '16px',
          contents: [
            { type: 'text', text: '📷', size: 'xxl', align: 'center' },
            {
              type: 'text',
              text: '廟會分享',
              color: '#FFFFFF',
              weight: 'bold',
              size: 'lg',
              align: 'center',
              margin: 'sm',
            },
          ],
        },
        body: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#FFFFFF',
          paddingAll: '16px',
          contents: [
            {
              type: 'text',
              text: '分享廟會現場記錄',
              weight: 'bold',
              size: 'sm',
              color: '#1A3C6E',
              align: 'center',
            },
            {
              type: 'text',
              text: '拍了廟會精彩照片？\n直接傳給我們，\n讓更多人看到鬧熱現場！',
              size: 'xs',
              color: '#666666',
              align: 'center',
              wrap: true,
              margin: 'md',
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#FFFFFF',
          paddingAll: '12px',
          contents: [
            {
              type: 'button',
              action: {
                type: 'message',
                label: '📸 我要分享照片',
                text: '廟會分享',
              },
              style: 'primary',
              color: '#1A3C6E',
              height: 'sm',
            },
          ],
        },
      },
    ],
  };
}

/** 解析投稿文字格式 */
function parseSubmission(text: string) {
  const nameMatch = text.match(/活動名稱[：:]\s*(.+)/);
  const locationMatch = text.match(/地點[：:]\s*(.+)/);
  const dateMatch = text.match(/日期[：:]\s*(.+)/);
  return {
    name: nameMatch ? nameMatch[1].trim() : '未命名活動',
    location: locationMatch ? locationMatch[1].trim() : '未填寫',
    date: dateMatch ? dateMatch[1].trim() : '未填寫',
    rawText: text,
  };
}

/** Haversine 公式 — 計算兩點間距離（km），Phase 2 附近搜尋用 */
export function haversine(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}