export function jsonToGo(json: string): string {
  try {
    const obj = JSON.parse(json);
    return generateGoStruct(obj, 'Root');
  } catch {
    return '// Invalid JSON';
  }
}

function generateGoStruct(obj: unknown, name: string): string {
  if (Array.isArray(obj)) {
    if (obj.length === 0) return `type ${name} []interface{}`;
    return `type ${name} []${capitalize(typeof obj[0])}`;
  }
  if (obj === null || typeof obj !== 'object') return `type ${name} ${goType(obj)}`;

  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) return `type ${name} map[string]interface{}`;

  let result = `type ${name} struct {\n`;
  entries.forEach(([key, value]) => {
    const goName = capitalize(key);
    const jsonTag = key.includes('_') ? key : '';
    const tag = jsonTag ? ` \`json:"${jsonTag}"\`` : '';
    result += `  ${goName} ${goType(value)}${tag}\n`;
  });
  result += '}';

  return result;
}

function goType(value: unknown): string {
  if (value === null) return 'interface{}';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float64';
  if (typeof value === 'boolean') return 'bool';
  if (Array.isArray(value)) return '[]interface{}';
  if (typeof value === 'object') return 'map[string]interface{}';
  return 'interface{}';
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/[^a-zA-Z0-9]/g, '');
}
