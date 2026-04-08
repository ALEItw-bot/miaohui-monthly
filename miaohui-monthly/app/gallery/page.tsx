import GalleryClient from './GalleryClient';

export const revalidate = 600;

const EVENTS_DB_ID = process.env.NOTION_EVENTS_DB_ID!;

async function fetchGalleryPhotos() {
  try {
    const { Client } = require('@notionhq/client');
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    const response = await notion.databases.query({
      database_id: EVENTS_DB_ID,
      filter: {
        property: '發佈',
        checkbox: { equals: true },
      },
      sorts: [
        { property: '活動日期', direction: 'descending' },
      ],
    });

    const photos: Array<{
      id: string;
      title: string;
      coverUrl: string;
      eventType: string;
      date: string;
    }> = [];

    for (const page of response.results as any[]) {
      const props = page.properties;
      const title = props['活動名稱']?.title?.[0]?.plain_text || '';
      const coverFiles = props['活動封面圖']?.files || [];
      const coverUrl = coverFiles[0]?.file?.url || coverFiles[0]?.external?.url || '';
      const eventType = props['活動類型']?.select?.name || '';
      const dateStart = props['活動日期']?.date?.start || '';

      if (coverUrl) {
        photos.push({
          id: page.id,
          title,
          coverUrl,
          eventType,
          date: dateStart,
        });
      }
    }

    return { success: true, photos };
  } catch (err) {
    console.error('[gallery] fetch failed:', err);
    return { success: false, photos: [] };
  }
}

export default async function GalleryPage() {
  const data = await fetchGalleryPhotos();
  return <GalleryClient photos={data.photos} />;
}