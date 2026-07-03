import { htmlToJsx } from './htmlToJsx';

export function svgToJsx(svg: string): string {
  let result = htmlToJsx(svg);

  // Remove XML namespace attributes
  result = result.replace(/\s*xmlns(:?\w+)?="[^"]*"/g, '');
  result = result.replace(/\s*xmlns(:?\w+)?='[^']*'/g, '');

  // Convert SVG-specific attributes
  result = result.replace(/stroke-width/g, 'strokeWidth');
  result = result.replace(/stroke-dasharray/g, 'strokeDasharray');
  result = result.replace(/stroke-dashoffset/g, 'strokeDashoffset');
  result = result.replace(/stroke-linecap/g, 'strokeLinecap');
  result = result.replace(/stroke-linejoin/g, 'strokeLinejoin');
  result = result.replace(/stroke-opacity/g, 'strokeOpacity');
  result = result.replace(/fill-opacity/g, 'fillOpacity');
  result = result.replace(/fill-rule/g, 'fillRule');
  result = result.replace(/clip-path/g, 'clipPath');
  result = result.replace(/clip-rule/g, 'clipRule');
  result = result.replace(/font-family/g, 'fontFamily');
  result = result.replace(/font-size/g, 'fontSize');
  result = result.replace(/font-weight/g, 'fontWeight');
  result = result.replace(/text-anchor/g, 'textAnchor');
  result = result.replace(/dominant-baseline/g, 'dominantBaseline');
  result = result.replace(/stop-color/g, 'stopColor');
  result = result.replace(/stop-opacity/g, 'stopOpacity');

  return result;
}
