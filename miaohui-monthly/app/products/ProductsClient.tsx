'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/notion';
import './products.css';

type ViewMode = 'list' | 'grid';

function formatTwd(n: number | null | undefined): string {
  const value = typeof n === 'number' ? n : 0;
  return value.toLocaleString('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  });
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const [view, setView] = useState<ViewMode>('grid');

  const published = useMemo(
    () => products.filter((p) => p.status === '販售中' || p.status === '上架'),
    [products]
  );

  return (
    <main>
      {/* Hero */}
      <section className="page-hero products-hero">
        <div className="container">
          <h1 className="page-hero-title">周邊商品</h1>
          <p className="page-hero-subtitle">
            喜歡廟會月報，也想把信仰的鬧熱帶回家<br />
            服飾、配件、生活小物一次看
          </p>
        </div>
      </section>

      <section className="products-body">
        <div className="container">
          {/* 顯示切換 */}
          <div className="products-toolbar">
            <div className="products-toolbar-left">
              <div className="list-header">
                <h2 className="list-header-title">商品列表</h2>
                <span className="list-header-count">共 {published.length} 件</span>
              </div>
            </div>

            <div className="products-toolbar-right">
              <button
                className={`view-toggle ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
              >
                條列
              </button>
              <button
                className={`view-toggle ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
              >
                圖文
              </button>
            </div>
          </div>

          {/* 空狀態 */}
          {published.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🛍️</span>
              <p>目前尚無上架商品，敬請期待。</p>
            </div>
          ) : view === 'list' ? (
            <div className="products-list">
              {published.map((p) => (
                <div key={p.id} className="product-row card">
                  <div className="product-row-img">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        width={140}
                        height={105}
                        unoptimized
                      />
                    ) : (
                      <div className="product-img-placeholder">📦</div>
                    )}
                  </div>

                  <div className="product-row-main">
                    <h3 className="product-name">{p.name}</h3>
                    {p.spec && <p className="product-spec">{p.spec}</p>}
                  </div>

                  <div className="product-row-price">{formatTwd(p.price)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {published.map((p) => (
                <div key={p.id} className="product-card card">
                  <div className="product-card-img">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        width={600}
                        height={450}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="product-img-placeholder">📦</div>
                    )}
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-name">{p.name}</h3>
                    {p.spec && <p className="product-spec">{p.spec}</p>}
                    <div className="product-price">{formatTwd(p.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}