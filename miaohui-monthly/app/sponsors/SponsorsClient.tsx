'use client';

import { useState } from 'react';
import './sponsors.css';

interface Partner {
  id: string;
  name: string;
  category: string[];
  description: string;
  website: string;
  status: string;
  exposureLevel: string;
}

const CATEGORIES = [
  '全部', '海報文宣', '平面攝影', '影像紀錄',
  '祭祀用品', '陣頭演出', '文創商品', '活動企劃', '團體服飾',
];

export default function SponsorsClient({ partners }: { partners: Partner[] }) {
  const [active, setActive] = useState('全部');

  const filtered =
    active === '全部'
      ? partners
      : partners.filter((p) => p.category.includes(active));

  return (
    <>
      {/* Hero */}
      <section className="sponsors-hero">
        <div className="container">
          <h1 className="sponsors-hero-title">工商服務</h1>
          <p className="sponsors-hero-desc">廟口好厝邊，鬧熱來相挺！串聯全台廟會周邊專業服務</p>
        </div>
      </section>

      {/* Body */}
      <section className="sponsors-body">
        <div className="container">

          {/* Filter Tabs — 跟熱鬧資訊的區域按鈕同樣式 */}
          <div className="sponsors-filter">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`sponsors-filter-btn ${active === cat ? 'active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List Header — 跟熱鬧資訊的標題列同樣式 */}
          <div className="sponsors-list-header">
            <h2 className="sponsors-list-title">合作夥伴</h2>
            <span className="sponsors-list-count">共 {filtered.length} 家</span>
          </div>

          {/* Partners Grid */}
          {filtered.length === 0 ? (
            <div className="sponsors-empty">
              <span className="sponsors-empty-icon">🏮</span>
              <p>此類別目前尚無合作夥伴，歡迎洽談合作！</p>
            </div>
          ) : (
            <div className="sponsors-grid">
              {filtered.map((partner) => (
                <div
                  key={partner.id}
                  className={`sponsor-card ${partner.exposureLevel === '精選' ? 'sponsor-featured' : ''}`}
                >
                  {partner.exposureLevel === '精選' && (
                    <span className="sponsor-badge">⭐ 精選夥伴</span>
                  )}
                  <h3 className="sponsor-card-name">{partner.name}</h3>
                  <div className="sponsor-card-tags">
                    {partner.category.map((cat) => (
                      <span key={cat} className="sponsor-card-tag">{cat}</span>
                    ))}
                  </div>
                  {partner.description && (
                    <p className="sponsor-card-desc">{partner.description}</p>
                  )}
                  {partner.website && (
                    <a
                      href={partner.website}
                      className="sponsor-card-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      前往官網 →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="sponsors-cta">
        <div className="container">
          <h2 className="sponsors-cta-title">想成為廟會月報的合作夥伴？</h2>
          <p className="sponsors-cta-sub">不管你是個人工作室還是公司行號，想要為廟會文化盡一份心力，我們都歡迎！</p>
          <a
            href="https://line.me/R/ti/p/@583jmhcd"
            className="btn btn-cta-invert"
            target="_blank"
            rel="noopener noreferrer"
          >
            立即洽談合作
          </a>
        </div>
      </section>
    </>
  );
}