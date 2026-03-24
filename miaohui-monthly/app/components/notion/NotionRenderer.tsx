import React from 'react';
import { Paragraph } from './blocks/Paragraph';
import { Heading } from './blocks/Heading';
import { BlockQuote } from './blocks/BlockQuote';
import { Callout } from './blocks/Callout';
import { BulletList, NumberedList } from './blocks/List';
import { NotionTable } from './blocks/NotionTable';
import { NotionImage } from './blocks/NotionImage';
import { Divider } from './blocks/Divider';
import { Toggle } from './blocks/Toggle';
import { CodeBlock } from './blocks/CodeBlock';
import { RichTextRenderer } from './RichTextRenderer';

export interface RichText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
  href?: string;
  mention?: { type: string; date?: any };
  equation?: string;
}

export interface NotionBlock {
  id?: string;
  type: string;
  rich_text?: RichText[];
  children?: NotionBlock[];
  icon?: string;
  icon_type?: string;
  color?: string;
  url?: string;
  caption?: RichText[];
  expiry_time?: string;
  has_column_header?: boolean;
  has_row_header?: boolean;
  table_width?: number;
  cells?: RichText[][];
  items?: NotionBlock[];
  language?: string;
  is_toggleable?: boolean;
  checked?: boolean;
}

export interface PageContent {
  success: boolean;
  pageId?: string;
  title?: string;
  icon?: { type: string; value: string };
  cover?: string;
  blocks?: NotionBlock[];
  fetchedAt?: string;
  error?: string;
}

interface BlockRendererProps {
  block: NotionBlock;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'paragraph':
      return <Paragraph block={block} />;
    case 'heading_1':
      return <Heading block={block} level={1} />;
    case 'heading_2':
      return <Heading block={block} level={2} />;
    case 'heading_3':
      return <Heading block={block} level={3} />;
    case 'quote':
      return <BlockQuote block={block} />;
    case 'callout':
      return <Callout block={block} />;
    case 'bulleted_list':
      return <BulletList block={block} />;
    case 'numbered_list':
      return <NumberedList block={block} />;
    case 'table':
      return <NotionTable block={block} />;
    case 'image':
      return <NotionImage block={block} />;
    case 'divider':
      return <Divider />;
    case 'toggle':
      return <Toggle block={block} />;
    case 'code':
      return <CodeBlock block={block} />;
    case 'to_do':
      return (
        <div className={`notion-todo ${block.checked ? 'checked' : ''}`}>
          <input type="checkbox" checked={block.checked} readOnly />
          <span><RichTextRenderer richText={block.rich_text} /></span>
        </div>
      );
    case 'bookmark':
    case 'embed':
      return (
        <div className="notion-bookmark">
          <a href={block.url} target="_blank" rel="noopener noreferrer">
            {block.url}
          </a>
          {block.caption && block.caption.length > 0 && (
            <p className="notion-caption">
              <RichTextRenderer richText={block.caption} />
            </p>
          )}
        </div>
      );
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[NotionRenderer] 未支援的 block type: ${block.type}`);
      }
      return null;
  }
}

export { RichTextRenderer } from './RichTextRenderer';

interface NotionRendererProps {
  blocks: NotionBlock[];
  className?: string;
}

export function NotionRenderer({ blocks, className }: NotionRendererProps) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <article className={`notion-content ${className || ''}`}>
      {blocks.map((block, index) => (
        <BlockRenderer key={block.id || `block-${index}`} block={block} />
      ))}
    </article>
  );
}