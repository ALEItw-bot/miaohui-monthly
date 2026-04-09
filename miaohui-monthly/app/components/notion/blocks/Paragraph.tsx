import React from 'react';
import { RichTextRenderer } from '../RichTextRenderer';
import type { NotionBlock } from '../NotionRenderer';

interface Props {
  block: NotionBlock;
}

export function Paragraph({ block }: Props) {
  if (!block.rich_text || block.rich_text.length === 0) {
    return <p className="notion-paragraph notion-empty">&nbsp;</p>;
  }
  return (
    <p className="notion-paragraph" data-color={block.color || undefined}>
      <RichTextRenderer richText={block.rich_text} />
    </p>
  );
}
