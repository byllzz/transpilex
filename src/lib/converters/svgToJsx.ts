import { htmlToJsx } from './htmlToJsx';

// Attributes that are already camelCase in SVG spec and need no change
// (viewBox, gradientUnits, patternUnits, etc.)

// Hyphenated SVG presentation attributes → camelCase JSX props
const SVG_ATTR_MAP: Record<string, string> = {
  'accent-height': 'accentHeight',
  'alignment-baseline': 'alignmentBaseline',
  'baseline-shift': 'baselineShift',
  'clip-path': 'clipPath',
  'clip-rule': 'clipRule',
  'color-interpolation': 'colorInterpolation',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'color-rendering': 'colorRendering',
  'dominant-baseline': 'dominantBaseline',
  'enable-background': 'enableBackground',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'flood-color': 'floodColor',
  'flood-opacity': 'floodOpacity',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-size-adjust': 'fontSizeAdjust',
  'font-stretch': 'fontStretch',
  'font-style': 'fontStyle',
  'font-variant': 'fontVariant',
  'font-weight': 'fontWeight',
  'glyph-name': 'glyphName',
  'horiz-adv-x': 'horizAdvX',
  'horiz-origin-x': 'horizOriginX',
  'image-rendering': 'imageRendering',
  'letter-spacing': 'letterSpacing',
  'lighting-color': 'lightingColor',
  'marker-end': 'markerEnd',
  'marker-mid': 'markerMid',
  'marker-start': 'markerStart',
  'overline-position': 'overlinePosition',
  'overline-thickness': 'overlineThickness',
  'paint-order': 'paintOrder',
  'pointer-events': 'pointerEvents',
  'rendering-intent': 'renderingIntent',
  'shape-rendering': 'shapeRendering',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'strikethrough-position': 'strikethroughPosition',
  'strikethrough-thickness': 'strikethroughThickness',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'stroke-width': 'strokeWidth',
  'text-anchor': 'textAnchor',
  'text-decoration': 'textDecoration',
  'text-rendering': 'textRendering',
  'underline-position': 'underlinePosition',
  'underline-thickness': 'underlineThickness',
  'unicode-bidi': 'unicodeBidi',
  'unicode-range': 'unicodeRange',
  'units-per-em': 'unitsPerEm',
  'v-alphabetic': 'vAlphabetic',
  'v-hanging': 'vHanging',
  'v-ideographic': 'vIdeographic',
  'v-mathematical': 'vMathematical',
  'vector-effect': 'vectorEffect',
  'vert-adv-y': 'vertAdvY',
  'vert-origin-x': 'vertOriginX',
  'vert-origin-y': 'vertOriginY',
  'word-spacing': 'wordSpacing',
  'writing-mode': 'writingMode',
  'x-height': 'xHeight',
};

export function svgToJsx(svg: string): string {
  let result = svg;

  // 1. Apply base HTML→JSX transforms (class→className, style, void tags, etc.)
  result = htmlToJsx(result);

  // 2. Remove XML declaration
  result = result.replace(/<\?xml[^?]*\?>\s*/g, '');

  // 3. Remove all xmlns attributes (xmlns, xmlns:xlink, xmlns:dc, etc.)
  result = result.replace(/\s+xmlns(?::\w+)?="[^"]*"/g, '');
  result = result.replace(/\s+xmlns(?::\w+)?='[^']*'/g, '');

  // 4. xlink:href → href (React 16+ supports this directly)
  result = result.replace(/\bxlink:href=/g, 'href=');

  // 5. xlink:title, xlink:show etc. → just drop the namespace
  result = result.replace(/\bxlink:(\w+)=/g, '$1=');

  // 6. xml:space, xml:lang → drop namespace
  result = result.replace(/\bxml:(\w+)=/g, '$1=');

  // 7. Replace all hyphenated SVG attributes with camelCase
  for (const [from, to] of Object.entries(SVG_ATTR_MAP)) {
    // Match as an attribute name (preceded by whitespace or start of tag content)
    const re = new RegExp(`\\b${from.replace(/-/g, '\\-')}=`, 'g');
    result = result.replace(re, `${to}=`);
  }

  // 8. aria-* and data-* stay hyphenated in JSX — do NOT convert them
  // (already safe since our map doesn't include them)

  return result;
}
