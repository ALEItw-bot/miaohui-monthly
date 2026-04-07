'use client';
import { NotionRenderer } from '@/components/NotionRenderer';
import type { NotionBlock } from '@/types/notion';
interface PageContent {
  success: boolean;
  blocks: NotionBlock[];
}

/** 移除開頭的標題 block（已由 story-page-header 顯示） */
function stripLeadingTitle(blocks: NotionBlock[]): NotionBlock[] {
  if (blocks.length === 0) return blocks;
  const first = blocks[0];
  if (first.type === 'heading_1' || first.type === 'heading_2' || first.type === 'heading_3') {
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
    return <div className="story-loading">載入失敗</div>;
  }

  const cleaned = stripLeadingTitle(page.blocks || []);
  const sections = splitByDivider(cleaned);

  return (
    <main>
      {/* ===== Hero 照片 ===== */}
      <section className="story-hero">
        <div className="container">
         <h1 className="story-hero-title">品牌故事</h1>
         <p className="story-hero-subtitle">廟會月報｜信仰的溫度，科技的傳承</p>
       </div>
</section>

      {/* ===== 內文區域（有背景底圖） ===== */}
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