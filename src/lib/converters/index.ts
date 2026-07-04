import { htmlToJsx } from './htmlToJsx';
import { jsxToHtml } from './jsxToHtml';
import { svgToJsx } from './svgToJsx';
import { markdownToHtml } from './markdownToHtml';
import { jsonToTs } from './jsonToTs';
import type { ConversionResult } from '../../types';

type Converter = (code: string) => string;

const converters: Record<string, Converter> = {
  'html-to-jsx': htmlToJsx,
  'html-to-tsx': htmlToJsx, // same function for TSX
  'jsx-to-html': jsxToHtml,
  'svg-to-jsx': svgToJsx,
  'svg-to-tsx': svgToJsx, // same function for TSX
  'md-to-html': markdownToHtml,
  'json-to-ts': jsonToTs,
};

export function convertCode(code: string, from: string, to: string): ConversionResult {
  try {
    const key = `${from}-to-${to}`;
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
