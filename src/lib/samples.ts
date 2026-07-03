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
  css: `body {
  font-family: Arial, sans-serif;
  background: #f0f0f0;
  color: #333;
}
h1 {
  color: #1a73e8;
}`,
  scss: `$primary: #1a73e8;
$bg: #f0f0f0;

body {
  font-family: Arial, sans-serif;
  background: $bg;
  color: #333;
  h1 {
    color: $primary;
  }
}`,
  javascript: `// Sample JavaScript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet('World'));`,
  typescript: `// Sample TypeScript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
console.log(greet('World'));`,
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
  gql: `type Query {
  user(id: ID!): User
  posts: [Post!]!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}`,
  python: `# Sample Python
def greet(name):
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("World"))`,
  go: `// Sample Go
package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

func main() {
    fmt.Println(greet("World"))
}`,
  rust: `// Sample Rust
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("{}", greet("World"));
}`,
};
