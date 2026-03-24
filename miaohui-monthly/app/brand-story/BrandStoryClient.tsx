'use client';
import { NotionRenderer } from '../components/notion/NotionRenderer';
import type { PageContent, NotionBlock } from '../components/notion/NotionRenderer';

/** 用 divider 將 blocks 切分成多個 section */
function splitByDivider(blocks: NotionBlock[]): NotionBlock[][] {
  const sections: NotionBlock[][] = [];
  let current: NotionBlock[] = [];

  for (const block of blocks) {
    if (block.type === 'divider') {
      if (current.length > 0) {
        sections.push(current);
        current = [];
      }
    } else {
      current.push(block);
    }
  }
  if (current.length > 0) sections.push(current);
  return sections;
}

interface Props {
  page: PageContent | null;
}

export default function BrandStoryClient({ page }: Props) {
  if (!page || !page.success) {
    return <div className="story-loading">載入失敗</div>;
  }

  const sections = splitByDivider(page.blocks || []);

  return (
    <main>
      {/* ===== Hero 照片 ===== */}
      <section className="story-hero" />

      {/* ===== 內文區域（有背景底圖） ===== */}
      <div className="story-body">
        {/* 頁面標題（跳出白卡片） */}
        <div className="story-page-header">
          <h1 className="story-page-title">品牌故事</h1>
          <p className="story-page-subtitle">信仰的溫度，科技的傳承</p>
        </div>
        {sections.map((sectionBlocks, index) => (
          <section key={index} className="story-section">
            <div className="story-card">
              <NotionRenderer blocks={sectionBlocks} />
            </div>
          </section>
        ))}
      </div>

      {/* ===== CTA ===== */}
      <section className="story-cta-section">
        <div className="container">
          <p className="story-cta-text">
            歡迎回來，與我們一起見證科技與傳統交織的全新篇章
          </p>
          <p className="story-cta-sub">
            從過去的像素到現在的 AI 運算，《廟會月報》繼續為您遞送這份充滿溫度的信仰報表。
          </p>
          <div className="hero-cta">
            <a href="/" className="btn btn-cta-invert">回首頁</a>
            <a
              href="https://line.me/R/ti/p/@miaohui"
              className="btn btn-line-big"
              target="_blank"
              rel="noopener noreferrer"
            >
              加入 LINE 官方帳號
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}