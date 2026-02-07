import jsonMap from "json-source-map";

export interface Position {
  line: number;
  column: number;
  pos: number;
}

export interface Pointer {
  key?: Position;
  keyEnd?: Position;
  value: Position;
  valueEnd: Position;
}

export interface SourceMapResult {
  json: string;
  pointers: Record<string, Pointer>;
}

/**
 * Generate source map from parsed JSON
 */
export function generateSourceMap(data: unknown, indent = 2): SourceMapResult {
  const result = jsonMap.stringify(data, null, indent);
  return {
    json: result.json,
    pointers: result.pointers as Record<string, Pointer>,
  };
}

/**
 * Convert JSON path array to source-map path format
 * e.g., ["users", "0", "name"] → "/users/0/name"
 */
export function pathToPointerKey(path: string[]): string {
  if (path.length === 0) return "";
  return "/" + path.join("/");
}

/**
 * Convert source-map path to path array
 * e.g., "/users/0/name" → ["users", "0", "name"]
 */
export function pointerKeyToPath(key: string): string[] {
  if (!key || key === "") return [];
  return key.slice(1).split("/");
}

/**
 * Find the JSON path at a given position in the source
 */
export function findPathAtPosition(
  pointers: Record<string, Pointer>,
  pos: number
): string[] | null {
  let bestMatch: { path: string[]; pointer: Pointer } | null = null;
  let bestMatchSize = Infinity;

  for (const [key, pointer] of Object.entries(pointers)) {
    // Check if position is within the key range (for object properties)
    if (pointer.key && pointer.keyEnd) {
      const keyStart = pointer.key.pos;
      const keyEnd = pointer.keyEnd.pos;
      if (pos >= keyStart && pos <= keyEnd) {
        // Key matches are very specific, use a small size
        const size = keyEnd - keyStart;
        if (size < bestMatchSize) {
          bestMatch = { path: pointerKeyToPath(key), pointer };
          bestMatchSize = size;
        }
        continue;
      }
    }

    // Check if position is within the value range
    const start = pointer.value.pos;
    const end = pointer.valueEnd.pos;

    if (pos >= start && pos <= end) {
      const size = end - start;
      // Prefer smaller ranges (more specific matches)
      if (size < bestMatchSize) {
        bestMatch = { path: pointerKeyToPath(key), pointer };
        bestMatchSize = size;
      }
    }
  }

  return bestMatch?.path ?? null;
}

/**
 * Get position info for a given path
 */
export function getPositionForPath(
  pointers: Record<string, Pointer>,
  path: string[]
): Pointer | null {
  const key = pathToPointerKey(path);
  return pointers[key] ?? null;
}
