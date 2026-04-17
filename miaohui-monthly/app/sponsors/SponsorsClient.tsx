'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Partner } from '@/types/notion';
import { SPONSOR_CATEGORIES } from '@/lib/constants';
import './sponsors.css';

const CONTACT_EMAIL = 'alei.studio@gmail.com';

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
            廟口好厝邊，鬧熱來相挺！<br />
            不論是宮廟想宣傳廟會活動，或是周邊商家想讓更多人看見，歡迎來信洽詢。
          </p>
          <div className="page-hero-cta">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="btn btn-cta-invert"
            >
              ✉️ 來信洽詢
            </a>
          </div>
        </div>
      </section>

      {/* 邀請對象 */}
      <section className="sponsors-why">
        <div className="container">
          <h2 className="section-title">✨ 歡迎這樣的你</h2>
          <div className="why-grid">
            <div className="why-card card">
              <div className="why-card-icon">⛩️</div>
              <h3>宮廟單位</h3>
              <p>想讓更多人知道貴宮的繞境、進香、慶典等廟會活動資訊。</p>
            </div>
            <div className="why-card card">
              <div className="why-card-icon">🏪</div>
              <h3>周邊商家</h3>
              <p>廟口小吃、供品、陣頭、文創、攝影…任何與廟會文化相關的商家都歡迎。</p>
            </div>
            <div className="why-card card">
              <div className="why-card-icon">🤝</div>
              <h3>合作夥伴</h3>
              <p>有內容、活動、宣傳合作提案，也歡迎來信聊聊。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 曝光管道 */}
      <section className="sponsors-exposure">
        <div className="container">
          <h2 className="section-title">📢 曝光管道</h2>
          <div className="exposure-table-wrap">
            <table className="exposure-table">
              <thead>
                <tr>
                  <th>管道</th>
                  <th>內容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>🌐 品牌官網</td>
                  <td>工商服務頁面露出、合作夥伴專區、活動頁連結導流</td>
                </tr>
                <tr>
                  <td>💬 LINE 官方頻道</td>
                  <td>圖文貼文、活動推播、消息中品牌露出</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 目前的合作夥伴 */}
      <section className="sponsors-body">
        <div className="container">
          <h2 className="section-title">🤝 合作夥伴</h2>

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

          <div className="list-header">
            <h3 className="list-header-title">合作夥伴</h3>
            <span className="list-header-count">共 {filtered.length} 家</span>
          </div>

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
          <h2 className="sponsors-cta-title">想讓更多人看見你的廟會或店家嗎？</h2>
          <p className="sponsors-cta-sub">
            你是宮廟想宣傳廟會活動，或是周邊商家想要曝光，歡迎來信洽詢喔～
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="btn btn-cta-invert"
          >
            ✉️ {CONTACT_EMAIL}
          </a>
        </div>
      </section>
    </>
  );
}