import React from 'react';
import { RichTextRenderer } from '../RichTextRenderer';
import { BlockRenderer } from '../NotionRenderer';
import type { NotionBlock } from '../NotionRenderer';

interface Props {
  block: NotionBlock;
}

const CALLOUT_BG: Record<string, string> = {
  gray_background: '#f1f1ef',
  brown_background: '#f4eeee',
  orange_background: '#fbecdd',
  yellow_background: '#fbf3db',
  green_background: '#edf3ec',
  blue_background: '#e7f3f8',
  purple_background: '#f6f3f9',
  pink_background: '#f9f0f5',
  red_background: '#fdebec',
  default: '#f7f6f3',
};

export function Callout({ block }: Props) {
  const bgColor = block.color
    ? CALLOUT_BG[block.color] || CALLOUT_BG.default
    : CALLOUT_BG.default;

  const calloutStyle: React.CSSProperties = { backgroundColor: bgColor };

  return (
    <div className="notion-callout" style={calloutStyle}>
      {block.icon && (
        <span className="notion-callout-icon">
          {block.icon_type === 'url' ? (
            <img src={block.icon} alt="" width={24} height={24} />
          ) : (
            block.icon
          )}
        </span>
      )}
      <div className="notion-callout-content">
        <RichTextRenderer richText={block.rich_text} />
        {block.children && block.children.length > 0 && (
          <div className="notion-callout-children">
            {block.children.map((child, i) => (
              <BlockRenderer key={child.id || i} block={child} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
