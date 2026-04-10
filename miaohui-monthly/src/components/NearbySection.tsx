'use client';

import { useEffect, useState } from 'react';
import type { NearbySpot } from '@/types/notion';
import './nearby-section.css';

const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: '🍜 美食小吃', label: '🍜 美食' },
  { key: '⛩️ 順路廟宇', label: '⛩️ 廟宇' },
  { key: '🎯 景點體驗', label: '🎯 景點' },
  { key: '🛍️ 伴手禮', label: '🛍️ 伴手禮' },
  { key: '☕ 咖啡茶飲', label: '☕ 茶飲' },
];

export default function NearbySection({
  eventId,
}: {
  eventId: string;
}) {
  const [spots, setSpots] = useState<NearbySpot[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ eventId });
    if (activeCategory !== 'all') {
      params.set('category', activeCategory);
    }

    setLoading(true);
    fetch(`/api/nearby?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setSpots(data.spots || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId, activeCategory]);

  if (!loading && spots.length === 0 && activeCategory === 'all') {
    return null; // 完全沒有店家時不顯示整個區塊
  }

  return (
    <section id="nearby" className="nearby-section">
      <div className="nearby-header">
        <h2 className="nearby-title">📍 周邊推薦</h2>
        <p className="nearby-subtitle">
          遶境沿途好吃好玩的都在這！
        </p>
      </div>

      {/* 分類篩選 */}
      <div className="nearby-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`nearby-tab ${
              activeCategory === cat.key ? 'nearby-tab-active' : ''
            }`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 店家卡片 */}
      {loading ? (
        <div className="nearby-loading">
          <span>🏮</span> 載入中...
        </div>
      ) : spots.length === 0 ? (
        <div className="nearby-empty">
          此分類目前沒有推薦店家
        </div>
      ) : (
        <div className="nearby-grid">
          {spots.map((spot) => (
            <div key={spot.id} className="nearby-card">
              <div className="nearby-card-image">
                {spot.coverImage ? (
                  <img
                    src={spot.coverImage}
                    alt={spot.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="nearby-card-placeholder">
                    🏮
                  </div>
                )}
              </div>
              <div className="nearby-card-body">
                <div className="nearby-card-meta">
                  <span className="nearby-card-category">
                    {spot.category}
                  </span>
                  <span className="nearby-card-distance">
                    {spot.distance}
                  </span>
                </div>
                <h3 className="nearby-card-name">{spot.name}</h3>
                <p className="nearby-card-summary">{spot.summary}</p>
                {spot.coupon && (
                  <div className="nearby-card-coupon">
                    🎫 {spot.coupon}
                  </div>
                )}
                <div className="nearby-card-tags">
                  {spot.tags.map((tag) => (
                    <span key={tag} className="nearby-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="nearby-card-actions">
                {spot.googleMaps && (
                  <a
                    href={spot.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nearby-btn nearby-btn-primary"
                  >
                    📍 導航
                  </a>
                )}
                {spot.phone && (
                  <a
                    href={`tel:${spot.phone}`}
                    className="nearby-btn nearby-btn-secondary"
                  >
                    📞 電話
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}