import React from 'react';
import { RichTextRenderer } from '../RichTextRenderer';
import type { NotionBlock } from '../NotionRenderer';

interface Props { block: NotionBlock; }

export function NotionImage({ block }: Props) {
  if (!block.url) return null;
  return (
    <figure className="notion-image">
      <img
        src={block.url}
        alt={block.caption?.map(c => c.text).join('') || ''}
        loading="lazy"
      />
      {block.caption && block.caption.length > 0 && (
        <figcaption className="notion-caption">
          <RichTextRenderer richText={block.caption} />
        </figcaption>
      )}
    </figure>
  );
}