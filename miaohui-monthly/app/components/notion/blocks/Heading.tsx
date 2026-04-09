import React from 'react';
import { RichTextRenderer } from '../RichTextRenderer';
import { BlockRenderer } from '../NotionRenderer';
import type { NotionBlock } from '../NotionRenderer';

interface Props {
  block: NotionBlock;
  level: 1 | 2 | 3;
}

export function Heading({ block, level }: Props) {
  const className = `notion-heading notion-h${level}`;
  const colorAttr = block.color || undefined;
  const content = <RichTextRenderer richText={block.rich_text} />;

  if (block.is_toggleable && block.children && block.children.length > 0) {
    return (
      <details className={`${className} notion-toggle-heading`}>
        <summary>{content}</summary>
        <div className="notion-toggle-content">
          {block.children.map((child, i) => (
            <BlockRenderer key={child.id || i} block={child} />
          ))}
        </div>
      </details>
    );
  }

  if (level === 1)
    return (
      <h1 className={className} data-color={colorAttr}>
        {content}
      </h1>
    );
  if (level === 2)
    return (
      <h2 className={className} data-color={colorAttr}>
        {content}
      </h2>
    );
  return (
    <h3 className={className} data-color={colorAttr}>
      {content}
    </h3>
  );
}
