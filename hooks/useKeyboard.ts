"use client";

import { useEffect, useCallback, useRef } from "react";
import { useEditorStore } from "@/stores/editor";
import { useThemeStore } from "@/stores/theme";
import { useSettingsStore } from "@/stores/settings";
import { copyToClipboard, formatValueForCopy } from "@/lib/utils/copy";
import { formatPath } from "@/lib/utils/json-path";
import { formatJson, minifyJson } from "@/lib/json-format";
import type { JsonValue, LayoutMode } from "@/types";

interface KeyboardOptions {
  enabled?: boolean;
  onCopy?: () => void;
}

export function useKeyboard(options: KeyboardOptions = {}) {
  const { enabled = true, onCopy } = options;

  const pendingKey = useRef<string | null>(null);
  const pendingTimeout = useRef<NodeJS.Timeout | null>(null);

  const {
    parsedJson,
    rawJson,
    selectedPath,
    expandedPaths,
    showSearch,
    showCommandPalette,
    layoutMode,
    viewMode,
    fileName,
    selectPath,
    toggleExpand,
    expandAll,
    collapseAll,
    setShowSearch,
    nextSearchResult,
    prevSearchResult,
    setShowCommandPalette,
    setLayoutMode,
    setViewMode,
    setJson,
    repairCurrentJson,
  } = useEditorStore();

  const { toggleDarkLight } = useThemeStore();
  const { copyFormat, indent } = useSettingsStore();

  const getValueAtPath = useCallback(
    (path: string[]): JsonValue | undefined => {
      if (!parsedJson) return undefined;
      let value: JsonValue = parsedJson;
      for (const key of path) {
        if (value === null || typeof value !== "object") return undefined;
        if (Array.isArray(value)) {
          value = value[parseInt(key, 10)];
        } else {
          value = value[key];
        }
      }
      return value;
    },
    [parsedJson]
  );

  const getAllPaths = useCallback((): string[][] => {
    if (!parsedJson) return [];
    const paths: string[][] = [];

    function traverse(value: JsonValue, path: string[]) {
      paths.push(path);
      if (value !== null && typeof value === "object") {
        const isExpanded = expandedPaths.has(path.join("\x00"));
        if (isExpanded) {
          if (Array.isArray(value)) {
            value.forEach((_, i) => traverse(value[i], [...path, String(i)]));
          } else {
            Object.keys(value).forEach((key) =>
              traverse(value[key], [...path, key])
            );
          }
        }
      }
    }

    traverse(parsedJson, []);
    return paths;
  }, [parsedJson, expandedPaths]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore if typing in an input (except for some global shortcuts)
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Handle meta/ctrl combinations first - these work even with invalid JSON
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setShowCommandPalette(!showCommandPalette);
          return;
        }
        // Cmd+E to format JSON
        if (e.key === "e" || e.key === "E") {
          e.preventDefault();
          if (rawJson) {
            try {
              const formatted = formatJson(rawJson, { indent });
              setJson(formatted, fileName);
            } catch {
              // Invalid JSON
            }
          }
          return;
        }
        // Cmd+D to repair JSON
        if (e.key === "d" || e.key === "D") {
          e.preventDefault();
          repairCurrentJson();
          return;
        }
        // Cmd+M to minify JSON
        if (e.key === "m" || e.key === "M") {
          e.preventDefault();
          if (rawJson) {
            try {
              const minified = minifyJson(rawJson);
              setJson(minified, fileName);
            } catch {
              // Invalid JSON
            }
          }
          return;
        }
        // Cmd+\ to cycle layout
        if (e.key === "\\") {
          e.preventDefault();
          const layoutOrder: LayoutMode[] = [
            "split-horizontal",
            "split-vertical",
            "editor-only",
            "preview-only",
          ];
          const currentIndex = layoutOrder.indexOf(layoutMode);
          const nextIndex = (currentIndex + 1) % layoutOrder.length;
          setLayoutMode(layoutOrder[nextIndex]);
          return;
        }
        // Cmd+Shift+V to toggle view mode
        if (e.shiftKey && (e.key === "v" || e.key === "V")) {
          e.preventDefault();
          setViewMode(viewMode === "tree" ? "formatted" : "tree");
          return;
        }
        return;
      }

      // For non-meta shortcuts, skip if typing in input or no valid JSON
      if (isTyping || !parsedJson) return;

      // Handle escape
      if (e.key === "Escape") {
        e.preventDefault();
        if (showSearch) {
          setShowSearch(false);
        } else if (showCommandPalette) {
          setShowCommandPalette(false);
        } else {
          selectPath([]);
        }
        return;
      }

      // Skip if modals are open
      if (showSearch || showCommandPalette) {
        if (showSearch) {
          if (e.key === "n" && !e.shiftKey) {
            e.preventDefault();
            nextSearchResult();
          } else if (e.key === "N" || (e.key === "n" && e.shiftKey)) {
            e.preventDefault();
            prevSearchResult();
          }
        }
        return;
      }

      const paths = getAllPaths();
      const currentIndex = paths.findIndex(
        (p) => p.join("\x00") === selectedPath.join("\x00")
      );

      // Handle g prefix for gg
      if (pendingKey.current === "g" && e.key === "g") {
        e.preventDefault();
        pendingKey.current = null;
        if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
        if (paths.length > 0) selectPath(paths[0]);
        return;
      }

      // Start g sequence
      if (e.key === "g" && !e.shiftKey) {
        pendingKey.current = "g";
        if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
        pendingTimeout.current = setTimeout(() => {
          pendingKey.current = null;
        }, 500);
        return;
      }

      pendingKey.current = null;

      switch (e.key) {
        // Navigation
        case "j":
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < paths.length - 1) {
            selectPath(paths[currentIndex + 1]);
          } else if (currentIndex === -1 && paths.length > 0) {
            selectPath(paths[0]);
          }
          break;

        case "k":
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            selectPath(paths[currentIndex - 1]);
          } else if (currentIndex === -1 && paths.length > 0) {
            selectPath(paths[paths.length - 1]);
          }
          break;

        case "h":
        case "ArrowLeft":
          e.preventDefault();
          if (selectedPath.length > 0) {
            const value = getValueAtPath(selectedPath);
            const isExpandable =
              value !== null &&
              typeof value === "object" &&
              (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0);
            const isExpanded = expandedPaths.has(selectedPath.join("\x00"));

            if (isExpandable && isExpanded) {
              toggleExpand(selectedPath);
            } else if (selectedPath.length > 0) {
              selectPath(selectedPath.slice(0, -1));
            }
          }
          break;

        case "l":
        case "ArrowRight":
          e.preventDefault();
          if (selectedPath.length >= 0) {
            const value = getValueAtPath(selectedPath);
            const isExpandable =
              value !== null &&
              typeof value === "object" &&
              (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0);
            const isExpanded = expandedPaths.has(selectedPath.join("\x00"));

            if (isExpandable && !isExpanded) {
              toggleExpand(selectedPath);
            } else if (isExpandable && isExpanded) {
              // Go to first child
              const childPath =
                Array.isArray(value) && value.length > 0
                  ? [...selectedPath, "0"]
                  : typeof value === "object" && value !== null
                  ? [...selectedPath, Object.keys(value)[0]]
                  : selectedPath;
              selectPath(childPath);
            }
          }
          break;

        case "G":
          e.preventDefault();
          if (paths.length > 0) selectPath(paths[paths.length - 1]);
          break;

        case "Enter":
          e.preventDefault();
          if (selectedPath.length >= 0) {
            toggleExpand(selectedPath);
          }
          break;

        // Actions
        case "y":
          e.preventDefault();
          if (selectedPath.length >= 0) {
            const path = formatPath(selectedPath, copyFormat);
            copyToClipboard(path);
            onCopy?.();
          }
          break;

        case "Y":
          e.preventDefault();
          if (selectedPath.length >= 0) {
            const value = getValueAtPath(selectedPath);
            if (value !== undefined) {
              copyToClipboard(formatValueForCopy(value));
              onCopy?.();
            }
          }
          break;

        case "E":
          e.preventDefault();
          expandAll();
          break;

        case "C":
          e.preventDefault();
          collapseAll();
          break;

        case "/":
          e.preventDefault();
          setShowSearch(true);
          break;

        // UI
        case "T":
          e.preventDefault();
          setShowCommandPalette(true);
          break;

        case "D":
          e.preventDefault();
          if (useThemeStore.getState().theme.type === "light") {
            toggleDarkLight();
          }
          break;

        case "L":
          e.preventDefault();
          if (useThemeStore.getState().theme.type === "dark") {
            toggleDarkLight();
          }
          break;

        case "?":
          e.preventDefault();
          // Could show help modal
          break;
      }
    },
    [
      enabled,
      parsedJson,
      rawJson,
      selectedPath,
      expandedPaths,
      showSearch,
      showCommandPalette,
      layoutMode,
      viewMode,
      fileName,
      copyFormat,
      indent,
      selectPath,
      toggleExpand,
      expandAll,
      collapseAll,
      setShowSearch,
      setShowCommandPalette,
      setLayoutMode,
      setViewMode,
      setJson,
      repairCurrentJson,
      nextSearchResult,
      prevSearchResult,
      toggleDarkLight,
      getAllPaths,
      getValueAtPath,
      onCopy,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
