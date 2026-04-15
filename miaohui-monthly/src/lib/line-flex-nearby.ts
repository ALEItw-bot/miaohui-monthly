import type { NearbySpot } from '@/types/notion';

// 預設店家圖片（當沒有上傳照片時使用）
const DEFAULT_IMAGE =
  'https://placehold.co/600x400/0000A5/white?text=廟會月報';

// ==========================================
// 單一店家 → Flex Bubble
// ==========================================

function buildSpotBubble(spot: NearbySpot) {
  const bubble: any = {
    type: 'bubble',
    hero: {
      type: 'image',
      url: spot.coverImage || DEFAULT_IMAGE,
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'text',
          text: `${spot.category}｜${spot.distance}`,
          size: 'xs',
          color: '#888888',
        },
        {
          type: 'text',
          text: spot.name,
          weight: 'bold',
          size: 'xl',
          wrap: true,
        },
        {
          type: 'text',
          text: spot.summary || '歡迎來店體驗！',
          size: 'sm',
          color: '#666666',
          wrap: true,
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'horizontal',
      spacing: 'sm',
      contents: [] as any[],
    },
  };

  // 有優惠就加紅色標籤
  if (spot.coupon) {
    bubble.body.contents.push({
      type: 'box',
      layout: 'horizontal',
      margin: 'md',
      contents: [
        {
          type: 'text',
          text: `🎫 ${spot.coupon}`,
          size: 'sm',
          color: '#C80000',
          weight: 'bold',
          wrap: true,
        },
      ],
    });
  }

  // 導航按鈕
  if (spot.googleMaps) {
    bubble.footer.contents.push({
      type: 'button',
      action: {
        type: 'uri',
        label: '📍 導航',
        uri: spot.googleMaps,
      },
      style: 'primary',
      color: '#0000A5',
      height: 'sm',
    });
  }

  // 電話按鈕
  if (spot.phone) {
    bubble.footer.contents.push({
      type: 'button',
      action: {
        type: 'uri',
        label: '📞 電話',
        uri: `tel:${spot.phone}`,
      },
      style: 'secondary',
      height: 'sm',
    });
  }

  // 如果 footer 沒有按鈕，移除 footer 避免空白區塊
  if (bubble.footer.contents.length === 0) {
    delete bubble.footer;
  }

  return bubble;
}

// ==========================================
// 店家列表 → Flex Carousel
// ==========================================

// ==========================================
// 附近活動 → Flex Carousel（LINE 位置搜尋 10km）
// ==========================================

export function buildNearbyEventCarousel(
  events: Array<{
    title: string;
    slug: string;
    date: { start: string; end: string | null } | null;
    city: string;
    district: string;
    eventType: string;
    distanceKm: number;
    coverImage: string[];
    summary: string;
  }>,
) {
  if (!events || events.length === 0) {
    return {
      type: 'text',
      text: '📍 方圓 10 公里內目前沒有廟會活動\n\n試試點「熱鬧資訊」看全台近期活動！',
      quickReply: {
        items: [
          { type: 'action', action: { type: 'message', label: '🔥 熱鬧資訊', text: '熱鬧資訊' } },
          { type: 'action', action: { type: 'location', label: '📍 重新定位' } },
        ],
      },
    };
  }

  const bubbles = events.slice(0, 10).map((evt) => {
    const bubble: any = {
      type: 'bubble',
      size: 'mega',
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: `📍 ${evt.distanceKm} km`,
                size: 'xs',
                color: '#FFFFFF',
                weight: 'bold',
                flex: 0,
              },
            ],
            backgroundColor: '#0000A5',
            cornerRadius: 'xl',
            paddingAll: '6px',
            paddingStart: '12px',
            paddingEnd: '12px',
            width: '100px',
          },
          {
            type: 'text',
            text: evt.title || '未命名活動',
            weight: 'bold',
            size: 'lg',
            wrap: true,
          },
          {
            type: 'text',
            text: `📅 ${evt.date?.start || '日期待定'}`,
            size: 'sm',
            color: '#888888',
          },
          {
            type: 'text',
            text: `📍 ${evt.city || ''} ${evt.district || ''}`,
            size: 'sm',
            color: '#888888',
          },
          {
            type: 'text',
            text: `🏷️ ${evt.eventType || ''}`,
            size: 'xs',
            color: '#C80000',
          },
        ],
      },
    };

    // 封面圖
    if (evt.coverImage && evt.coverImage.length > 0) {
      bubble.hero = {
        type: 'image',
        url: evt.coverImage[0],
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      };
    }

    // 查看詳情按鈕
    if (evt.slug) {
      bubble.footer = {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: '🏛️ 查看詳細資訊',
              uri: `https://miaohui.tw/events/${evt.slug}`,
            },
            style: 'primary',
            color: '#C80000',
            height: 'sm',
          },
        ],
      };
    }

    return bubble;
  });

  return {
    type: 'flex',
    altText: `📍 附近 ${events.length} 場廟會活動`,
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}

