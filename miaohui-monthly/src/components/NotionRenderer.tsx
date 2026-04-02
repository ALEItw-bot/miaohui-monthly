'use client';

import type { NotionBlock, RichText } from '@/types/notion';

// ---- Rich Text 渲染 ----
function RichTextSpan({ segments }: { segments: RichText[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        let el: React.ReactNode = seg.text;

        if (seg.bold) el = <strong key={`b${i}`}>{el}</strong>;
        if (seg.italic) el = <em key={`i${i}`}>{el}</em>;
        if (seg.underline) el = <u key={`u${i}`}>{el}</u>;
        if (seg.strikethrough) el = <s key={`s${i}`}>{el}</s>;
        if (seg.code) el = <code key={`c${i}`}>{el}</code>;
        if (seg.href) el = <a key={`a${i}`} href={seg.href} target="_blank" rel="noopener">{el}</a>;
        if (seg.color) el = <span key={`cl${i}`} className={`notion-color-${seg.color}`}>{el}</span>;

        return <span key={i}>{el}</span>;
      })}
    </>
  );
}

// ---- 單一 Block 渲染 ----
function Block({ block }: { block: NotionBlock }) {
  const { type, rich_text = [], children = [] } = block;

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <RichTextSpan segments={rich_text} />
          {children.length > 0 && <div className="indent">{children.map(b => <Block key={b.id} block={b} />)}</div>}
        </p>
      );

    case 'heading_1':
      return <h1><RichTextSpan segments={rich_text} /></h1>;
    case 'heading_2':
      return <h2><RichTextSpan segments={rich_text} /></h2>;
    case 'heading_3':
      return <h3><RichTextSpan segments={rich_text} /></h3>;

    case 'bulleted_list':
      return (
        <ul>
          {(block.items || []).map(item => (
            <li key={item.id}>
              <RichTextSpan segments={item.rich_text || []} />
              {item.children?.length ? item.children.map(b => <Block key={b.id} block={b} />) : null}
            </li>
          ))}
        </ul>
      );

    case 'numbered_list':
      return (
        <ol>
          {(block.items || []).map(item => (
            <li key={item.id}>
              <RichTextSpan segments={item.rich_text || []} />
              {item.children?.length ? item.children.map(b => <Block key={b.id} block={b} />) : null}
            </li>
          ))}
        </ol>
      );

    case 'to_do':
      return (
        <div className="todo">
          <input type="checkbox" checked={block.checked} readOnly />
          <RichTextSpan segments={rich_text} />
        </div>
      );

    case 'quote':
      return <blockquote><RichTextSpan segments={rich_text} /></blockquote>;

    case 'callout':
      return (
        <div className={`callout ${block.color || ''}`}>
          {block.icon && <span className="callout-icon">{block.icon}</span>}
          <div>
            <RichTextSpan segments={rich_text} />
            {children.map(b => <Block key={b.id} block={b} />)}
          </div>
        </div>
      );

    case 'toggle':
      return (
        <details>
          <summary><RichTextSpan segments={rich_text} /></summary>
          {children.map(b => <Block key={b.id} block={b} />)}
        </details>
      );

    case 'image':
      return (
        <figure>
          <img src={block.url} alt={block.caption?.map(c => c.text).join('') || ''} loading="lazy" />
          {block.caption?.length ? <figcaption><RichTextSpan segments={block.caption} /></figcaption> : null}
        </figure>
      );

    case 'video':
      return (
        <div className="video-embed">
          <iframe src={block.url} allowFullScreen />
        </div>
      );

    case 'code':
      return <pre><code className={`language-${block.language}`}><RichTextSpan segments={rich_text} /></code></pre>;

    case 'table':
      return (
        <table>
          <tbody>
            {children.map((row, rowIdx) => (
              <tr key={row.id}>
                {(row.cells || []).map((cell, cellIdx) => {
                  const Tag = (block.has_column_header && rowIdx === 0) || (block.has_row_header && cellIdx === 0) ? 'th' : 'td';
                  return <Tag key={cellIdx}><RichTextSpan segments={cell} /></Tag>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'divider':
      return <hr />;

    default:
      return rich_text.length ? <p><RichTextSpan segments={rich_text} /></p> : null;
  }
}

// ---- 主元件 ----
export function NotionRenderer({ blocks }: { blocks: NotionBlock[] }) {
  return (
    <div className="notion-renderer">
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}