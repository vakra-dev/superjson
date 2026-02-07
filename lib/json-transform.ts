export interface TransformChange {
  type:
    | "keys"
    | "quotes"
    | "commas"
    | "comments"
    | "undefined"
    | "nan"
    | "infinity";
  description: string;
  count: number;
}

export interface TransformResult {
  original: string;
  transformed: string;
  parsed: unknown | null;
  error: string | null;
  changes: TransformChange[];
  isValid: boolean;
  wasTransformed: boolean;
}

/**
 * Transform common JavaScript object notation to valid JSON
 */
export function transformJson(input: string): TransformResult {
  let transformed = input;
  const changes: TransformChange[] = [];

  // 1. Remove single-line comments (// ...)
  const singleLineComments = (transformed.match(/\/\/[^\n]*/g) || []).length;
  if (singleLineComments > 0) {
    transformed = transformed.replace(/\/\/[^\n]*/g, "");
    changes.push({
      type: "comments",
      description: "Removed single-line comments",
      count: singleLineComments,
    });
  }

  // 2. Remove multi-line comments (/* ... */)
  const multiLineComments = (transformed.match(/\/\*[\s\S]*?\*\//g) || [])
    .length;
  if (multiLineComments > 0) {
    transformed = transformed.replace(/\/\*[\s\S]*?\*\//g, "");
    changes.push({
      type: "comments",
      description: "Removed multi-line comments",
      count: multiLineComments,
    });
  }

  // 3. Fix unquoted keys: {key: "value"} -> {"key": "value"}
  const unquotedKeyRegex = /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g;
  let unquotedKeysCount = 0;
  transformed = transformed.replace(unquotedKeyRegex, (match, prefix, key) => {
    unquotedKeysCount++;
    return `${prefix}"${key}":`;
  });
  if (unquotedKeysCount > 0) {
    changes.push({
      type: "keys",
      description: "Added quotes to unquoted keys",
      count: unquotedKeysCount,
    });
  }

  // 4. Convert single quotes to double quotes for strings
  // This is tricky - we need to handle nested quotes
  let singleQuoteCount = 0;
  // Simple approach: replace 'value' with "value" when it looks like a JSON string
  transformed = transformed.replace(
    /:\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g,
    (match, content) => {
      singleQuoteCount++;
      // Escape any double quotes inside
      const escaped = content.replace(/"/g, '\\"');
      return `: "${escaped}"`;
    }
  );
  // Also handle single-quoted keys
  transformed = transformed.replace(
    /([{,]\s*)'([^'\\]*(?:\\.[^'\\]*)*)'\s*:/g,
    (match, prefix, key) => {
      singleQuoteCount++;
      return `${prefix}"${key}":`;
    }
  );
  if (singleQuoteCount > 0) {
    changes.push({
      type: "quotes",
      description: "Converted single quotes to double quotes",
      count: singleQuoteCount,
    });
  }

  // 5. Remove trailing commas: [1, 2, 3,] -> [1, 2, 3]
  const trailingCommaRegex = /,(\s*[}\]])/g;
  let trailingCommaCount = 0;
  transformed = transformed.replace(trailingCommaRegex, (match, bracket) => {
    trailingCommaCount++;
    return bracket;
  });
  if (trailingCommaCount > 0) {
    changes.push({
      type: "commas",
      description: "Removed trailing commas",
      count: trailingCommaCount,
    });
  }

  // 6. Convert undefined to null
  const undefinedRegex = /:\s*undefined\b/g;
  const undefinedCount = (transformed.match(undefinedRegex) || []).length;
  if (undefinedCount > 0) {
    transformed = transformed.replace(undefinedRegex, ": null");
    changes.push({
      type: "undefined",
      description: "Converted undefined to null",
      count: undefinedCount,
    });
  }

  // 7. Convert NaN to null
  const nanRegex = /:\s*NaN\b/g;
  const nanCount = (transformed.match(nanRegex) || []).length;
  if (nanCount > 0) {
    transformed = transformed.replace(nanRegex, ": null");
    changes.push({
      type: "nan",
      description: "Converted NaN to null",
      count: nanCount,
    });
  }

  // 8. Convert Infinity to null
  const infinityRegex = /:\s*-?Infinity\b/g;
  const infinityCount = (transformed.match(infinityRegex) || []).length;
  if (infinityCount > 0) {
    transformed = transformed.replace(infinityRegex, ": null");
    changes.push({
      type: "infinity",
      description: "Converted Infinity to null",
      count: infinityCount,
    });
  }

  // Try to parse the result
  let parsed: unknown | null = null;
  let error: string | null = null;

  try {
    parsed = JSON.parse(transformed);
  } catch (e) {
    error = e instanceof Error ? e.message : "Invalid JSON";
  }

  return {
    original: input,
    transformed,
    parsed,
    error,
    changes,
    isValid: parsed !== null,
    wasTransformed: changes.length > 0,
  };
}

/**
 * Check if the input needs transformation
 */
export function needsTransformation(input: string): boolean {
  // Quick checks for common issues
  const hasComments = /\/\/|\/\*/.test(input);
  const hasUnquotedKeys = /[{,]\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:/.test(input);
  const hasSingleQuotes = /'[^']*'/.test(input);
  const hasTrailingCommas = /,\s*[}\]]/.test(input);
  const hasUndefined = /:\s*undefined\b/.test(input);
  const hasNaN = /:\s*NaN\b/.test(input);
  const hasInfinity = /:\s*-?Infinity\b/.test(input);

  return (
    hasComments ||
    hasUnquotedKeys ||
    hasSingleQuotes ||
    hasTrailingCommas ||
    hasUndefined ||
    hasNaN ||
    hasInfinity
  );
}
