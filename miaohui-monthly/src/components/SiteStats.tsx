'use client';

import { useEffect, useState } from 'react';

function getVisitorId(): string {
  const key = 'mh_visitor_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function SiteStats() {
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);

  useEffect(() => {
    const visitorId = getVisitorId();

    const report = async (type: 'pageview' | 'heartbeat') => {
      try {
        const res = await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId, type }),
        });
        const data = await res.json();
        setTotalViews(data.totalViews);
        setOnlineCount(data.onlineCount);
      } catch {
        // 靜默失敗，不影響使用者體驗
      }
    };

    report('pageview');

    // 每 60 秒心跳，維持「在線」狀態（不增加總瀏覽數）
    const heartbeat = setInterval(() => report('heartbeat'), 60_000);
    return () => clearInterval(heartbeat);
  }, []);

  if (totalViews === null) return null;

  return (
    <p className="site-stats-text">
      累計瀏覽 {totalViews.toLocaleString()} 次 ｜ 目前在線 {onlineCount ?? 0} 人
    </p>
  );
}