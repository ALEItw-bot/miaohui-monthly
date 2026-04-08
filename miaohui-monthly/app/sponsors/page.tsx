import SponsorsClient from './SponsorsClient';

export const revalidate = 600;

const PARTNERS_DB_ID = process.env.NOTION_PARTNERS_DB_ID!;

export interface Partner {
  id: string;
  name: string;
  category: string[];
  description: string;
  website: string;
  status: string;
  exposureLevel: string;
}

async function fetchPartners(): Promise<{ success: boolean; partners: Partner[] }> {
  try {
    const { Client } = require('@notionhq/client');
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    const response = await notion.databases.query({
      database_id: PARTNERS_DB_ID,
      filter: {
        property: '合約狀態',
        status: { equals: '合作中' },
      },
      sorts: [
        { property: '前台曝光等級', direction: 'ascending' },
      ],
    });

    const partners: Partner[] = [];

    for (const page of response.results as any[]) {
      const props = page.properties;
      partners.push({
        id: page.id,
        name: props['商家名稱']?.title?.[0]?.plain_text || '',
        category: (props['類別']?.multi_select || []).map((s: any) => s.name),
        description: props['服務項目特色']?.rich_text?.[0]?.plain_text || '',
        website: props['商家網站']?.url || '',
        status: props['合約狀態']?.status?.name || '',
        exposureLevel: props['前台曝光等級']?.select?.name || '基本',
      });
    }

    return { success: true, partners };
  } catch (err) {
    console.error('[sponsors] fetch failed:', err);
    return { success: false, partners: [] };
  }
}

export default async function SponsorsPage() {
  const data = await fetchPartners();
  return <SponsorsClient partners={data.partners} />;
}