// ==========================================
// 店家列表 → Flex Carousel
// ==========================================

export function buildNearbyCarousel(spots: NearbySpot[]) {
  return {
    type: 'flex',
    altText: `📍 商家推薦（${spots.length} 間店家）`,
    contents: {
      type: 'carousel',
      contents: spots.slice(0, 10).map(buildSpotBubble),
    },
  };
}

// ==========================================
// 分類選單 Quick Reply
// ==========================================

export function buildCategoryQuickReply(eventId: string) {
  const categories = [
    { label: '🍜 美食小吃', text: `周邊:${eventId}:🍜 美食小吃` },
    { label: '⛩️ 順路廟宇', text: `周邊:${eventId}:⛩️ 順路廟宇` },
    { label: '🎯 景點體驗', text: `周邊:${eventId}:🎯 景點體驗` },
    { label: '🛍️ 伴手禮', text: `周邊:${eventId}:🛍️ 伴手禮` },
    { label: '☕ 咖啡茶飲', text: `周邊:${eventId}:☕ 咖啡茶飲` },
    { label: '🔍 全部', text: `周邊:${eventId}:全部` },
  ];

  return {
    type: 'text',
    text: '請選擇想看的分類 👇',
    quickReply: {
      items: categories.map((cat) => ({
        type: 'action',
        action: {
          type: 'message',
          label: cat.label,
          text: cat.text,
        },
      })),
    },
  };
}

// ==========================================
// 優惠券 Carousel
// ==========================================

export function buildCouponCarousel(spots: NearbySpot[]) {
  if (spots.length === 0) {
    return {
      type: 'text',
      text: '目前沒有進行中的優惠，敬請期待！🙏',
    };
  }

  const bubbles = spots.slice(0, 10).map((spot) => ({
    type: 'bubble',
    header: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#C80000',
      paddingAll: 'lg',
      contents: [
        {
          type: 'text',
          text: '🏮 鬧熱好康券',
          color: '#FFFFFF',
          weight: 'bold',
          size: 'md',
        },
      ],
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'md',
      contents: [
        {
          type: 'text',
          text: spot.name,
          weight: 'bold',
          size: 'xl',
          wrap: true,
        },
        {
          type: 'text',
          text: `🎫 ${spot.coupon}`,
          size: 'lg',
          color: '#C80000',
          weight: 'bold',
          wrap: true,
        },
        { type: 'separator' },
        {
          type: 'text',
          text: '📱 截圖出示即可使用',
          size: 'xs',
          color: '#888888',
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'horizontal',
      spacing: 'sm',
      contents: [
        spot.googleMaps
          ? {
              type: 'button',
              action: {
                type: 'uri',
                label: '📍 導航到店',
                uri: spot.googleMaps,
              },
              style: 'primary',
              color: '#0000A5',
              height: 'sm',
            }
          : { type: 'filler' },
      ],
    },
  }));

  return {
    type: 'flex',
    altText: `🎫 鬧熱好康券（${spots.length} 張優惠）`,
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}