"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { JsonNode } from "./JsonNode";
import { useEditorStore } from "@/stores/editor";
import { pathToKey } from "@/lib/utils/json-path";
import type { JsonValue, JsonNodeInfo } from "@/types";
import { getValueType, getChildCount } from "@/lib/utils/json-utils";

export function JsonExplorer() {
  const parentRef = useRef<HTMLDivElement>(null);
  const {
    parsedJson,
    selectedPath,
    expandedPaths,
    searchResults,
    toggleExpand,
    selectPath,
    scrollToPath,
  } = useEditorStore();

  // Flatten the JSON tree into a list of visible nodes
  const flatNodes = useMemo(() => {
    if (!parsedJson) return [];

    const nodes: JsonNodeInfo[] = [];
    let index = 0;

    function traverse(
      value: JsonValue,
      path: string[],
      key: string | number | null,
      depth: number,
      parentType: "object" | "array" | null
    ) {
      const type = getValueType(value);
      const pathKey = pathToKey(path);
      const isExpanded = expandedPaths.has(pathKey);
      const childCount = getChildCount(value);

      nodes.push({
        path,
        key,
        value,
        type,
        depth,
        index: index++,
        parentType,
        childCount,
        isExpanded,
      });

      // If expanded and has children, traverse children
      if (isExpanded && (type === "object" || type === "array")) {
        if (type === "array") {
          const arr = value as JsonValue[];
          arr.forEach((item, i) => {
            traverse(item, [...path, String(i)], i, depth + 1, "array");
          });
        } else {
          const obj = value as Record<string, JsonValue>;
          Object.keys(obj).forEach((k) => {
            traverse(obj[k], [...path, k], k, depth + 1, "object");
          });
        }

        // Add closing bracket
        nodes.push({
          path: [...path, "__close__"],
          key: null,
          value: type === "array" ? "]" : "}",
          type: type,
          depth,
          index: index++,
          parentType,
          isExpanded: false,
        });
      }
    }

    traverse(parsedJson, [], null, 0, null);
    return nodes;
  }, [parsedJson, expandedPaths]);

  // Set up virtualizer
  const virtualizer = useVirtualizer({
    count: flatNodes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 10,
  });

  // Scroll to selected path when it changes
  useEffect(() => {
    const selectedKey = pathToKey(selectedPath);
    const selectedIndex = flatNodes.findIndex(
      (node) => pathToKey(node.path) === selectedKey
    );
    if (selectedIndex !== -1) {
      virtualizer.scrollToIndex(selectedIndex, { align: "auto" });
    }
  }, [selectedPath, flatNodes, virtualizer]);

  // Search match paths for highlighting
  const searchMatchPaths = useMemo(() => {
    return new Set(searchResults.map((r) => pathToKey(r.path)));
  }, [searchResults]);

  // Handle node selection - selects path and scrolls editor
  const handleSelect = useCallback(
    (path: string[]) => {
      selectPath(path);
      scrollToPath(path);
    },
    [selectPath, scrollToPath]
  );

  if (!parsedJson) {
    return null;
  }

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-auto bg-[var(--bg-base)] min-h-0"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const node = flatNodes[virtualRow.index];

          // Handle closing brackets
          if (node.key === null && (node.value === "}" || node.value === "]")) {
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div
                  className="py-1 px-2 font-mono text-[15px] text-[var(--fg-muted)]"
                  style={{ paddingLeft: `${node.depth * 20 + 32}px` }}
                >
                  {node.value as string}
                </div>
              </div>
            );
          }

          const pathKey = pathToKey(node.path);
          const isSelected = pathKey === pathToKey(selectedPath);
          const isSearchMatch = searchMatchPaths.has(pathKey);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <JsonNode
                nodeKey={node.key}
                value={node.value}
                path={node.path}
                depth={node.depth}
                isExpanded={node.isExpanded || false}
                isSelected={isSelected}
                isSearchMatch={isSearchMatch}
                parentType={node.parentType}
                onToggle={toggleExpand}
                onSelect={handleSelect}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
