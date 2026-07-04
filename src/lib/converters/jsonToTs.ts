export function jsonToTs(json: string): string {
  try {
    const obj = JSON.parse(json);
    const interfaces: string[] = [];
    const rootType = walk(obj, 'Root', interfaces);

    // If root is a primitive/array alias, emit as type alias
    const rootIsInterface = interfaces.some(i => i.startsWith('interface Root'));
    if (!rootIsInterface) {
      interfaces.push(`type Root = ${rootType}`);
    }

    return interfaces.join('\n\n');
  } catch {
    return '// Invalid JSON';
  }
}

// Walks a value, registers any named interfaces it finds, returns the TS type string
function walk(value: unknown, name: string, interfaces: string[]): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    // Infer from first element; name child interfaces after the array name
    const itemType = walk(value[0], singular(name), interfaces);
    return `${itemType}[]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) return 'Record<string, unknown>';

    // Build interface for this object
    const lines = entries.map(([key, val]) => {
      // Keys with special characters need quoting
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      // Nested objects get their own named interface
      const childName = capitalize(key);
      const tsType = walk(val, childName, interfaces);
      const optional = val === null || val === undefined ? '?' : '';
      return `  ${safeKey}${optional}: ${tsType};`;
    });

    const iface = `interface ${name} {\n${lines.join('\n')}\n}`;

    // Only register if not already present (deduplication)
    if (!interfaces.some(i => i === iface)) {
      interfaces.push(iface);
    }

    return name;
  }

  // Primitives
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'unknown';
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// "items" → "Item", "users" → "User", etc.
function singular(name: string): string {
  if (name.endsWith('ies')) return name.slice(0, -3) + 'y';
  if (name.endsWith('s') && name.length > 1) return name.slice(0, -1);
  return name + 'Item';
}
