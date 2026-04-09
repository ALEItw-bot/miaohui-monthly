import React from 'react';
import { RichTextRenderer } from '../RichTextRenderer';
import { BlockRenderer } from '../NotionRenderer';
import type { NotionBlock } from '../NotionRenderer';

interface Props {
  block: NotionBlock;
}

export function Toggle({ block }: Props) {
  return (
    <details className="notion-toggle" data-color={block.color || undefined}>
      <summary className="notion-toggle-summary">
        <RichTextRenderer richText={block.rich_text} />
      </summary>
      {block.children && block.children.length > 0 && (
        <div className="notion-toggle-content">
          {block.children.map((child, i) => (
            <BlockRenderer key={child.id || i} block={child} />
          ))}
        </div>
      )}
    </details>
  );
}
