import { Client } from '@notionhq/client';
import type { EventItem, NotionBlock, RichText } from '@/types/notion';

// ==========================================
// Notion Client 初始化
// ==========================================

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const EVENTS_DB_ID = process.env.NOTION_EVENTS_DB_ID || '';
const ANNOUNCEMENTS_DB_ID = process.env.NOTION_ANNOUNCEMENTS_DB_ID || '';

// ==========================================
// 1. 取得活動列表
// ==========================================

export async function getEvents(options?: {
  region?: string;
  limit?: number;
}): Promise<{ success: boolean; count: number; events: EventItem[] }> {
  const { region, limit = 10 } = options || {};

  const filters: any[] = [
    { property: '發佈', checkbox: { equals: true } },
    {
      property: '日期',
      date: { on_or_after: new Date().toISOString().split('T')[0] },
    },
  ];

  if (region) {
    filters.push({ property: '區域', select: { equals: region } });
  }

  const response = await notion.databases.query({
    database_id: EVENTS_DB_ID,
    filter: { and: filters },
    sorts: [{ property: '日期', direction: 'ascending' }],
    page_size: limit,
  });

  const events = response.results.map((page: any) => parseEventPage(page));

  return { success: true, count: events.length, events };
}

// ==========================================
// 2. 用 slug 取得單一活動詳情
// ==========================================

export async function getEventBySlug(slug: string): Promise<{
  success: boolean;
  event?: EventItem;
  blocks?: NotionBlock[];
  error?: string;
}> {
  // 先用 slug 查到該活動頁面
  const response = await notion.databases.query({
    database_id: EVENTS_DB_ID,
    filter: {
      and: [
        { property: 'slug', rich_text: { equals: slug } },
        { property: '發佈', checkbox: { equals: true } },
      ],
    },
    page_size: 1,
  });

  if (!response.results.length) {
    return { success: false, error: `找不到活動：${slug}` };
  }

  const page = response.results[0] as any;
  const event = parseEventPage(page);

  // 取得頁面內容 blocks
  const blocks = await getPageBlocks(page.id);

  return { success: true, event, blocks };
}

// ==========================================
// 3. 取得頁面所有 Blocks（遞迴 + 分頁）
// ==========================================

async function getPageBlocks(
  blockId: string,
  depth: number = 0
): Promise<NotionBlock[]> {
  if (depth > 3) return []; // 防止無限遞迴

  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });

    for (const block of response.results as any[]) {
      const parsed = parseBlock(block);

      // 遞迴取子區塊
      if (block.has_children && depth < 3) {
        parsed.children = await getPageBlocks(block.id, depth + 1);
      }

      blocks.push(parsed);
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return groupListItems(blocks);
}

// ==========================================
// 4. 取得最新消息列表
// ==========================================

export async function getAnnouncements(limit: number = 5) {
  const response = await notion.databases.query({
    database_id: ANNOUNCEMENTS_DB_ID,
    filter: { property: '發佈', checkbox: { equals: true } },
    sorts: [{ property: '公告發布日期', direction: 'descending' }],
    page_size: limit,
  });

  const announcements = response.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      title: getTitle(props['公告標題']),
      date: props['公告發布日期']?.date?.start || '',
      category: props['分類']?.select?.name || '',
      summary: getRichTextPlain(props['摘要']),
    };
  });

  return { success: true, announcements };
}

// ==========================================
// 5. 取得所有已發布活動的 slug（SSG 用）
// ==========================================

export async function getAllEventSlugs(): Promise<string[]> {
  const response = await notion.databases.query({
    database_id: EVENTS_DB_ID,
    filter: { property: '發佈', checkbox: { equals: true } },
  });

  return response.results
    .map((page: any) => getRichTextPlain(page.properties['slug']))
    .filter(Boolean);
}

// ==========================================
// 6. 從 blocks 中提取所有圖片 URL（輪播用）
// ==========================================

export function extractImagesFromBlocks(blocks: NotionBlock[]): string[] {
  const images: string[] = [];

  function walk(blockList: NotionBlock[]) {
    for (const block of blockList) {
      if (block.type === 'image' && block.url) {
        images.push(block.url);
      }
      if (block.children && block.children.length > 0) {
        walk(block.children);
      }
      if (block.items && block.items.length > 0) {
        walk(block.items);
      }
    }
  }

  walk(blocks);
  return images;
}

// ==========================================
// 內部工具函式
// ==========================================

function parseEventPage(page: any): EventItem {
  const props = page.properties;
  return {
    id: page.id,
    title: getTitle(props['活動名稱']),
    slug: getRichTextPlain(props['slug']),
    emoji: getRichTextPlain(props['Emoji']),
    subtitle: getRichTextPlain(props['副標題']),
    tagline: getRichTextPlain(props['標語']),
    summary: getRichTextPlain(props['活動摘要']),
    date: props['日期']?.date
      ? { start: props['日期'].date.start, end: props['日期'].date.end }
      : null,
    duration: getRichTextPlain(props['天數']),
    startLocation: getRichTextPlain(props['起點']),
    destination: getRichTextPlain(props['目的地']),
    themeColor: props['主題色']?.select?.name || '',
    eventType: props['活動類型']?.select?.name || '',
    region: props['區域']?.select?.name || '',
    city: props['縣市']?.select?.name || '',
    district: props['行政區']?.select?.name || '',
    status: props['狀態']?.status?.name || '',
    referenceUrl: props['參考網址']?.url || '',
    coverImage: getFiles(props['活動封面圖']),
    createdTime: page.created_time,
    lastEdited: page.last_edited_time,
  };
}

