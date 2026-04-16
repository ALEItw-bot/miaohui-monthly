// src/lib/google-drive.ts
// ==========================================
// Google Drive 上傳工具（OAuth2 Refresh Token 認證）
// 用途：LINE 照片投稿 → 暫存到 Google Drive
// 說明：使用你自己的 Google 帳號授權，檔案算在你的雲端空間
// ==========================================

import { google } from 'googleapis';

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || '';

/**
 * 取得 OAuth2 認證 client
 * 使用 Refresh Token 自動換取 Access Token
 */
function getAuth() {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });

  return oauth2Client;
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

  const { Readable } = await import('stream');
  const stream = Readable.from(imageBuffer);

  // 1. 上傳檔案
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