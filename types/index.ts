export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

export interface ParseResult {
  success: true;
  data: JsonValue;
  stats: JsonStats;
}

export interface ParseError {
  success: false;
  error: string;
  position?: number;
}

export type ParseOutput = ParseResult | ParseError;

export interface JsonStats {
  bytes: number;
  lines: number;
  parseTime: number;
  nodeCount: number;
  maxDepth: number;
}

export interface JsonNodeInfo {
  path: string[];
  key: string | number | null;
  value: JsonValue;
  type: JsonValueType;
  depth: number;
  index: number;
  parentType: "object" | "array" | null;
  childCount?: number;
  isExpanded?: boolean;
}

export type JsonValueType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "object"
  | "array";

export type CopyFormat = "jsonpath" | "jq" | "js";

export type LayoutMode = "split-horizontal" | "split-vertical" | "editor-only" | "preview-only";

export type ViewMode = "tree" | "formatted";

export interface SearchResult {
  path: string[];
  matchType: "key" | "value";
  value: JsonValue;
}

export interface KeyBinding {
  key: string;
  shift?: boolean;
  meta?: boolean;
  ctrl?: boolean;
  action: string;
  description: string;
}
