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