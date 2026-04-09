import { getBrandStoryBlocks } from '@/lib/notion';
import BrandStoryClient from './BrandStoryClient';
import type { Metadata } from 'next';

export const revalidate = 600;

export const metadata: Metadata = {
  title: '品牌故事｜廟會月報',
  description:
    '從 2012 年的一個念頭，到台灣最完整的廟會資訊平台。信仰的溫度，科技的傳承。',
};

export default async function BrandStoryPage() {
  const page = await getBrandStoryBlocks();
  return <BrandStoryClient page={page} />;
}