function getTitle(prop: any): string {
  return prop?.title?.map((t: any) => t.plain_text).join('') || '';
}

function getRichTextPlain(prop: any): string {
  return prop?.rich_text?.map((t: any) => t.plain_text).join('') || '';
}

function getFiles(prop: any): string[] {
  if (!prop?.files?.length) return [];
  return prop.files
    .map((f: any) =>
      f.type === 'file' ? f.file.url : f.type === 'external' ? f.external.url : ''
    )
    .filter(Boolean);
}

// ---- Block 解析 ----

function parseRichText(rt: any): RichText {
  const result: RichText = { text: rt.plain_text || '' };
  if (rt.annotations) {
    if (rt.annotations.bold) result.bold = true;
    if (rt.annotations.italic) result.italic = true;
    if (rt.annotations.underline) result.underline = true;
    if (rt.annotations.strikethrough) result.strikethrough = true;
    if (rt.annotations.code) result.code = true;
    if (rt.annotations.color !== 'default') result.color = rt.annotations.color;
  }
  if (rt.href) result.href = rt.href;
  return result;
}

function parseRichTextArray(arr: any[]): RichText[] {
  return (arr || []).map(parseRichText);
}

function parseBlock(block: any): NotionBlock {
  const type = block.type;
  const data = block[type] || {};
  const result: NotionBlock = { id: block.id, type };

  switch (type) {
    case 'paragraph':
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
    case 'bulleted_list_item':
    case 'numbered_list_item':
    case 'to_do':
    case 'quote':
    case 'toggle':
      result.rich_text = parseRichTextArray(data.rich_text);
      if (type.startsWith('heading_') && data.is_toggleable) result.is_toggleable = true;
      if (type === 'to_do') result.checked = !!data.checked;
      if (data.color && data.color !== 'default') result.color = data.color;
      break;

    case 'callout':
      result.rich_text = parseRichTextArray(data.rich_text);
      if (data.color && data.color !== 'default') result.color = data.color;
      if (data.icon?.type === 'emoji') result.icon = data.icon.emoji;
      break;

    case 'table':
      result.has_column_header = !!data.has_column_header;
      result.has_row_header = !!data.has_row_header;
      result.table_width = data.table_width || 0;
      break;

    case 'table_row':
      result.cells = (data.cells || []).map((cell: any[]) => parseRichTextArray(cell));
      break;

    case 'image':
    case 'video':
      result.url =
        data.type === 'external'
          ? data.external?.url
          : data.file?.url || '';
      result.caption = parseRichTextArray(data.caption);
      break;

    case 'code':
      result.rich_text = parseRichTextArray(data.rich_text);
      result.language = data.language || 'plain text';
      break;

    case 'divider':
      break;

    default:
      if (data.rich_text) result.rich_text = parseRichTextArray(data.rich_text);
      break;
  }

  return result;
}

function groupListItems(blocks: NotionBlock[]): NotionBlock[] {
  const result: NotionBlock[] = [];
  let currentList: NotionBlock | null = null;

  for (const block of blocks) {
    const isList =
      block.type === 'bulleted_list_item' || block.type === 'numbered_list_item';

    if (isList) {
      const listType =
        block.type === 'bulleted_list_item' ? 'bulleted_list' : 'numbered_list';
      if (currentList && currentList.type === listType) {
        currentList.items!.push(block);
      } else {
        if (currentList) result.push(currentList);
        currentList = { id: '', type: listType, items: [block] };
      }
    } else {
      if (currentList) {
        result.push(currentList);
        currentList = null;
      }
      result.push(block);
    }
  }

  if (currentList) result.push(currentList);
  return result;
}

// ==========================================
// 7. 提交評分（寫回 Notion）
// ==========================================

export async function submitRating(
  slug: string,
  score: number
): Promise<{
  success: boolean;
  average?: number;
  count?: number;
  error?: string;
}> {
  // 用 slug 找到該活動頁面
  const response = await notion.databases.query({
    database_id: EVENTS_DB_ID,
    filter: {
      property: 'slug',
      rich_text: { equals: slug },
    },
    page_size: 1,
  });

  if (!response.results.length) {
    return { success: false, error: '找不到活動' };
  }

  const page = response.results[0] as any;
  const props = page.properties;
  const currentTotal = props['評分總分']?.number || 0;
  const currentCount = props['評分人數']?.number || 0;

  const newTotal = currentTotal + score;
  const newCount = currentCount + 1;

  // 寫回 Notion
  await notion.pages.update({
    page_id: page.id,
    properties: {
      '評分總分': { number: newTotal },
      '評分人數': { number: newCount },
    },
  });

  return {
    success: true,
    average: Math.round((newTotal / newCount) * 10) / 10,
    count: newCount,
  };
}