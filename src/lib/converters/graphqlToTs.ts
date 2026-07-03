export function graphqlToTs(schema: string): string {
  const types: string[] = [];

  // Parse scalar types
  const scalarRegex = /scalar\s+(\w+)/g;
  let match;
  while ((match = scalarRegex.exec(schema)) !== null) {
    types.push(`type ${match[1]} = unknown`);
  }

  // Parse type definitions
  const typeRegex = /type\s+(\w+)\s*\{([^}]*)\}/g;
  while ((match = typeRegex.exec(schema)) !== null) {
    const typeName = match[1]!;
    const fields = match[2]!;
    const tsFields = fields
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const fieldMatch = line.match(/^(\w+)\s*:\s*(.+)$/);
        if (!fieldMatch) return '';
        const [, name, gqlType] = fieldMatch;
        const isArray = gqlType!.startsWith('[');
        const cleanType = gqlType!.replace(/[\[\]!]/g, '');
        const tsType = mapGraphQLType(cleanType!);
        return `  ${name}${gqlType!.includes('!') ? '' : '?'}: ${isArray ? `${tsType}[]` : tsType}`;
      })
      .filter(Boolean)
      .join('\n');

    types.push(`interface ${typeName} {\n${tsFields}\n}`);
  }

  // Parse input types
  const inputRegex = /input\s+(\w+)\s*\{([^}]*)\}/g;
  while ((match = inputRegex.exec(schema)) !== null) {
    const typeName = match[1]!;
    const fields = match[2]!;
    const tsFields = fields
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const fieldMatch = line.match(/^(\w+)\s*:\s*(.+)$/);
        if (!fieldMatch) return '';
        const [, name, gqlType] = fieldMatch;
        const cleanType = gqlType!.replace(/[\[\]!]/g, '');
        const tsType = mapGraphQLType(cleanType!);
        return `  ${name}${gqlType!.includes('!') ? '' : '?'}: ${tsType}`;
      })
      .filter(Boolean)
      .join('\n');

    types.push(`interface ${typeName}Input {\n${tsFields}\n}`);
  }

  // Parse enums
  const enumRegex = /enum\s+(\w+)\s*\{([^}]*)\}/g;
  while ((match = enumRegex.exec(schema)) !== null) {
    const enumName = match[1]!;
    const values = match[2]!;
    const tsValues = values
      .split('\n')
      .map(v => v.trim())
      .filter(Boolean)
      .map(v => `  ${v} = "${v}"`)
      .join(',\n');

    types.push(`enum ${enumName} {\n${tsValues}\n}`);
  }

  return types.length > 0 ? types.join('\n\n') : '// No GraphQL types found';
}

function mapGraphQLType(gqlType: string): string {
  const typeMap: Record<string, string> = {
    String: 'string',
    Int: 'number',
    Float: 'number',
    Boolean: 'boolean',
    ID: 'string',
  };
  return typeMap[gqlType] ?? gqlType;
}
