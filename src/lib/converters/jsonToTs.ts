export function jsonToTs(json: string): string {
  try {
    const obj = JSON.parse(json);
    return generateInterface(obj, 'Root');
  } catch {
    return '// Invalid JSON';
  }
}

function generateInterface(obj: unknown, name: string): string {
  if (Array.isArray(obj)) {
    if (obj.length === 0) return `type ${name} = unknown[]`;
    return `type ${name} = ${generateType(obj[0])}[]`;
  }

  if (obj === null) return `type ${name} = null`;
  if (typeof obj !== 'object') return `type ${name} = ${typeof obj}`;

  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) return `type ${name} = Record<string, unknown>`;

  let result = `interface ${name} {\n`;
  entries.forEach(([key, value]) => {
    const optional = key.includes('?') ? '?' : '';
    const cleanKey = key.replace('?', '');
    result += `  ${cleanKey}${optional}: ${generateType(value)}\n`;
  });
  result += '}';

  return result;
}

function generateType(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    return `${generateType(value[0])}[]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return 'Record<string, unknown>';
    let result = '{ ';
    entries.forEach(([k, v], i) => {
      result += `${k}: ${generateType(v)}`;
      if (i < entries.length - 1) result += '; ';
    });
    result += ' }';
    return result;
  }
  return 'unknown';
}
