import { Client } from '@notionhq/client';
import type {
  EventItem,
  NotionBlock,
  RichText,
  Announcement,
  Partner,
  PartnerDetail,
  GalleryPhoto,
  PageContent,
  NearbySpot,
} from '@/types/notion';

// ==========================================
// Notion Client 初始化（從 notion-config 統一讀取）
// ==========================================

import { NOTION_CONFIG } from './notion-config';

const notion = new Client({
  auth: NOTION_CONFIG.token,
});

const EVENTS_DB_ID = NOTION_CONFIG.databases.events;
const ANNOUNCEMENTS_DB_ID = NOTION_CONFIG.databases.announcements;
const PARTNERS_DB_ID = NOTION_CONFIG.databases.partners;
const INBOX_DB_ID = NOTION_CONFIG.databases.inbox;
const BRAND_STORY_PAGE_ID = NOTION_CONFIG.pages.brandStory;
const NEARBY_DB_ID = NOTION_CONFIG.databases.nearby;

// ==========================================
// 1. 取得活動列表（原有）
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
// 2. 用 slug 取得單一活動詳情（原有）
// ==========================================

export async function getEventBySlug(slug: string): Promise<{
  success: boolean;
  event?: EventItem;
  blocks?: NotionBlock[];
  error?: string;
}> {
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
  const blocks = await getPageBlocks(page.id);

  return { success: true, event, blocks };
}

// ==========================================
// 3. 取得頁面所有 Blocks（遞迴 + 分頁）（原有）
// ==========================================

async function getPageBlocks(
  blockId: string,
  depth: number = 0,
): Promise<NotionBlock[]> {
  if (depth > 3) return [];

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

      if (block.has_children && depth < 3) {
        parsed.children = await getPageBlocks(block.id, depth + 1);
      }

      blocks.push(parsed);
    }

    cursor = response.has_more
      ? (response.next_cursor ?? undefined)
      : undefined;
  } while (cursor);

  return groupListItems(blocks);
}

// ==========================================
// 4. 取得最新消息列表（原有，加上型別標註）
// ==========================================

