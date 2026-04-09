import { getGalleryPhotos } from '@/lib/notion';
import GalleryClient from './GalleryClient';
import type { Metadata } from 'next';

export const revalidate = 600;

export const metadata: Metadata = {
  title: '精彩花絮｜廟會月報',
  description: '現場直擊，用鏡頭感受廟會的鬧熱與感動',
};

export default async function GalleryPage() {
  const data = await getGalleryPhotos();
  return <GalleryClient photos={data.photos} />;
}
