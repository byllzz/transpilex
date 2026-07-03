export function jsonToPython(json: string): string {
  try {
    const obj = JSON.parse(json);
    return generateDataclass(obj, 'Root');
  } catch {
    return '# Invalid JSON';
  }
}

function generateDataclass(obj: unknown, name: string): string {
  let result = 'from dataclasses import dataclass\n';
  result += 'from typing import Optional, List, Dict, Any\n\n';

  if (Array.isArray(obj)) {
    result += `# Array type — first element type inferred\n`;
    if (obj.length > 0) result += generateDataclass(obj[0], name + 'Item');
    return result;
  }

  if (obj === null || typeof obj !== 'object') return `# ${name}: ${typeof obj}\n`;

  const entries = Object.entries(obj as Record<string, unknown>);
  result += `@dataclass\nclass ${name}:\n`;

  if (entries.length === 0) {
    result += `    pass\n`;
    return result;
  }

  entries.forEach(([key, value]) => {
    const pyType = pythonType(value);
    result += `    ${key}: ${pyType}\n`;
  });

  return result;
}

function pythonType(value: unknown): string {
  if (value === null) return 'Optional[Any]';
  if (typeof value === 'string') return 'str';
  if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float';
  if (typeof value === 'boolean') return 'bool';
  if (Array.isArray(value)) return 'List[Any]';
  if (typeof value === 'object') return 'Dict[str, Any]';
  return 'Any';
}
