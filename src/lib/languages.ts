import type { Language, ConversionPair } from '../types';

// languages that have at least one conversion pair
export const languages: Language[] = [
  { id: 'html', label: 'HTML', extension: '.html', monacoLanguage: 'html' },
  { id: 'jsx', label: 'JSX', extension: '.jsx', monacoLanguage: 'javascript' },
  { id: 'tsx', label: 'TSX', extension: '.tsx', monacoLanguage: 'typescript' },
  { id: 'json', label: 'JSON', extension: '.json', monacoLanguage: 'json' },
  { id: 'markdown', label: 'Markdown', extension: '.md', monacoLanguage: 'markdown' },
  { id: 'svg', label: 'SVG', extension: '.svg', monacoLanguage: 'xml' },
];

const [html, jsx, tsx, json, md, svg] = languages;

export const conversionPairs: ConversionPair[] = [
  { id: 'html-to-jsx', source: html!, target: jsx! },
  { id: 'html-to-tsx', source: html!, target: tsx! },
  { id: 'jsx-to-html', source: jsx!, target: html! },
  { id: 'svg-to-jsx', source: svg!, target: jsx! },
  { id: 'svg-to-tsx', source: svg!, target: tsx! },
  { id: 'md-to-html', source: md!, target: html! },
  { id: 'json-to-ts', source: json!, target: tsx! },
];
