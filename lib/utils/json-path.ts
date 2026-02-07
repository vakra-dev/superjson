import type { CopyFormat } from "@/types";

/**
 * Convert a path array to different path formats
 */
export function formatPath(path: string[], format: CopyFormat): string {
  if (path.length === 0) {
    switch (format) {
      case "jsonpath":
        return "$";
      case "jq":
        return ".";
      case "js":
        return "data";
    }
  }

  switch (format) {
    case "jsonpath":
      return formatJsonPath(path);
    case "jq":
      return formatJqPath(path);
    case "js":
      return formatJsPath(path);
  }
}

function formatJsonPath(path: string[]): string {
  return (
    "$" +
    path
      .map((segment) => {
        if (/^\d+$/.test(segment)) {
          return `[${segment}]`;
        }
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(segment)) {
          return `.${segment}`;
        }
        return `['${segment.replace(/'/g, "\\'")}']`;
      })
      .join("")
  );
}

function formatJqPath(path: string[]): string {
  if (path.length === 0) return ".";

  return (
    "." +
    path
      .map((segment) => {
        if (/^\d+$/.test(segment)) {
          return `[${segment}]`;
        }
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(segment)) {
          return segment;
        }
        return `["${segment.replace(/"/g, '\\"')}"]`;
      })
      .join(".")
      .replace(/\.\[/g, "[")
  );
}

function formatJsPath(path: string[]): string {
  return (
    "data" +
    path
      .map((segment) => {
        if (/^\d+$/.test(segment)) {
          return `[${segment}]`;
        }
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(segment)) {
          return `.${segment}`;
        }
        return `["${segment.replace(/"/g, '\\"')}"]`;
      })
      .join("")
  );
}

/**
 * Parse a path string back to path array
 */
export function parsePath(pathStr: string): string[] {
  const path: string[] = [];
  // Remove leading $ or . or "data"
  let str = pathStr.replace(/^(\$|\.?data|\.)/, "");

  const regex = /\.?([a-zA-Z_][a-zA-Z0-9_]*)|\[(\d+)\]|\[["']([^"']+)["']\]/g;
  let match;

  while ((match = regex.exec(str)) !== null) {
    path.push(match[1] || match[2] || match[3]);
  }

  return path;
}

/**
 * Get the path as a string key for Set/Map operations
 */
export function pathToKey(path: string[]): string {
  return path.join("\x00");
}

/**
 * Convert a path key back to path array
 */
export function keyToPath(key: string): string[] {
  return key === "" ? [] : key.split("\x00");
}
