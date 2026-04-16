// src/lib/google-drive.ts
import { google } from 'googleapis';

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || '';

function getAuth() {
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  return oauth2Client;
}

export async function uploadImageToDrive(
  imageBuffer: Buffer,
  fileName: string,
  mimeType: string = 'image/jpeg',
): Promise<{ fileUrl: string; fileId: string }> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

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
    fields: 'id',
  });

  const fileId = createResponse.data.id!;
  // 使用 lh3 格式可直接嵌入顯示圖片
  const fileUrl = `https://lh3.googleusercontent.com/d/${fileId}`;

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return { fileUrl, fileId };
}