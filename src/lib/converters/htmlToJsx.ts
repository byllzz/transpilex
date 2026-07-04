export function htmlToJsx(html: string): string {
  let result = html;

  // HTML comments → JSX comments (before other transforms)
  result = result.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

  // class → className (single pass, covers all quote styles and expressions)
  result = result.replace(/\bclass(=)/g, 'className$1');

  // for → htmlFor
  result = result.replace(/\bfor(=)/g, 'htmlFor$1');

  // tabindex → tabIndex
  result = result.replace(/\btabindex(=)/g, 'tabIndex$1');

  // Self-closing void tags — ensure they end with " />"
  const voidTags = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ];
  voidTags.forEach(tag => {
    // matches <tag ...> that doesn't already have />
    const re = new RegExp(`<(${tag})(\\s[^>]*?)?>(?!\\s*<\\/${tag}>)`, 'gi');
    result = result.replace(re, (_, t, attrs = '') => {
      const cleaned = attrs.replace(/\s*\/?$/, '');
      return `<${t}${cleaned} />`;
    });
  });

  // Inline styles → JSX style objects
  result = result.replace(/style="([^"]*)"/g, (_, styles) => {
    const pairs = styles
      .split(';')
      .map((s: string) => s.trim())
      .filter(Boolean);
    const obj = pairs
      .map((s: string) => {
        const colon = s.indexOf(':');
        if (colon === -1) return null;
        const prop = s.slice(0, colon).trim();
        const val = s.slice(colon + 1).trim();
        // kebab-case → camelCase
        const camel = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
        // numeric values that need no unit stay as numbers; everything else is a string
        const numeric = /^\d+(\.\d+)?$/.test(val);
        return `${camel}: ${numeric ? val : `"${val}"`}`;
      })
      .filter(Boolean)
      .join(', ');
    return `style={{ ${obj} }}`;
  });

  // Event handlers: on<event> → on<Event> (camelCase)
  // Covers all standard DOM events including multi-word ones
  result = result.replace(/\bon([a-z]+)(=)/gi, (_, ev, eq) => {
    // capitalise first letter of event name only
    return `on${ev.charAt(0).toUpperCase()}${ev.slice(1)}${eq}`;
  });

  return result;
}
