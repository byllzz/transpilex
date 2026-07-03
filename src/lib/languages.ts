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
  { id: 'gql', label: 'GraphQL', extension: '.graphql', monacoLanguage: 'graphql' },
  { id: 'python', label: 'Python', extension: '.py', monacoLanguage: 'python' },
  { id: 'go', label: 'Go', extension: '.go', monacoLanguage: 'go' },
  { id: 'rust', label: 'Rust', extension: '.rs', monacoLanguage: 'rust' },
];

const [html, jsx, tsx, css, scss, js, ts, json, md, svg, gql] = languages;

export const conversionPairs: ConversionPair[] = [
  { id: 'html-to-jsx', source: html!, target: jsx! },
  { id: 'html-to-tsx', source: html!, target: tsx! },
  { id: 'jsx-to-html', source: jsx!, target: html! },
  { id: 'jsx-to-tsx', source: jsx!, target: tsx! },
  { id: 'tsx-to-jsx', source: tsx!, target: jsx! },
  { id: 'tsx-to-html', source: tsx!, target: html! },
  { id: 'css-to-scss', source: css!, target: scss! },
  { id: 'scss-to-css', source: scss!, target: css! },
  { id: 'js-to-ts', source: js!, target: ts! },
  { id: 'ts-to-js', source: ts!, target: js! },
  { id: 'svg-to-jsx', source: svg!, target: jsx! },
  { id: 'svg-to-tsx', source: svg!, target: tsx! },
  { id: 'md-to-html', source: md!, target: html! },
  { id: 'json-to-ts', source: json!, target: ts! },
  { id: 'json-to-go', source: json!, target: languages[12]! },
  { id: 'json-to-python', source: json!, target: languages[11]! },
  { id: 'json-to-rust', source: json!, target: languages[13]! },
  { id: 'gql-to-ts', source: gql!, target: ts! },
];
