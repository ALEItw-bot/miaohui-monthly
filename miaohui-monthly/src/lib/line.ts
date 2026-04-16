import crypto from 'crypto';

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || '';
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';

// ==========================================
// 簽章驗證（防止偽造 Webhook）
// ==========================================

export function verifySignature(body: string, signature: string): boolean {
  if (!CHANNEL_SECRET) return false;
  const hash = crypto
    .createHmac('SHA256', CHANNEL_SECRET)
    .update(body)
    .digest('base64');
  return hash === signature;
}

// ==========================================
// 回覆訊息
// ==========================================

export async function replyMessage(
  replyToken: string,
  messages: any | any[],
): Promise<void> {
  const msgs = Array.isArray(messages) ? messages : [messages];

  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: msgs.slice(0, 5), // LINE 最多 5 則
    }),
  });
}

// ==========================================
// 推播訊息（主動發送）
// ==========================================

export async function pushMessage(
  to: string,
  messages: any | any[],
): Promise<void> {
  const msgs = Array.isArray(messages) ? messages : [messages];

  await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ to, messages: msgs.slice(0, 5) }),
  });
}

// ==========================================
// 下載 LINE 訊息中的圖片內容（Phase 2 新增）
// ==========================================

export async function downloadLineContent(
  messageId: string,
): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetch(
    `https://api-data.line.me/v2/bot/message/${messageId}/content`,
    {
      headers: {
        Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`LINE content download failed: ${res.status}`);
  }

  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return { buffer, contentType };
}

// ==========================================
// 取得 LINE 使用者 Profile（暱稱、頭像）（Phase 2 新增）
// ==========================================

export async function getLineProfile(
  userId: string,
): Promise<{ displayName: string; pictureUrl?: string } | null> {
  try {
    const res = await fetch(
      `https://api.line.me/v2/bot/profile/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      },
    );

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}