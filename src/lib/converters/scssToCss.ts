export function scssToCss(code: string): string {
  let result = code;

  // Remove @mixin blocks
  result = result.replace(/@mixin\s+[\s\S]*?\{[\s\S]*?\}/g, '');

  // Expand @include calls (basic — just removes @include)
  result = result.replace(/@include\s+([^;]+);/g, '');

  // Remove @if/@else blocks
  result = result.replace(/@if\s+[\s\S]*?@endif/g, '');
  result = result.replace(/@if\s+[\s\S]*?@else\s+[\s\S]*?@endif/g, '');

  // Remove @for loops
  result = result.replace(/@for\s+[\s\S]*?@endfor/g, '');

  // Remove @each loops
  result = result.replace(/@each\s+[\s\S]*?@endeach/g, '');

  // Remove @while loops
  result = result.replace(/@while\s+[\s\S]*?@endwhile/g, '');

  // Remove @extend
  result = result.replace(/@extend\s+[^;]+;/g, '');

  // Remove @warn, @error, @debug
  result = result.replace(/@(warn|error|debug)\s+[^;]+;/g, '');

  // Un-nest selectors (basic — flattens one level)
  result = result.replace(/&/g, '');

  // Remove SCSS variables
  result = result.replace(/\$[\w-]+\s*:\s*[^;]+;/g, '');

  // Remove interpolation
  result = result.replace(/#\{[^}]+\}/g, '');

  return result;
}
