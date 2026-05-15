// src/lib/blob-storage.ts
// ==========================================
// Vercel Blob 上傳工具
// 用途：LINE 照片投稿 → 暫存到 Vercel Blob（取代舊的 Google Drive 方案）
// 優勢：API Token 永不過期，零 OAuth 維護成本，全球 CDN 加速
// ==========================================

import { put, del } from '@vercel/blob';

export async function uploadImageToBlob(
  imageBuffer: Buffer,
  fileName: string,
  contentType: string = 'image/jpeg',
): Promise<{ fileUrl: string; pathname: string }> {
  // 上傳到 line-inbox/ 資料夾
  // public 模式：Notion 顯示圖片需要可公開讀取的 URL
  // addRandomSuffix：避免同名覆蓋，且 URL 隨機猜不到，類似私有
  const blob = await put(`line-inbox/${fileName}`, imageBuffer, {
    access: 'public',
    contentType,
    addRandomSuffix: true,
  });

  return {
    fileUrl: blob.url,         // CDN URL，永久可用
    pathname: blob.pathname,   // 內部路徑，用於日後刪除
  };
}

/**
 * 刪除 Blob 檔案（日後管理員審完照片要清掉暫存時用）
 * @param urlOrPathname 完整 URL 或 pathname 皆可
 */
export async function deleteImageFromBlob(urlOrPathname: string): Promise<void> {
  await del(urlOrPathname);
}