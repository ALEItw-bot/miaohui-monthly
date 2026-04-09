import React from 'react';
import type { NotionBlock } from '../NotionRenderer';

interface Props {
  block: NotionBlock;
}

export function CodeBlock({ block }: Props) {
  const code = block.rich_text?.map((rt) => rt.text).join('') || '';
  const language = block.language || 'plaintext';

  return (
    <div className="notion-code-block">
      <div className="notion-code-header">
        <span className="notion-code-lang">{language}</span>
      </div>
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
