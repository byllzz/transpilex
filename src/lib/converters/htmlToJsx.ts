export function htmlToJsx(html: string): string {
  let result = html;

  // Replace class with className
  result = result.replace(/\bclass=/g, 'className=');
  result = result.replace(/\bclass\s*=\s*"/g, 'className="');
  result = result.replace(/\bclass\s*=\s*'/g, "className='");
  result = result.replace(/\bclass\s*=\s*{/g, 'className={');

  // Replace for with htmlFor
  result = result.replace(/\bfor=/g, 'htmlFor=');
  result = result.replace(/\bfor\s*=\s*"/g, 'htmlFor="');

  // Close self-closing tags
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
    const regex = new RegExp(`<${tag}([^>]*?)>`, 'gi');
    result = result.replace(regex, (_, attrs) => `<${tag}${attrs} />`);
  });

  // Convert inline styles to objects
  result = result.replace(/style="([^"]*)"/g, (_, styles) => {
    const jsxStyles = styles
      .split(';')
      .filter(Boolean)
      .map((s: string) => {
        const [key, val] = s.split(':').map(p => p.trim());
        if (!key || !val) return '';
        const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return `${camelKey}: "${val}"`;
      })
      .filter(Boolean)
      .join(', ');
    return `style={{ ${jsxStyles} }}`;
  });

  // Convert HTML comments to JSX comments
  result = result.replace(/<!--/g, '{/* ');
  result = result.replace(/-->/g, ' */}');

  return result;
}
