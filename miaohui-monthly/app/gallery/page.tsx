import { getGalleryPhotos } from '@/lib/notion';
import GalleryClient from './GalleryClient';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '精彩花絮｜廟會月報',
  description: '廟友投稿的第一手廟會現場照片，用鏡頭記錄信仰的溫度',
};

export default async function GalleryPage() {
  const data = await getGalleryPhotos();
  return <GalleryClient photos={data.photos} />;
}