export async function getAnnouncements(options?: {
  limit?: number;
}): Promise<{ success: boolean; announcements: Announcement[] }> {
  const { limit = 5 } = options || {};

  const response = await notion.databases.query({
    database_id: ANNOUNCEMENTS_DB_ID,
    filter: { property: '發佈', checkbox: { equals: true } },
    sorts: [{ property: '公告發布日期', direction: 'descending' }],
    page_size: limit,
  });

  const announcements: Announcement[] = response.results.map((page: any) => {
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
// 5. 取得所有已發布活動的 slug（SSG 用）（原有）
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
// 6. 從 blocks 中提取所有圖片 URL（原有）
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
// 7. 提交評分（寫回 Notion）（原有）
// ==========================================

export async function submitRating(
  slug: string,
  score: number,
): Promise<{
  success: boolean;
  average?: number;
  count?: number;
  error?: string;
}> {
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

// ==========================================
// 🔴 7.5 取得附近活動（LINE 位置搜尋用）（新增）
// ==========================================

/**
 * Haversine 公式：計算兩個 GPS 座標之間的距離（公里）
 */
function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const R = 6371; // 地球半徑（公里）
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * 搜尋使用者位置方圓 N 公里內的已發佈活動
 * @param userLat  使用者緯度
 * @param userLon  使用者經度
 * @param radiusKm 搜尋半徑（預設 10km）
 * @param limit    最多回傳幾筆（預設 10）
 */
export async function getEventsNearby(options: {
  userLat: number;
  userLon: number;
  radiusKm?: number;
  limit?: number;
}): Promise<{
  success: boolean;
  count: number;
  events: (EventItem & { distanceKm: number })[];
}> {
  const { userLat, userLon, radiusKm = 10, limit = 10 } = options;

  // 撈出所有已發佈活動
  const response = await notion.databases.query({
    database_id: EVENTS_DB_ID,
    filter: {
      and: [
        { property: '發佈', checkbox: { equals: true } },
        { property: '緯度', number: { is_not_empty: true } },
        { property: '經度', number: { is_not_empty: true } },
      ],
    },
    sorts: [{ property: '日期', direction: 'ascending' }],
  });

  // 計算距離並篩選
  const eventsWithDistance = response.results
    .map((page: any) => {
      const event = parseEventPage(page);
      if (!event.latitude || !event.longitude) return null;
      const distanceKm = haversineDistance(
        userLat, userLon,
        event.latitude, event.longitude,
      );
      return { ...event, distanceKm: Math.round(distanceKm * 10) / 10 };
    })
    .filter((e): e is EventItem & { distanceKm: number } =>
      e !== null && e.distanceKm <= radiusKm,
    )
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);

  return {
    success: true,
    count: eventsWithDistance.length,
    events: eventsWithDistance,
  };
}

// ==========================================
// 🔴 8. 取得品牌故事頁面內容（新增）
// ==========================================================

export async function getBrandStoryBlocks(): Promise<PageContent | null> {
  try {
    const blocks = await getPageBlocks(BRAND_STORY_PAGE_ID);
    return { success: true, blocks };
  } catch (err) {
    console.error('[brand-story] fetch failed:', err);
    return null;
  }
}

// ==========================================
// 🔴 9. 取得精彩花絮投稿列表（直接讀 Inbox DB，篩選已發布 + 有照片的投稿）
// ==========================================

export async function getGalleryPhotos(): Promise<{
  success: boolean;
  photos: GalleryPhoto[];
}> {
  try {
    // 篩選已發布，且「素材檔案」或「照片補充」或「素材連結」任一有值
    const response = await notion.databases.query({
      database_id: INBOX_DB_ID,
      filter: {
        and: [
          { property: '狀態', status: { equals: '已發布' } },
          {
            or: [
              { property: '素材檔案', files: { is_not_empty: true } },
              { property: '照片補充', url: { is_not_empty: true } },
              { property: '素材連結', url: { is_not_empty: true } },
            ],
          },
        ],
      },
      sorts: [
        { property: '拍攝日期', direction: 'descending' },
      ],
    });

    const photos: GalleryPhoto[] = [];

    for (const page of response.results as any[]) {
      const props = page.properties;
      const title = getRichTextPlain(props['照片主題']) || getTitle(props['活動名稱']);
      const contributor = getRichTextPlain(props['LINE 暱稱']) || '匿名廟友';
      const eventType = props['投稿類型']?.select?.name || '';
      const dateStart = props['拍攝日期']?.date?.start
        || props['日期']?.date?.start || '';
      const city = props['縣市']?.select?.name || '';
      const district = props['行政區']?.select?.name || '';

      // 圖片優先順序：素材檔案 → 照片補充 → 素材連結
      const fileUrls = getFiles(props['素材檔案']);
      const coverUrl =
        fileUrls[0] ||
        props['照片補充']?.url ||
        props['素材連結']?.url ||
        '';

      if (coverUrl) {
        photos.push({
          id: page.id,
          title,
          coverUrl,
          contributor,
          eventType,
          date: dateStart,
          city,
          district,
        });
      }
    }

    return { success: true, photos };
  } catch (err) {
    console.error('[gallery] fetch failed:', err);
    return { success: false, photos: [] };
  }
}

// ==========================================
// 🔴 10. 取得工商服務合作夥伴列表（新增）
// ==========================================

export async function getPartners(): Promise<{
  success: boolean;
  partners: Partner[];
}> {
  try {
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

    const partners: Partner[] = response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        name: getTitle(props['商家名稱']),
        category: (props['類別']?.multi_select || []).map(
          (s: any) => s.name,
        ),
        description:
          getRichTextPlain(props['服務項目特色']) || '',
        website: props['商家網站']?.url || '',
        status: props['合約狀態']?.status?.name || '',
        exposureLevel:
          props['前台曝光等級']?.select?.name || '基本',
      };
    });

    return { success: true, partners };
  } catch (err) {
    console.error('[sponsors] fetch failed:', err);
    return { success: false, partners: [] };
  }
}

// ==========================================
// 🔴 11. 用 ID 取得單一商家詳情 + 頁面 Blocks（新增）
// ==========================================

