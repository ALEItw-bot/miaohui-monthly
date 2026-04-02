import { getEvents } from '@/lib/notion';
import EventListClient from './EventListClient';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '熱鬧資訊｜廟會月報',
  description: '全台廟會活動資訊，北中南外島一手掌握',
};

export default async function EventsPage() {
  // Server 端一次撈所有已發布活動（不限區域、拉多一點）
  const data = await getEvents({ limit: 100 });

  return <EventListClient events={data.events} />;
}