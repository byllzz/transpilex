export function jsonToRust(json: string): string {
  try {
    const obj = JSON.parse(json);
    return generateRustStruct(obj, 'Root');
  } catch {
    return '// Invalid JSON';
  }
}

function generateRustStruct(obj: unknown, name: string): string {
  let result = 'use serde::{Deserialize, Serialize};\n\n';

  if (Array.isArray(obj)) {
    result += `// Array type\n`;
    if (obj.length > 0) result += generateRustStruct(obj[0], name + 'Item');
    return result;
  }

  if (obj === null || typeof obj !== 'object') return `// ${name}: ${rustType(obj)}\n`;

  const entries = Object.entries(obj as Record<string, unknown>);
  result += `#[derive(Debug, Serialize, Deserialize)]\n`;
  result += `pub struct ${name} {\n`;

  entries.forEach(([key, value]) => {
    const rustName = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    result += `    pub ${rustName}: ${rustType(value)},\n`;
  });
  result += '}\n';

  return result;
}

function rustType(value: unknown): string {
  if (value === null) return 'Option<String>';
  if (typeof value === 'string') return 'String';
  if (typeof value === 'number') return Number.isInteger(value) ? 'i64' : 'f64';
  if (typeof value === 'boolean') return 'bool';
  if (Array.isArray(value)) return 'Vec<serde_json::Value>';
  if (typeof value === 'object') return 'serde_json::Value';
  return 'serde_json::Value';
}
