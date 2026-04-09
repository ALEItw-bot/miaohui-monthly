import { getAnnouncements } from '@/lib/notion';
import AnnouncementsClient from './AnnouncementsClient';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '最新消息｜廟會月報',
  description: '廟會月報｜第一手廟會資訊都在這',
};

export default async function AnnouncementsPage() {
  const data = await getAnnouncements({ limit: 50 });
  return <AnnouncementsClient announcements={data.announcements} />;
}