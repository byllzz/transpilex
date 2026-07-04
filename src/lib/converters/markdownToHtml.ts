export function markdownToHtml(md: string): string {
  let result = md;

  // Code blocks first (before any other transform touches them)
  const codeBlocks: string[] = [];
  result = result.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const placeholder = `%%CODEBLOCK_${codeBlocks.length}%%`;
    codeBlocks.push(
      `<pre><code${lang ? ` class="language-${lang}"` : ''}>${escapeHtml(code.trimEnd())}</code></pre>`,
    );
    return placeholder;
  });

  // Inline code (protect before bold/italic)
  const inlineCodes: string[] = [];
  result = result.replace(/`([^`]+)`/g, (_, code) => {
    const placeholder = `%%INLINE_${inlineCodes.length}%%`;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return placeholder;
  });

  // Headings
  result = result.replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>');
  result = result.replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>');
  result = result.replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>');
  result = result.replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>');
  result = result.replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>');
  result = result.replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  result = result.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr />');

  // Blockquotes
  result = result.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Bold + italic combined
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  result = result.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');

  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.+?)_/g, '<em>$1</em>');

  // Strikethrough
  result = result.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Images (before links — same syntax but with !)
  result = result.replace(/!\[([^\]]*)\]\(([^)]+?)(?:\s+"([^"]+)")?\)/g, (_, alt, src, title) =>
    title
      ? `<img src="${src}" alt="${alt}" title="${title}" />`
      : `<img src="${src}" alt="${alt}" />`,
  );

  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+?)(?:\s+"([^"]+)")?\)/g, (_, text, href, title) =>
    title ? `<a href="${href}" title="${title}">${text}</a>` : `<a href="${href}">${text}</a>`,
  );

  // Unordered lists — group consecutive <li> items into <ul>
  result = groupListItems(result, /^[\*\-\+] (.+)$/gm, 'ul');

  // Ordered lists — group consecutive <li> items into <ol>
  result = groupListItems(result, /^\d+\. (.+)$/gm, 'ol');

  // Paragraphs — wrap blocks of text not already inside a block element
  result = wrapParagraphs(result);

  // Restore inline code and code blocks
  inlineCodes.forEach((code, i) => {
    result = result.replace(`%%INLINE_${i}%%`, code);
  });
  codeBlocks.forEach((block, i) => {
    result = result.replace(`%%CODEBLOCK_${i}%%`, block);
  });

  return result.trim();
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Converts consecutive list-item lines to a wrapped <ul> or <ol>
function groupListItems(text: string, lineRegex: RegExp, tag: 'ul' | 'ol'): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let inList = false;

  for (const line of lines) {
    const m = line.match(lineRegex.source ? new RegExp(lineRegex.source) : lineRegex);
    if (m) {
      if (!inList) {
        out.push(`<${tag}>`);
        inList = true;
      }
      out.push(`  <li>${m[1]}</li>`);
    } else {
      if (inList) {
        out.push(`</${tag}>`);
        inList = false;
      }
      out.push(line);
    }
  }
  if (inList) out.push(`</${tag}>`);

  return out.join('\n');
}

const BLOCK_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'hr',
  'div',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
];

function wrapParagraphs(text: string): string {
  const blockStart = new RegExp(`^<(?:${BLOCK_TAGS.join('|')})[\\s>]`, 'i');
  const blockEnd = new RegExp(`</(?:${BLOCK_TAGS.join('|')})>\\s*$`, 'i');
  const isPlaceholder = /^%%(?:CODEBLOCK|INLINE)_\d+%%/;

  return text
    .split(/\n\n+/)
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (blockStart.test(trimmed)) return trimmed;
      if (blockEnd.test(trimmed)) return trimmed;
      if (isPlaceholder.test(trimmed)) return trimmed;
      if (trimmed.startsWith('<hr')) return trimmed;
      return `<p>${trimmed.replace(/\n/g, ' ')}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}