export async function getPartnerById(
  id: string,
): Promise<PartnerDetail | null> {
  // UUID 格式驗證，防止 IDOR 攻擊
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(id)) {
    return null;
  }

  try {
    const page = await notion.pages.retrieve({ page_id: id }) as any;
    const props = page.properties;

    // 確認是合作中的商家
    const status = props['合約狀態']?.status?.name;
    if (status !== '合作中') return null;

    // 取得頁面 Block 內容
    const blocks = await getPageBlocks(id);

    // 取得封面圖（從頁面 cover 或商家封面屬性）
    const coverImage =
      page.cover?.file?.url ||
      page.cover?.external?.url ||
      '';

    return {
      id: page.id,
      name: getTitle(props['商家名稱']),
      category: (props['類別']?.multi_select || []).map(
        (s: any) => s.name,
      ),
      description:
        getRichTextPlain(props['服務項目']) || '',
      features:
        getRichTextPlain(props['服務項目特色']) || '',
      website: props['商家網站']?.url || '',
      phone: props['電話']?.phone_number || '',
      email: props['電子郵件']?.email || '',
      coverImage,
      status,
      exposureLevel:
        props['前台曝光等級']?.select?.name || '基本',
      blocks,
    };
  } catch (err) {
    console.error('[sponsor detail] fetch failed:', err);
    return null;
  }
}

// ==========================================
// 🔴 12. 取得所有合作中商家的 ID（SSG 用）（新增）
// ==========================================

export async function getPartnerSlugs(): Promise<string[]> {
  try {
    const response = await notion.databases.query({
      database_id: PARTNERS_DB_ID,
      filter: {
        property: '合約狀態',
        status: { equals: '合作中' },
      },
    });
    return response.results.map((page: any) => page.id);
  } catch {
    return [];
  }
}

// ==========================================
// 🔴 13. 取得周邊推薦店家（新增）
// ==========================================

export async function getNearbySpots(options?: {
  eventId?: string;
  category?: string;
  limit?: number;
}): Promise<{ success: boolean; spots: NearbySpot[] }> {
  const { eventId, category, limit = 10 } = options || {};

  const filters: any[] = [
    { property: '發佈', checkbox: { equals: true } },
  ];

  if (eventId) {
    filters.push({
      property: '🏮 關聯活動',
      relation: { contains: eventId },
    });
  }

  if (category) {
    filters.push({
      property: '類型',
      select: { equals: category },
    });
  }

  try {
    const response = await notion.databases.query({
      database_id: NEARBY_DB_ID,
      filter: { and: filters },
      page_size: limit,
    });

    const spots: NearbySpot[] = response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        name: getTitle(props['店家名稱']),
        category: props['類型']?.select?.name || '',
        summary: getRichTextPlain(props['店家簡介']),
        coupon: getRichTextPlain(props['優惠內容']),
        distance: props['距離活動路線']?.select?.name || '',
        googleMaps: props['Google Maps']?.url || '',
        phone: props['電話']?.phone_number || '',
        tags: (props['標籤']?.multi_select || []).map(
          (s: any) => s.name,
        ),
        coverImage: getFiles(props['店家照片'])?.[0] || '',
      };
    });

    return { success: true, spots };
  } catch (err) {
    console.error('[nearby] fetch failed:', err);
    return { success: false, spots: [] };
  }
}

// ==========================================
// 🔴 14. 取得當前有效優惠券列表（新增）
// ==========================================

export async function getCoupons(options?: {
  eventId?: string;
  limit?: number;
}): Promise<{ success: boolean; spots: NearbySpot[] }> {
  const { eventId, limit = 10 } = options || {};

  const filters: any[] = [
    { property: '發佈', checkbox: { equals: true } },
    { property: '優惠內容', rich_text: { is_not_empty: true } },
    { property: '合作狀態', status: { equals: '合作中' } },
  ];

  if (eventId) {
    filters.push({
      property: '🏮 關聯活動',
      relation: { contains: eventId },
    });
  }

  try {
    const response = await notion.databases.query({
      database_id: NEARBY_DB_ID,
      filter: { and: filters },
      page_size: limit,
    });

    const spots: NearbySpot[] = response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        name: getTitle(props['店家名稱']),
        category: props['類型']?.select?.name || '',
        summary: getRichTextPlain(props['店家簡介']),
        coupon: getRichTextPlain(props['優惠內容']),
        distance: props['距離活動路線']?.select?.name || '',
        googleMaps: props['Google Maps']?.url || '',
        phone: props['電話']?.phone_number || '',
        tags: (props['標籤']?.multi_select || []).map(
          (s: any) => s.name,
        ),
        coverImage: getFiles(props['店家照片'])?.[0] || '',
      };
    });

    return { success: true, spots };
  } catch (err) {
    console.error('[coupons] fetch failed:', err);
    return { success: false, spots: [] };
  }
}

