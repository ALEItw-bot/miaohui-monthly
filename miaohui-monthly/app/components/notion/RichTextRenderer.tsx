import React from 'react';
import type { RichText } from './NotionRenderer';

const NOTION_COLORS: Record<string, string> = {
  gray: '#9B9A97', brown: '#64473A', orange: '#D9730D',
  yellow: '#DFAB01', green: '#0F7B6C', blue: '#0B6E99',
  purple: '#6940A5', pink: '#AD1A72', red: '#E03E3E',
};

const NOTION_BG_COLORS: Record<string, string> = {
  gray_background: '#F1F1EF', brown_background: '#F4EEEE',
  orange_background: '#FBECDD', yellow_background: '#FBF3DB',
  green_background: '#EDF3EC', blue_background: '#E7F3F8',
  purple_background: '#F6F3F9', pink_background: '#F9F0F5',
  red_background: '#FDEBEC',
};

interface RichTextRendererProps {
  richText?: RichText[];
}

export function RichTextRenderer({ richText }: RichTextRendererProps) {
  if (!richText || richText.length === 0) return null;
  return (
    <>
      {richText.map((rt, index) => (
        <RichTextSpan key={index} rt={rt} />
      ))}
    </>
  );
}

function RichTextSpan({ rt }: { rt: RichText }) {
  if (!rt.text && !rt.equation) return null;

  if (rt.equation) {
    return <code className="notion-equation">{rt.equation}</code>;
  }

  const style: React.CSSProperties = {};

  if (rt.color) {
    if (rt.color.endsWith('_background')) {
      const bgColor = NOTION_BG_COLORS[rt.color];
      if (bgColor) {
        style.backgroundColor = bgColor;
        style.padding = '2px 4px';
        style.borderRadius = '3px';
      }
    } else {
      const textColor = NOTION_COLORS[rt.color];
      if (textColor) style.color = textColor;
    }
  }

  if (rt.underline) {
    style.textDecoration = rt.strikethrough ? 'underline line-through' : 'underline';
  } else if (rt.strikethrough) {
    style.textDecoration = 'line-through';
  }

  let element: React.ReactNode = rt.text;

  if (rt.code) element = <code className="notion-inline-code">{element}</code>;
  if (rt.bold) element = <strong>{element}</strong>;
  if (rt.italic) element = <em>{element}</em>;

  if (rt.href) {
    element = (
      <a href={rt.href} target="_blank" rel="noopener noreferrer" className="notion-link">
        {element}
      </a>
    );
  }

  const hasStyle = Object.keys(style).length > 0;
  if (hasStyle) return <span style={style}>{element}</span>;
  return <>{element}</>;
}