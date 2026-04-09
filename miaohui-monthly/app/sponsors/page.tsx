import { getPartners } from '@/lib/notion';
import SponsorsClient from './SponsorsClient';
import type { Metadata } from 'next';

export const revalidate = 600;

export const metadata: Metadata = {
  title: '工商服務｜廟會月報',
  description: '廟口好厝邊，鬧熱來相挺！串聯全台廟會周邊專業服務',
};

export default async function SponsorsPage() {
  const data = await getPartners();
  return <SponsorsClient partners={data.partners} />;
}
