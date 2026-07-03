export function tsToJs(code: string): string {
  let result = code;

  // Remove type annotations
  result = result.replace(/(const|let|var)\s+(\w+)\s*:\s*\w+(\[\])?\s*=/g, '$1 $2 =');
  result = result.replace(/(\w+)\s*:\s*\w+(\[\])?\s*(,|\))/g, '$1$3');
  result = result.replace(/(\))\s*:\s*\w+(\[\])?\s*(=>|\{)/g, '$1 $3');
  result = result.replace(/\bas\s+\w+/g, '');

  // Remove interfaces
  result = result.replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '');
  result = result.replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\}/g, '');

  // Remove type aliases
  result = result.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
  result = result.replace(/export\s+type\s+\w+\s*=\s*[^;]+;/g, '');

  // Remove generics
  result = result.replace(/<(\w+)(\s*,\s*\w+)*>/g, '');

  return result;
}
