export function htmlToJsx(html: string): string {
  let result = html;

  // class → className
  result = result.replace(/\bclass=/g, 'className=');
  result = result.replace(/class="([^"]*)"/g, 'className="$1"');
  result = result.replace(/class='([^']*)'/g, "className='$1'");
  result = result.replace(/class=\{/g, 'className={');

  // for → htmlFor
  result = result.replace(/\bfor=/g, 'htmlFor=');
  result = result.replace(/for="([^"]*)"/g, 'htmlFor="$1"');

  // tabindex → tabIndex
  result = result.replace(/\btabindex=/g, 'tabIndex=');

  // Self-closing tags
  const selfClosing = [
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
  selfClosing.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*?)(?<!\\/)>`, 'gi');
    result = result.replace(regex, (_, attrs) => `<${tag}${attrs} />`);
  });

  // Inline styles → JSX objects
  result = result.replace(/style="([^"]*)"/g, (_, styles) => {
    const jsxStyles = styles
      .split(';')
      .filter(Boolean)
      .map((s: string) => {
        const colonIndex = s.indexOf(':');
        if (colonIndex === -1) return '';
        const key = s.slice(0, colonIndex).trim();
        const val = s.slice(colonIndex + 1).trim();
        const camelKey = key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
        return `${camelKey}: "${val}"`;
      })
      .filter(Boolean)
      .join(', ');
    return `style={{ ${jsxStyles} }}`;
  });

  // HTML comments → JSX comments
  result = result.replace(/<!--/g, '{/* ');
  result = result.replace(/-->/g, ' */}');

  // onclick → onClick, onchange → onChange, etc.
  const eventAttrs = [
    'click',
    'change',
    'submit',
    'focus',
    'blur',
    'keydown',
    'keyup',
    'mouseenter',
    'mouseleave',
    'input',
    'load',
    'error',
    'scroll',
  ];
  eventAttrs.forEach(ev => {
    const regex = new RegExp(`\\bon${ev}=`, 'gi');
    result = result.replace(regex, `on${ev.charAt(0).toUpperCase() + ev.slice(1)}=`);
  });

  return result;
}
