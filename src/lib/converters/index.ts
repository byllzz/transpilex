import { htmlToJsx } from './htmlToJsx';
import type { ConversionResult } from '../../types';

export function convertCode(code: string, from: string, to: string): ConversionResult {
  try {
    const key = `${from}-to-${to}`;

    const converters: Record<string, (code: string) => string> = {
      'html-to-jsx': htmlToJsx,
      'html-to-tsx': htmlToJsx, // Same logic, TSX accepts JSX
      'jsx-to-html': c =>
        c
          .replace(/className=/g, 'class=')
          .replace(/htmlFor=/g, 'for=')
          .replace(/style=\{\{\s*([^}]*)\s*\}\}/g, (_, s) => {
            const css = s.replace(/: /g, ':').replace(/, /g, '; ');
            return `style="${css}"`;
          })
          .replace(/\{\/\*\s*/g, '<!-- ')
          .replace(/\s*\*\/\}/g, ' -->'),
      'jsx-to-tsx': c => c, // Add type annotations later
      'tsx-to-jsx': c =>
        c
          .replace(/:\s*\w+(\[\])?\s*=/g, ' =') // Remove type annotations
          .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
          .replace(/type\s+\w+\s*=\s*[^;]+;/g, ''),
      'css-to-scss': c => c, // SCSS is a superset
      'scss-to-css': c =>
        c
          .replace(/@mixin\s+[\s\S]*?\{[\s\S]*?\}/g, '')
          .replace(/@include\s+([^;]+);/g, (_, mixin) => mixin)
          .replace(/@if\s+[\s\S]*?@endif/g, '')
          .replace(/@for\s+[\s\S]*?@endfor/g, ''),
      'js-to-ts': c => c, // Placeholder
      'ts-to-js': c =>
        c
          .replace(/:\s*\w+(\[\])?\s*=/g, ' =')
          .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
          .replace(/type\s+\w+\s*=\s*[^;]+;/g, ''),
      'svg-to-jsx': c =>
        htmlToJsx(c)
          .replace(/xmlns(:?\w+)?="[^"]*"/g, '')
          .replace(/xmlns(:?\w+)?='[^']*'/g, ''),
      'md-to-html': c =>
        c
          .replace(/^### (.+)$/gm, '<h3>$1</h3>')
          .replace(/^## (.+)$/gm, '<h2>$1</h2>')
          .replace(/^# (.+)$/gm, '<h1>$1</h1>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
          .replace(/^\- (.+)$/gm, '<li>$1</li>')
          .replace(/\n\n/g, '<br><br>'),
    };

    const converter = converters[key];
    if (!converter) {
      return { code, error: `No converter found for ${from} → ${to}` };
    }

    const converted = converter(code);
    return { code: converted, error: null };
  } catch (e) {
    return { code: '', error: e instanceof Error ? e.message : 'Conversion failed' };
  }
}
