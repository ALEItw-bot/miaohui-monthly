// src/lib/google-drive.ts
// ==========================================
// Google Drive 上傳工具（Service Account 認證）
// 用途：LINE 照片投稿 → 暫存到 Google Drive
// ==========================================

import { google } from 'googleapis';

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const SERVICE_ACCOUNT_PRIVATE_KEY = (
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || ''
).replace(/\\n/g, '\n');

/**
 * 取得 Google Drive 認證 client
 */
function getAuth() {
  return new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
}

/**
 * 上傳圖片到 Google Drive
 * @param imageBuffer - 圖片的 Buffer
 * @param fileName - 檔案名稱（例如 INB-20260416-162800_阿明.jpg）
 * @param mimeType - MIME 類型（預設 image/jpeg）
 * @returns Google Drive 檔案的公開連結
 */
export async function uploadImageToDrive(
  imageBuffer: Buffer,
  fileName: string,
  mimeType: string = 'image/jpeg',
): Promise<{ fileUrl: string; fileId: string }> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  // 1. 上傳檔案
  const { Readable } = await import('stream');
  const stream = Readable.from(imageBuffer);

  const createResponse = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [FOLDER_ID],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: 'id, webViewLink',
  });

  const fileId = createResponse.data.id!;
  const fileUrl = createResponse.data.webViewLink!;

  // 2. 設定為「任何人有連結可檢視」
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return { fileUrl, fileId };
}