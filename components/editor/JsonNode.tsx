"use client";

import { memo } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { JsonValue } from "./JsonValue";
import type { JsonValue as JsonValueType } from "@/types";
import { getValueType, getChildCount } from "@/lib/utils/json-utils";
import { pathToKey } from "@/lib/utils/json-path";

interface JsonNodeProps {
  nodeKey: string | number | null;
  value: JsonValueType;
  path: string[];
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  isSearchMatch: boolean;
  parentType: "object" | "array" | null;
  onToggle: (path: string[]) => void;
  onSelect: (path: string[]) => void;
}

export const JsonNode = memo(function JsonNode({
  nodeKey,
  value,
  path,
  depth,
  isExpanded,
  isSelected,
  isSearchMatch,
  parentType,
  onToggle,
  onSelect,
}: JsonNodeProps) {
  const type = getValueType(value);
  const isExpandable = type === "object" || type === "array";
  const childCount = getChildCount(value);
  const isEmpty = childCount === 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExpandable && !isEmpty) {
      onToggle(path);
    }
  };

  const handleSelect = () => {
    onSelect(path);
  };

  const renderKey = () => {
    if (nodeKey === null) return null;

    if (parentType === "array") {
      return (
        <span className="text-[var(--fg-muted)] mr-1">
          {nodeKey}
          <span className="text-[var(--fg-muted)]">:</span>
        </span>
      );
    }

    return (
      <span className="text-[var(--type-key)] mr-1">
        "{nodeKey}"
        <span className="text-[var(--fg-muted)]">:</span>
      </span>
    );
  };

  const renderExpandIcon = () => {
    if (!isExpandable || isEmpty) {
      return <span className="w-5 h-5 inline-block shrink-0" />;
    }

    return (
      <button
        onClick={handleToggle}
        className="w-5 h-5 flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors shrink-0"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
    );
  };

  const renderValue = () => {
    if (!isExpandable) {
      return <JsonValue value={value} />;
    }

    if (isEmpty) {
      return (
        <span className="text-[var(--fg-muted)]">
          {type === "array" ? "[]" : "{}"}
        </span>
      );
    }

    if (!isExpanded) {
      return (
        <span className="text-[var(--fg-muted)]">
          {type === "array" ? `[${childCount}]` : `{${childCount}}`}
        </span>
      );
    }

    return (
      <span className="text-[var(--fg-muted)]">
        {type === "array" ? "[" : "{"}
      </span>
    );
  };

  return (
    <div
      onClick={handleSelect}
      className={cn(
        "flex items-center py-1 px-2 cursor-pointer rounded-sm transition-colors duration-75 overflow-hidden",
        "hover:bg-[var(--bg-hover)]",
        isSelected && "bg-[var(--bg-hover)] ring-1 ring-[var(--accent)] ring-inset",
        isSearchMatch && !isSelected && "bg-[var(--warning)]/10"
      )}
      style={{ paddingLeft: `${depth * 20 + 8}px` }}
    >
      {renderExpandIcon()}
      <span className="font-mono text-[15px] leading-7 ml-1 truncate min-w-0">
        {renderKey()}
        {renderValue()}
      </span>
    </div>
  );
});
