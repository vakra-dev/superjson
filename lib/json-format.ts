export type IndentType = 2 | "tab";

/**
 * Format JSON with pretty printing
 */
export function formatJson(
  json: string | unknown,
  options: {
    indent?: IndentType;
    sortKeys?: boolean;
  } = {}
): string {
  const { indent = 2, sortKeys = false } = options;

  let obj = typeof json === "string" ? JSON.parse(json) : json;

  if (sortKeys) {
    obj = sortObjectKeysDeep(obj);
  }

  const indentStr = indent === "tab" ? "\t" : indent;
  return JSON.stringify(obj, null, indentStr);
}

/**
 * Minify JSON to single line
 */
export function minifyJson(json: string | unknown): string {
  const obj = typeof json === "string" ? JSON.parse(json) : json;
  return JSON.stringify(obj);
}

/**
 * Sort object keys alphabetically (deep)
 */
export function sortObjectKeysDeep(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeysDeep);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>)
      .sort((a, b) => a.localeCompare(b))
      .reduce(
        (acc, key) => {
          acc[key] = sortObjectKeysDeep(
            (obj as Record<string, unknown>)[key]
          );
          return acc;
        },
        {} as Record<string, unknown>
      );
  }
  return obj;
}

/**
 * Get the indent string from IndentType
 */
export function getIndentString(indent: IndentType): string {
  return indent === "tab" ? "\t" : " ".repeat(indent);
}

/**
 * Detect the indent used in a JSON string
 */
export function detectIndent(json: string): IndentType {
  const match = json.match(/^[\t ]+/m);
  if (!match) return 2;

  const indent = match[0];
  if (indent.startsWith("\t")) return "tab";
  return 2;
}
