'use client';

import { NotionRenderer } from '@/components/NotionRenderer';
import type { NotionBlock, PageContent } from '@/types/notion';

/** 移除開頭的標題 block（已由 Hero 顯示） */
function stripLeadingTitle(blocks: NotionBlock[]): NotionBlock[] {
  if (blocks.length === 0) return blocks;
  const first = blocks[0];
  if (
    first.type === 'heading_1' ||
    first.type === 'heading_2' ||
    first.type === 'heading_3'
  ) {
    return blocks.slice(1);
  }
  return blocks;
}

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
    return <div className="loading">載入失敗</div>;
  }

  const cleaned = stripLeadingTitle(page.blocks || []);
  const sections = splitByDivider(cleaned);

  return (
    <main>
      {/* Hero */}
      <section className="page-hero brand-story-hero">
        <div className="container">
          <h1 className="page-hero-title">品牌故事</h1>
          <p className="page-hero-subtitle">
            廟會月報｜信仰的溫度，科技的傳承
          </p>
        </div>
      </section>

      {/* 內文區域 */}
      <div className="story-body">
        {sections.map((sectionBlocks, index) => (
          <section key={index} className="story-section">
            <div className="story-card">
              <NotionRenderer blocks={sectionBlocks} />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}