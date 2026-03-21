import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const folder = url.searchParams.get('folder') || 'carousel';

  const allowedFolders = ['carousel', 'news', 'popup'];
  if (!allowedFolders.includes(folder)) {
    return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
  }

  const dirPath = path.join(process.cwd(), 'public', folder);

  try {
    const files = fs.readdirSync(dirPath);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .sort()
      .map(file => '/' + folder + '/' + file);

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}