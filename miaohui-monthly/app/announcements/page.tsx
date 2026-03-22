'use client';
import { useState } from 'react';

interface NewsItem {
  date: string;
  tag: string;
  tagClass: string;
  title: string;
  summary: string;
  link?: string;
}

// TODO: 之後改為從 GAS API 或靜態 JSON 動態讀取
const newsData: NewsItem[] = [
  {
    date: '2026-03-20',
    tag: '活動',
    tagClass: 'tag-event',
    title: '2026 大甲媽祖遶境進香 日期公布',
    summary: '今年大甲媽遶境定於農曆三月初五（國曆 4/21）子時起駕，預計為期九天八夜，詳細路線與注意事項請見活動頁。',
    link: '/events/dajia-2026',
  },
  {
    date: '2026-03-18',
    tag: '系統',
    tagClass: 'tag-system',
    title: '廟會月報官網全新改版上線',
    summary: '全新設計的廟會月報官網正式上線！新版採用更直覺的導覽設計，並支援手機瀏覽，讓您隨時掌握最新廟會動態。',
  },
  {
    date: '2026-03-15',
    tag: '活動',
    tagClass: 'tag-event',
    title: '2026 白沙屯媽祖進香 報名資訊',
    summary: '白沙屯媽祖進香即將展開，今年預計徒步全程約 400 公里。報名細節與裝備清單已在活動頁面公布。',
    link: '/events/baishatun-2026',
  },
  {
    date: '2026-03-10',
    tag: '廟會快訊',
    tagClass: 'tag-active',
    title: '全台三月份廟會活動總整理',
    summary: '三月份全台各地有超過 50 場大小廟會活動，包含遶境、進香、建醮、祈福法會等，完整清單看這邊。',
  },
  {
    date: '2026-03-08',
    tag: '系統',
    tagClass: 'tag-system',
    title: 'LINE 官方帳號新功能：投稿廟會資訊',
    summary: '現在您可以透過廟會月報 LINE 官方帳號直接投稿！傳送文字或照片，我們審核後將發布到官網。',
  },
  {
    date: '2026-03-05',
    tag: '活動',
    tagClass: 'tag-event',
    title: '北港朝天宮元宵遶境精彩回顧',
    summary: '北港朝天宮元宵遶境圓滿落幕，今年吸引超過十萬人共襄盛舉，精彩花絮已上傳至官網。',
  },
  {
    date: '2026-03-01',
    tag: '系統',
    tagClass: 'tag-system',
    title: '工商合作方案開放申請',
    summary: '廟會月報現開放工商合作夥伴申請，我們提供 LINE 推播、官網曝光、活動聯名等多元合作方案。',
  },
  {
    date: '2026-02-25',
    tag: '廟會快訊',
    tagClass: 'tag-active',
    title: '全台二月份廟會活動回顧',
    summary: '回顧二月份精彩的廟會活動，從南到北共計超過 30 場，各地信眾熱情參與。',
  },
];

const tagOptions = ['全部', '活動', '系統', '廟會快訊'];

export default function AnnouncementsPage() {
  const [activeTag, setActiveTag] = useState('全部');

  const filtered = activeTag === '全部'
    ? newsData
    : newsData.filter(item => item.tag === activeTag);

  return (
    <>
      <section className="announce-hero">
        <div className="container text-center">
          <h1 className="announce-hero-title">最新消息</h1>
          <p className="announce-hero-subtitle">廟會月報｜第一手廟會資訊都在這</p>
        </div>
      </section>

      <section className="announce-content">
        <div className="container">
          <div className="announce-filter">
            {tagOptions.map(tag => {
              const cls = 'announce-tag-btn' + (activeTag === tag ? ' active' : '');
              return (
                <button
                  key={tag}
                  className={cls}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="announce-list">
            {filtered.map((item, i) => (
              <a key={i} href={item.link || '#'} className="announce-card">
                <div className="announce-card-top">
                  <span className="announce-date">{item.date}</span>
                  <span className={'news-tag ' + item.tagClass}>{item.tag}</span>
                  <span className="announce-title">{item.title}</span>
                </div>
                <p className="announce-summary">{item.summary}</p>
              </a>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="announce-empty">目前沒有相關消息</div>
          )}
        </div>
      </section>
    </>
  );
}