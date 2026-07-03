export function markdownToHtml(md: string): string {
  let result = md;

  // Headings
  result = result.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  result = result.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  result = result.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  result = result.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Strikethrough
  result = result.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Images
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Horizontal rules
  result = result.replace(/^(---|\*\*\*|___)$/gm, '<hr />');

  // Blockquotes
  result = result.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Unordered lists
  result = result.replace(/^[\*\-] (.+)$/gm, '<li>$1</li>');

  // Ordered lists
  result = result.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Code blocks
  result = result.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre><code class="language-$1">$2</code></pre>',
  );

  // Paragraphs (double newlines)
  result = result.replace(/\n\n/g, '</p><p>');

  // Wrap in paragraph
  if (!result.startsWith('<')) {
    result = '<p>' + result + '</p>';
  }

  return result;
}
