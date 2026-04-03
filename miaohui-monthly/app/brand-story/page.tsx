import BrandStoryClient from './BrandStoryClient';
import type { NotionBlock } from '@/types/notion';

interface PageContent {
  success: boolean;
  blocks: NotionBlock[];
}

const BRAND_STORY_PAGE_ID = '3274cb8807f28092b955c9eb108e2f20';

// ISR: 每 10 分鐘重新生成
export const revalidate = 600;

async function fetchBrandStory(): Promise<PageContent | null> {
  try {
    // 直接用 Notion API 取得品牌故事頁面內容
    const { Client } = require('@notionhq/client');
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    const blocks: NotionBlock[] = [];
    let cursor: string | undefined;

    do {
      const response = await notion.blocks.children.list({
        block_id: BRAND_STORY_PAGE_ID,
        page_size: 100,
        start_cursor: cursor,
      });

      for (const block of response.results as any[]) {
        blocks.push({
          id: block.id,
          type: block.type,
          rich_text: block[block.type]?.rich_text?.map((rt: any) => ({
            text: rt.plain_text || '',
            bold: rt.annotations?.bold,
            italic: rt.annotations?.italic,
            underline: rt.annotations?.underline,
            strikethrough: rt.annotations?.strikethrough,
            code: rt.annotations?.code,
            color: rt.annotations?.color !== 'default' ? rt.annotations?.color : undefined,
            href: rt.href,
          })) || [],
          color: block[block.type]?.color !== 'default' ? block[block.type]?.color : undefined,
          icon: block[block.type]?.icon?.emoji,
          url: block[block.type]?.external?.url || block[block.type]?.file?.url,
          caption: block[block.type]?.caption?.map((c: any) => ({
            text: c.plain_text || '',
          })),
        });
      }

      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);

    return { success: true, blocks };
  } catch (err) {
    console.error('[brand-story] fetch failed:', err);
    return null;
  }
}

export default async function BrandStoryPage() {
  const page = await fetchBrandStory();
  return <BrandStoryClient page={page} />;
}