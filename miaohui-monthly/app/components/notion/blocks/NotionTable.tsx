import React from 'react';
import { RichTextRenderer } from '../RichTextRenderer';
import type { NotionBlock } from '../NotionRenderer';

interface Props {
  block: NotionBlock;
}

export function NotionTable({ block }: Props) {
  if (!block.children || block.children.length === 0) return null;

  const hasColumnHeader = block.has_column_header;
  const hasRowHeader = block.has_row_header;

  return (
    <div className="notion-table-wrapper">
      <table className="notion-table">
        <tbody>
          {block.children.map((row, rowIdx) => {
            if (row.type !== 'table_row' || !row.cells) return null;
            const isHeaderRow = hasColumnHeader && rowIdx === 0;
            return (
              <tr
                key={row.id || rowIdx}
                className={isHeaderRow ? 'notion-table-header' : ''}
              >
                {row.cells.map((cell, cellIdx) => {
                  const isHeaderCell = hasRowHeader && cellIdx === 0;
                  const CellTag = isHeaderRow || isHeaderCell ? 'th' : 'td';
                  return (
                    <CellTag key={cellIdx} className="notion-table-cell">
                      <RichTextRenderer richText={cell} />
                    </CellTag>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
