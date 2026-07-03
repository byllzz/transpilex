import { htmlToJsx } from './htmlToJsx';
import { jsxToHtml } from './jsxToHtml';
import { tsxToJsx } from './tsxToJsx';
import { jsxToTsx } from './jsxToTsx';
import { cssToScss } from './cssToScss';
import { scssToCss } from './scssToCss';
import { jsToTs } from './jsToTs';
import { tsToJs } from './tsToJs';
import { svgToJsx } from './svgToJsx';
import { markdownToHtml } from './markdownToHtml';
import { jsonToTs } from './jsonToTs';
import { jsonToGo } from './jsonToGo';
import { jsonToPython } from './jsonToPython';
import { jsonToRust } from './jsonToRust';
import { graphqlToTs } from './graphqlToTs';
import type { ConversionResult } from '../../types';

type Converter = (code: string) => string;

const converters: Record<string, Converter> = {
  'html-to-jsx': htmlToJsx,
  'html-to-tsx': htmlToJsx,
  'jsx-to-html': jsxToHtml,
  'jsx-to-tsx': jsxToTsx,
  'tsx-to-jsx': tsxToJsx,
  'tsx-to-html': c => jsxToHtml(tsxToJsx(c)),
  'css-to-scss': cssToScss,
  'scss-to-css': scssToCss,
  'js-to-ts': jsToTs,
  'ts-to-js': tsToJs,
  'svg-to-jsx': svgToJsx,
  'svg-to-tsx': svgToJsx,
  'md-to-html': markdownToHtml,
  'json-to-ts': jsonToTs,
  'json-to-go': jsonToGo,
  'json-to-python': jsonToPython,
  'json-to-rust': jsonToRust,
  'gql-to-ts': graphqlToTs,
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
