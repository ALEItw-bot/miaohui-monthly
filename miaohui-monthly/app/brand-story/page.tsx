import BrandStoryClient from './BrandStoryClient';
import type { PageContent } from '../components/notion/NotionRenderer';
import '../styles/notion-article.css';

const BRAND_STORY_PAGE_ID = '3274cb8807f28092b955c9eb108e2f20';

// ISR: 每 10 分鐘重新生成
export const revalidate = 600;

async function fetchBrandStory(): Promise<PageContent | null> {
  const GAS_URL = process.env.GAS_DEPLOY_URL || '';
  const GAS_KEY = process.env.GAS_API_KEY || '';

  if (!GAS_URL) return null;

  try {
    const url = `${GAS_URL}?action=getPageContent&pageId=${BRAND_STORY_PAGE_ID}&key=${GAS_KEY}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export default async function BrandStoryPage() {
  const page = await fetchBrandStory();
  return <BrandStoryClient page={page} />;
}