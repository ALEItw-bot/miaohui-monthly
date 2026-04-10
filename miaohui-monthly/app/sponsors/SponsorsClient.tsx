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

      {/* 合作方式 */}
      <section className="sponsors-collab">
        <div className="container">
          <h2 className="sponsors-collab-title">🤝 合作方式</h2>
          <p className="sponsors-collab-intro">
            不管你是個人工作室還是公司行號，只要與廟會文化相關，我們都歡迎！
          </p>

          <div className="collab-cards">
            {/* 贊助檔期 */}
            <div className="collab-card card" id="schedule">
              <div className="collab-card-icon">📅</div>
              <h3 className="collab-card-title">贊助檔期</h3>
              <p className="collab-card-desc">
                配合全台各地廟會活動檔期，提供品牌曝光與現場露出機會。單次檔期或系列合作皆可客製，讓你的品牌在最鬧熱的時刻被看見！
              </p>
              <ul className="collab-card-list">
                <li>主舞台立牌 &amp; 布條露出</li>
                <li>活動頁面品牌專區</li>
                <li>LINE 推播活動提醒品牌露出</li>
              </ul>
            </div>

            {/* 聯名贈品 */}
            <div className="collab-card card" id="collab">
              <div className="collab-card-icon">🎁</div>
              <h3 className="collab-card-title">聯名贈品</h3>
              <p className="collab-card-desc">
                與廟會月報聯名推出結緣品、周邊小物，把信仰融入日常好物，讓品牌好感度大幅提升！
              </p>
              <ul className="collab-card-list">
                <li>聯名結緣品 &amp; 互動攤位</li>
                <li>Q版神明公仔、平安符周邊</li>
                <li>活動花絮短片品牌露出</li>
              </ul>
            </div>

            {/* 優惠導購 */}
            <div className="collab-card card" id="promo">
              <div className="collab-card-icon">🛒</div>
              <h3 className="collab-card-title">優惠導購</h3>
              <p className="collab-card-desc">
                透過官網與 LINE 官方頻道導流，將廟會活動的高人氣轉換為實際消費力，線上線下整合一次搞定！
              </p>
              <ul className="collab-card-list">
                <li>官網工商服務頁連結導流</li>
                <li>LINE 圖文貼文優惠推播</li>
                <li>合作店家專題採訪曝光</li>
              </ul>
            </div>
          </div>

          {/* 曝光資源 */}
          <div className="collab-exposure">
            <h3 className="collab-exposure-title">📢 曝光資源一覽</h3>
            <div className="exposure-table-wrap">
              <table className="exposure-table">
                <thead>
                  <tr>
                    <th>曝光管道</th>
                    <th>內容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>🌐 品牌官網</td>
                    <td>工商服務頁面曝光、合作夥伴專區露出、活動頁連結導流</td>
                  </tr>
                  <tr>
                    <td>💬 LINE 官方頻道</td>
                    <td>置頂推播、圖文貼文、活動提醒中品牌露出</td>
                  </tr>
                  <tr>
                    <td>🎪 現場活動</td>
                    <td>主舞台立牌、路線沿線布條、互動攤位、結緣品聯名</td>
                  </tr>
                  <tr>
                    <td>📹 內容合作</td>
                    <td>活動花絮短片品牌露出、合作店家專題採訪</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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