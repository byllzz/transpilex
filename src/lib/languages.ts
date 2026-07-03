import type { Language, ConversionPair } from '../types';

export const languages: Language[] = [
  { id: 'html', label: 'HTML', extension: '.html', monacoLanguage: 'html' },
  { id: 'jsx', label: 'JSX', extension: '.jsx', monacoLanguage: 'javascript' },
  { id: 'tsx', label: 'TSX', extension: '.tsx', monacoLanguage: 'typescript' },
  { id: 'css', label: 'CSS', extension: '.css', monacoLanguage: 'css' },
  { id: 'scss', label: 'SCSS', extension: '.scss', monacoLanguage: 'scss' },
  { id: 'javascript', label: 'JavaScript', extension: '.js', monacoLanguage: 'javascript' },
  { id: 'typescript', label: 'TypeScript', extension: '.ts', monacoLanguage: 'typescript' },
  { id: 'json', label: 'JSON', extension: '.json', monacoLanguage: 'json' },
  { id: 'markdown', label: 'Markdown', extension: '.md', monacoLanguage: 'markdown' },
  { id: 'svg', label: 'SVG', extension: '.svg', monacoLanguage: 'xml' },
];

export const conversionPairs: ConversionPair[] = [
  { id: 'html-to-jsx', source: languages[0]!, target: languages[1]! },
  { id: 'html-to-tsx', source: languages[0]!, target: languages[2]! },
  { id: 'jsx-to-html', source: languages[1]!, target: languages[0]! },
  { id: 'jsx-to-tsx', source: languages[1]!, target: languages[2]! },
  { id: 'tsx-to-jsx', source: languages[2]!, target: languages[1]! },
  { id: 'css-to-scss', source: languages[3]!, target: languages[4]! },
  { id: 'scss-to-css', source: languages[4]!, target: languages[3]! },
  { id: 'js-to-ts', source: languages[5]!, target: languages[6]! },
  { id: 'ts-to-js', source: languages[6]!, target: languages[5]! },
  { id: 'svg-to-jsx', source: languages[8]!, target: languages[1]! },
  { id: 'md-to-html', source: languages[7]!, target: languages[0]! },
];
