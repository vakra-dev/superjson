import type { JsonValue, JsonStats, ParseOutput, JsonValueType } from "@/types";

/**
 * Parse JSON with stats
 */
export function parseJson(input: string): ParseOutput {
  const startTime = performance.now();

  try {
    const data = JSON.parse(input) as JsonValue;
    const parseTime = performance.now() - startTime;

    const stats = calculateStats(input, data, parseTime);

    return {
      success: true,
      data,
      stats,
    };
  } catch (e) {
    const error = e as SyntaxError;
    const match = error.message.match(/position (\d+)/);
    return {
      success: false,
      error: error.message,
      position: match ? parseInt(match[1], 10) : undefined,
    };
  }
}

/**
 * Calculate JSON stats
 */
function calculateStats(
  input: string,
  data: JsonValue,
  parseTime: number
): JsonStats {
  const bytes = new Blob([input]).size;
  const lines = input.split("\n").length;
  const { nodeCount, maxDepth } = countNodes(data);

  return {
    bytes,
    lines,
    parseTime,
    nodeCount,
    maxDepth,
  };
}

/**
 * Count nodes and max depth
 */
function countNodes(
  value: JsonValue,
  depth = 0
): { nodeCount: number; maxDepth: number } {
  if (value === null || typeof value !== "object") {
    return { nodeCount: 1, maxDepth: depth };
  }

  let nodeCount = 1;
  let maxDepth = depth;

  if (Array.isArray(value)) {
    for (const item of value) {
      const result = countNodes(item, depth + 1);
      nodeCount += result.nodeCount;
      maxDepth = Math.max(maxDepth, result.maxDepth);
    }
  } else {
    for (const key in value) {
      const result = countNodes(value[key], depth + 1);
      nodeCount += result.nodeCount;
      maxDepth = Math.max(maxDepth, result.maxDepth);
    }
  }

  return { nodeCount, maxDepth };
}

/**
 * Get the type of a JSON value
 */
export function getValueType(value: JsonValue): JsonValueType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as JsonValueType;
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format parse time
 */
export function formatParseTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`;
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Get child count for objects and arrays
 */
export function getChildCount(value: JsonValue): number | undefined {
  if (value === null || typeof value !== "object") {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.length;
  }
  return Object.keys(value).length;
}

/**
 * Pretty print JSON
 */
export function formatJson(value: JsonValue, indent = 2): string {
  return JSON.stringify(value, null, indent);
}

/**
 * Minify JSON
 */
export function minifyJson(value: JsonValue): string {
  return JSON.stringify(value);
}
