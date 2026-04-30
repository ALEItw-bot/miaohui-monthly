import { getProducts } from '@/lib/notion';
import ProductsClient from './ProductsClient';
import type { Metadata } from 'next';

export const revalidate = 600;

export const metadata: Metadata = {
  title: '周邊商品｜廟會月報',
  description: '廟會月報周邊商品，精選服飾、配件與實用小物。',
};

export default async function ProductsPage() {
  const data = await getProducts({ limit: 200 });
  return <ProductsClient products={data.products} />;
}