// ==========================================
// 🔴 15. 取得合作中工商夾伴（LINE 活動卡片穿插廣告用）（新增）
// ==========================================

export async function getActiveSponsors() {
  const partnersDbId = NOTION_CONFIG.databases.partners;
  if (!partnersDbId) return { sponsors: [] };

  try {
    const response = await notion.databases.query({
      database_id: partnersDbId,
      filter: {
        property: '合約狀態',
        status: { equals: '合作中' },
      },
      page_size: 10,
    });

    const sponsors = response.results.map((page: any) => {
      const props = page.properties;
      return {
        name: props['商家名稱']?.title?.[0]?.plain_text || '',
        feature: props['服務項目特色']?.rich_text?.[0]?.plain_text || '',
        website: props['商家網站']?.url || '',
        level: props['前台曝光等級']?.select?.name || '基本',
        categories: props['類別']?.multi_select?.map((s: any) => s.name) || [],
      };
    });

    // 依曝光等級排序：精選 > 進階 > 基本
    const levelOrder: Record<string, number> = { '精選': 0, '進階': 1, '基本': 2 };
    sponsors.sort((a: any, b: any) =>
      (levelOrder[a.level] ?? 99) - (levelOrder[b.level] ?? 99)
    );

    return { sponsors };
  } catch (err) {
    console.error('[notion] getActiveSponsors error:', err);
    return { sponsors: [] };
  }
}

// ==========================================
// 內部工具函式（原有）
// ==========================================================

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
    // 🔴 新增：GPS 座標
    latitude: props['緯度']?.number ?? null,
    longitude: props['經度']?.number ?? null,
  };
}

function getTitle(prop: any): string {
  return prop?.title?.map((t: any) => t.plain_text).join('') || '';
}

function getRichTextPlain(prop: any): string {
  return (
    prop?.rich_text?.map((t: any) => t.plain_text).join('') || ''
  );
}

function getFiles(prop: any): string[] {
  if (!prop?.files?.length) return [];
  return prop.files
    .map((f: any) =>
      f.type === 'file'
        ? f.file.url
        : f.type === 'external'
          ? f.external.url
          : '',
    )
    .filter(Boolean);
}

// ---- Block 解析（原有） ----

function parseRichText(rt: any): RichText {
  const result: RichText = { text: rt.plain_text || '' };
  if (rt.annotations) {
    if (rt.annotations.bold) result.bold = true;
    if (rt.annotations.italic) result.italic = true;
    if (rt.annotations.underline) result.underline = true;
    if (rt.annotations.strikethrough) result.strikethrough = true;
    if (rt.annotations.code) result.code = true;
    if (rt.annotations.color !== 'default')
      result.color = rt.annotations.color;
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
      if (type.startsWith('heading_') && data.is_toggleable)
        result.is_toggleable = true;
      if (type === 'to_do') result.checked = !!data.checked;
      if (data.color && data.color !== 'default')
        result.color = data.color;
      break;

    case 'callout':
      result.rich_text = parseRichTextArray(data.rich_text);
      if (data.color && data.color !== 'default')
        result.color = data.color;
      if (data.icon?.type === 'emoji') result.icon = data.icon.emoji;
      break;

    case 'table':
      result.has_column_header = !!data.has_column_header;
      result.has_row_header = !!data.has_row_header;
      result.table_width = data.table_width || 0;
      break;

    case 'table_row':
      result.cells = (data.cells || []).map((cell: any[]) =>
        parseRichTextArray(cell),
      );
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
      if (data.rich_text)
        result.rich_text = parseRichTextArray(data.rich_text);
      break;
  }

  return result;
}

function groupListItems(blocks: NotionBlock[]): NotionBlock[] {
  const result: NotionBlock[] = [];
  let currentList: NotionBlock | null = null;

  for (const block of blocks) {
    const isList =
      block.type === 'bulleted_list_item' ||
      block.type === 'numbered_list_item';

    if (isList) {
      const listType =
        block.type === 'bulleted_list_item'
          ? 'bulleted_list'
          : 'numbered_list';
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