export const SAMPLES: Record<string, string> = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Example</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a sample HTML snippet.</p>
</body>
</html>`,

  jsx: `import React from 'react';

function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h1>Hello, JSX!</h1>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </div>
  );
}

export default App;`,

  tsx: `import React, { useState } from 'react';

interface AppProps {
  name: string;
}

function App({ name }: AppProps) {
  const [count, setCount] = useState<number>(0);
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Clicked {count} times
      </button>
    </div>
  );
}

export default App;`,

  json: `{
  "name": "TranspileX",
  "version": "1.0.0",
  "description": "Code converter tool",
  "dependencies": {
    "react": "^18.0.0"
  }
}`,

  markdown: `# Markdown Sample

## Subheading

- List item 1
- List item 2

**Bold text** and *italic text*.

[Link](https://example.com)`,

  svg: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
</svg>`,
};
