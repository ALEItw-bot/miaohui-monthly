import React from 'react';
import { RichTextRenderer } from '../RichTextRenderer';
import { BlockRenderer } from '../NotionRenderer';
import type { NotionBlock } from '../NotionRenderer';

interface Props {
  block: NotionBlock;
}

export function BlockQuote({ block }: Props) {
  return (
    <blockquote className="notion-quote" data-color={block.color || undefined}>
      <RichTextRenderer richText={block.rich_text} />
      {block.children && block.children.length > 0 && (
        <div className="notion-quote-children">
          {block.children.map((child, i) => (
            <BlockRenderer key={child.id || i} block={child} />
          ))}
        </div>
      )}
    </blockquote>
  );
}
