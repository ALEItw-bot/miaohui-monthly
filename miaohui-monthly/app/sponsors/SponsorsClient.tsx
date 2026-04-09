'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Partner } from '@/types/notion';
import { SPONSOR_CATEGORIES, SOCIAL_LINKS } from '@/lib/constants';
import './sponsors.css';

export default function SponsorsClient({ partners }: { partners: Partner[] }) {
  const [active, setActive] = useState('全部');

  const filtered =
    active === '全部'
      ? partners
      : partners.filter((p) => p.category.includes(active));

  return (
    <>
      {/* Hero */}
      <section className="page-hero sponsors-hero">
        <div className="container">
          <h1 className="page-hero-title">工商服務</h1>
          <p className="page-hero-subtitle">
            廟口好厝邊，鬧熱來相挺！串聯全台廟會周邊專業服務
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="sponsors-body">
        <div className="container">
          {/* 篩選 */}
          <div className="filter-pills">
            {SPONSOR_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${active === cat ? 'active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 列表標題 */}
          <div className="list-header">
            <h2 className="list-header-title">合作夥伴</h2>
            <span className="list-header-count">共 {filtered.length} 家</span>
          </div>

          {/* Partners Grid */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🏮</span>
              <p>此類別目前尚無合作夥伴，歡迎洽談合作！</p>
            </div>
          ) : (
            <div className="sponsors-grid">
              {filtered.map((partner) => (
                <Link
                  key={partner.id}
                  href={`/sponsors/${partner.id}`}
                  className={`sponsor-card card ${
                    partner.exposureLevel === '精選' ? 'sponsor-featured' : ''
                  }`}
                >
                  {partner.exposureLevel === '精選' && (
                    <span className="sponsor-badge">⭐ 精選夥伴</span>
                  )}
                  <h3 className="sponsor-card-name">{partner.name}</h3>
                  <div className="sponsor-card-tags">
                    {partner.category.map((cat) => (
                      <span key={cat} className="tag tag--red">
                        {cat}
                      </span>
                    ))}
                  </div>
                  {partner.description && (
                    <p className="sponsor-card-desc">{partner.description}</p>
                  )}
                  <span className="sponsor-card-detail">查看詳情 →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="sponsors-cta">
        <div className="container">
          <h2 className="sponsors-cta-title">
            想成為廟會月報的合作夥伴？
          </h2>
          <p className="sponsors-cta-sub">
            不管你是個人工作室還是公司行號，只要與廟會文化相關，我們都歡迎！
          </p>
          <a
            href={SOCIAL_LINKS.line}
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