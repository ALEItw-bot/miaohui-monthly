import React from 'react';
import { RichTextRenderer } from '../RichTextRenderer';
import type { NotionBlock } from '../NotionRenderer';

interface Props { block: NotionBlock; }

function ListItem({ item }: { item: NotionBlock }) {
  return (
    <li className="notion-list-item" data-color={item.color || undefined}>
      <RichTextRenderer richText={item.rich_text} />
      {item.children && item.children.length > 0 && (
        <ul className="notion-list-nested">
          {item.children.map((child, i) => (
            <ListItem key={child.id || i} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function BulletList({ block }: Props) {
  if (!block.items || block.items.length === 0) return null;
  return (
    <ul className="notion-bulleted-list">
      {block.items.map((item, i) => (
        <ListItem key={item.id || i} item={item} />
      ))}
    </ul>
  );
}

export function NumberedList({ block }: Props) {
  if (!block.items || block.items.length === 0) return null;
  return (
    <ol className="notion-numbered-list">
      {block.items.map((item, i) => (
        <ListItem key={item.id || i} item={item} />
      ))}
    </ol>
  );
}