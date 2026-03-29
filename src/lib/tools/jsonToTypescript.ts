function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function inferType(
  value: unknown,
  name: string,
  interfaces: Map<string, string>
): string {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'unknown[]';
    }

    const elementTypes = value.map((item, idx) =>
      inferType(item, `${name}Item${idx}`, interfaces)
    );
    const uniqueTypes = [...new Set(elementTypes)];

    if (uniqueTypes.length === 1) {
      return `${uniqueTypes[0]}[]`;
    }
    return `(${uniqueTypes.join(' | ')})[]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return 'Record<string, unknown>';
    }

    const interfaceName = toPascalCase(name);
    const fields = entries.map(([key, val]) => {
      const fieldType = inferType(val, key, interfaces);
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

      if (val === null) {
        return `  ${safeKey}: null;`;
      }
      return `  ${safeKey}: ${fieldType};`;
    });

    const interfaceStr = `interface ${interfaceName} {\n${fields.join('\n')}\n}`;
    interfaces.set(interfaceName, interfaceStr);

    return interfaceName;
  }

  switch (typeof value) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    default:
      return 'unknown';
  }
}

export function generateTypescriptFromJson(json: unknown, rootName: string): string {
  const interfaces = new Map<string, string>();

  inferType(json, rootName, interfaces);

  if (interfaces.size === 0) {
    const simpleType = inferType(json, rootName, interfaces);
    return `type ${toPascalCase(rootName)} = ${simpleType};`;
  }

  const result: string[] = [];
  const entries = [...interfaces.entries()];

  for (let i = entries.length - 1; i >= 0; i--) {
    result.push(entries[i][1]);
  }

  return result.join('\n\n');
}
