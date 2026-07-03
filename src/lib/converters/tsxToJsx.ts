export function tsxToJsx(code: string): string {
  let result = code;

  // Remove type annotations from variables
  result = result.replace(/(const|let|var)\s+(\w+)\s*:\s*\w+(\[\])?\s*=/g, '$1 $2 =');

  // Remove interface declarations
  result = result.replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '');
  result = result.replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\}/g, '');

  // Remove type declarations
  result = result.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
  result = result.replace(/export\s+type\s+\w+\s*=\s*[^;]+;/g, '');

  // Remove generic type parameters from function calls
  result = result.replace(/<(\w+)(\s*,\s*\w+)*>/g, '');

  // Remove return type annotations from functions
  result = result.replace(/(\))\s*:\s*\w+(\[\])?\s*(=>|\{)/g, '$1 $3');

  // Remove parameter type annotations
  result = result.replace(/(\w+)\s*:\s*\w+(\[\])?\s*(,|\))/g, '$1$3');

  // Remove as/angle-bracket type assertions
  result = result.replace(/\bas\s+\w+/g, '');
  result = result.replace(/<(\w+)>([^<]+)<\/\1>/g, '$2');

  return result;
}
