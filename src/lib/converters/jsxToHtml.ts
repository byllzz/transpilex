export function jsxToHtml(code: string): string {
  let result = code;

  // className → class
  result = result.replace(/className=/g, 'class=');
  result = result.replace(/className="([^"]*)"/g, 'class="$1"');
  result = result.replace(/className='([^']*)'/g, "class='$1'");
  result = result.replace(/className=\{/g, 'class={');

  // htmlFor → for
  result = result.replace(/htmlFor=/g, 'for=');

  // tabIndex → tabindex
  result = result.replace(/tabIndex=/g, 'tabindex=');

  // JSX style objects → inline styles
  result = result.replace(/style=\{\{\s*([^}]*?)\s*\}\}/g, (_, styles) => {
    const css = styles
      .split(',')
      .map((s: string) => {
        const [key, val] = s.split(':').map(p => p.trim().replace(/['"]/g, ''));
        if (!key || !val) return '';
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${val}`;
      })
      .filter(Boolean)
      .join('; ');
    return `style="${css}"`;
  });

  // JSX comments → HTML comments
  result = result.replace(/\{\/\*\s*/g, '<!-- ');
  result = result.replace(/\s*\*\/\}/g, ' -->');

  // Remove self-closing slashes from non-void elements
  result = result.replace(/<(\w+)([^>]*?)\s*\/>/g, (_, tag, attrs) => {
    const voidTags = [
      'br',
      'hr',
      'img',
      'input',
      'link',
      'meta',
      'area',
      'base',
      'col',
      'embed',
      'source',
      'track',
      'wbr',
    ];
    if (voidTags.includes(tag.toLowerCase())) return `<${tag}${attrs}>`;
    return `<${tag}${attrs}></${tag}>`;
  });

  // onClick → onclick, etc.
  const jsxEvents = [
    'Click',
    'Change',
    'Submit',
    'Focus',
    'Blur',
    'KeyDown',
    'KeyUp',
    'MouseEnter',
    'MouseLeave',
    'Input',
    'Load',
    'Error',
    'Scroll',
  ];
  jsxEvents.forEach(ev => {
    const regex = new RegExp(`\\bon${ev}=`, 'g');
    result = result.replace(regex, `on${ev.toLowerCase()}=`);
  });

  return result;
}
