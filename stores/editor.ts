import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JsonValue, JsonStats, SearchResult, LayoutMode, ViewMode } from "@/types";
import { parseJson } from "@/lib/utils/json-utils";
import { pathToKey } from "@/lib/utils/json-path";
import { repairJson } from "@/lib/json-repair";
import { generateSourceMap, findPathAtPosition, getPositionForPath, type Pointer } from "@/lib/source-map";
import { getTabId, getEditorStorageKey, updateTabRegistry } from "@/lib/utils/tab-id";

interface EditorState {
  // Input
  rawJson: string;
  parsedJson: JsonValue | null;
  parseError: string | null;
  fileName: string;
  stats: JsonStats | null;

  // Repair
  repairedJson: string | null;
  wasRepaired: boolean;
  repairDismissed: boolean;

  // Layout
  layoutMode: LayoutMode;
  viewMode: ViewMode;
  wordWrap: boolean;

  // Navigation
  selectedPath: string[];
  expandedPaths: Set<string>;

  // Search
  searchQuery: string;
  searchResults: SearchResult[];
  searchIndex: number;
  showSearch: boolean;

  // UI
  showCommandPalette: boolean;

  // Hydration
  _hasHydrated: boolean;

  // Source map
  sourcePointers: Record<string, Pointer>;
  formattedJson: string;

  // Editor scroll target (for tree -> editor sync)
  scrollTarget: { pos: number; timestamp: number } | null;

  // Scroll sync between editor and tree (proportional)
  scrollSyncPercent: number | null;
  scrollSyncSource: "editor" | "tree" | null;
  scrollSyncTimestamp: number;

  // Actions
  setJson: (json: string, fileName?: string, shouldRepair?: boolean) => void;
  selectPathFromPosition: (pos: number) => void;
  scrollToPath: (path: string[]) => void;
  clearScrollTarget: () => void;
  setScrollSync: (percent: number, source: "editor" | "tree") => void;
  clearScrollSync: () => void;
  applyRepair: () => void;
  dismissRepair: () => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setViewMode: (mode: ViewMode) => void;
  setWordWrap: (wrap: boolean) => void;
  selectPath: (path: string[]) => void;
  toggleExpand: (path: string[]) => void;
  expandAll: () => void;
  collapseAll: () => void;
  expandToDepth: (depth: number) => void;
  setShowSearch: (show: boolean) => void;
  search: (query: string) => void;
  nextSearchResult: () => void;
  prevSearchResult: () => void;
  clearSearch: () => void;
  setShowCommandPalette: (show: boolean) => void;
  repairCurrentJson: () => boolean;
  reset: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

const initialState = {
  rawJson: "",
  parsedJson: null,
  _hasHydrated: false,
  parseError: null,
  fileName: "",
  stats: null,
  repairedJson: null,
  wasRepaired: false,
  repairDismissed: false,
  layoutMode: "split-horizontal" as LayoutMode,
  viewMode: "tree" as ViewMode,
  wordWrap: true,
  selectedPath: [] as string[],
  expandedPaths: new Set<string>(),
  searchQuery: "",
  searchResults: [] as SearchResult[],
  searchIndex: 0,
  showSearch: false,
  showCommandPalette: false,
  sourcePointers: {} as Record<string, Pointer>,
  formattedJson: "",
  scrollTarget: null,
  scrollSyncPercent: null as number | null,
  scrollSyncSource: null as "editor" | "tree" | null,
  scrollSyncTimestamp: 0,
};

// Get tab ID for storage key (must be called at module load for SSR safety)
const getStorageKey = () => {
  if (typeof window === "undefined") return "superjson-editor-server";
  return getEditorStorageKey(getTabId());
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      ...initialState,

  setJson: (json: string, fileName?: string, shouldRepair = false) => {
    const result = parseJson(json);

    if (result.success) {
      // Auto-expand first two levels
      const expandedPaths = new Set<string>();
      expandToDepthHelper(result.data, [], 2, expandedPaths);

      // Generate source map for position syncing
      const sourceMap = generateSourceMap(result.data, 2);

      set({
        rawJson: json,
        parsedJson: result.data,
        parseError: null,
        stats: result.stats,
        fileName: fileName || "",
        expandedPaths,
        selectedPath: [],
        searchQuery: "",
        searchResults: [],
        searchIndex: 0,
        repairedJson: null,
        wasRepaired: false,
        repairDismissed: false,
        sourcePointers: sourceMap.pointers,
        formattedJson: sourceMap.json,
      });
    } else if (shouldRepair) {
      // Only try repair when explicitly requested (file import, paste, etc.)
      const repairResult = repairJson(json);

      if (repairResult.wasRepaired && repairResult.parsed) {
        // Repair succeeded - auto-apply the repaired JSON
        const repairedParseResult = parseJson(repairResult.repaired);

        if (repairedParseResult.success) {
          const expandedPaths = new Set<string>();
          expandToDepthHelper(repairedParseResult.data, [], 2, expandedPaths);
          const sourceMap = generateSourceMap(repairedParseResult.data, 2);

          set({
            rawJson: repairResult.repaired, // Use repaired JSON
            parsedJson: repairedParseResult.data,
            parseError: null,
            stats: repairedParseResult.stats,
            fileName: fileName || "",
            expandedPaths,
            selectedPath: [],
            searchQuery: "",
            searchResults: [],
            searchIndex: 0,
            repairedJson: null,
            wasRepaired: true,
            repairDismissed: false,
            sourcePointers: sourceMap.pointers,
            formattedJson: sourceMap.json,
          });
        } else {
          set({
            rawJson: json,
            parsedJson: null,
            parseError: result.error,
            stats: null,
            fileName: fileName || "",
            repairedJson: null,
            wasRepaired: false,
            repairDismissed: false,
          });
        }
      } else {
        set({
          rawJson: json,
          parsedJson: null,
          parseError: result.error,
          stats: null,
          fileName: fileName || "",
          repairedJson: null,
          wasRepaired: false,
          repairDismissed: false,
        });
      }
    } else {
      // No repair - just show error
      set({
        rawJson: json,
        parsedJson: null,
        parseError: result.error,
        stats: null,
        fileName: fileName || "",
        repairedJson: null,
        wasRepaired: false,
        repairDismissed: false,
      });
    }
  },

  applyRepair: () => {
    const { repairedJson } = get();
    if (!repairedJson) return;

    // Apply the repaired JSON
    const result = parseJson(repairedJson);
    if (result.success) {
      const expandedPaths = new Set<string>();
      expandToDepthHelper(result.data, [], 2, expandedPaths);

      // Generate source map
      const sourceMap = generateSourceMap(result.data, 2);

      set({
        rawJson: repairedJson,
        parsedJson: result.data,
        parseError: null,
        stats: result.stats,
        expandedPaths,
        selectedPath: [],
        repairedJson: null,
        wasRepaired: false,
        repairDismissed: false,
        sourcePointers: sourceMap.pointers,
        formattedJson: sourceMap.json,
      });
    }
  },

  dismissRepair: () => {
    set({ repairDismissed: true });
  },

  selectPathFromPosition: (pos: number) => {
    const { sourcePointers, expandedPaths } = get();
    const path = findPathAtPosition(sourcePointers, pos);
    if (path) {
      const newExpanded = new Set(expandedPaths);
      expandPathTo(path, newExpanded);
      set({ selectedPath: path, expandedPaths: newExpanded });
    }
  },

  scrollToPath: (path: string[]) => {
    const { sourcePointers } = get();
    const pointer = getPositionForPath(sourcePointers, path);
    if (pointer) {
      set({ scrollTarget: { pos: pointer.value.pos, timestamp: Date.now() } });
    }
  },

  clearScrollTarget: () => {
    set({ scrollTarget: null });
  },

  setScrollSync: (percent: number, source: "editor" | "tree") => {
    set({
      scrollSyncPercent: percent,
      scrollSyncSource: source,
      scrollSyncTimestamp: Date.now(),
    });
  },

  clearScrollSync: () => {
    set({
      scrollSyncPercent: null,
      scrollSyncSource: null,
    });
  },

  setLayoutMode: (mode: LayoutMode) => {
    set({ layoutMode: mode });
  },

  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode });
  },

  setWordWrap: (wrap: boolean) => {
    set({ wordWrap: wrap });
  },

  selectPath: (path: string[]) => {
    set({ selectedPath: path });
  },

  toggleExpand: (path: string[]) => {
    const { expandedPaths } = get();
    const key = pathToKey(path);
    const newExpanded = new Set(expandedPaths);

    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }

    set({ expandedPaths: newExpanded });
  },

  expandAll: () => {
    const { parsedJson } = get();
    if (!parsedJson) return;

    const expandedPaths = new Set<string>();
    expandToDepthHelper(parsedJson, [], Infinity, expandedPaths);
    set({ expandedPaths });
  },

  collapseAll: () => {
    set({ expandedPaths: new Set<string>() });
  },

  expandToDepth: (depth: number) => {
    const { parsedJson } = get();
    if (!parsedJson) return;

    const expandedPaths = new Set<string>();
    expandToDepthHelper(parsedJson, [], depth, expandedPaths);
    set({ expandedPaths });
  },

  setShowSearch: (show: boolean) => {
    set({ showSearch: show });
    if (!show) {
      set({ searchQuery: "", searchResults: [], searchIndex: 0 });
    }
  },

  search: (query: string) => {
    const { parsedJson, sourcePointers } = get();
    if (!parsedJson || !query.trim()) {
      set({ searchQuery: query, searchResults: [], searchIndex: 0 });
      return;
    }

    const results: SearchResult[] = [];
    searchHelper(parsedJson, [], query.toLowerCase(), results);

    set({
      searchQuery: query,
      searchResults: results,
      searchIndex: results.length > 0 ? 0 : -1,
    });

    // Select and expand to first result, and scroll editor
    if (results.length > 0) {
      const { expandedPaths } = get();
      const newExpanded = new Set(expandedPaths);
      const targetPath = results[0].path;
      expandPathTo(targetPath, newExpanded);

      // Get scroll target for editor
      const pointer = getPositionForPath(sourcePointers, targetPath);

      set({
        selectedPath: targetPath,
        expandedPaths: newExpanded,
        scrollTarget: pointer ? { pos: pointer.value.pos, timestamp: Date.now() } : null,
      });
    }
  },

  nextSearchResult: () => {
    const { searchResults, searchIndex, expandedPaths, sourcePointers } = get();
    if (searchResults.length === 0) return;

    const newIndex = (searchIndex + 1) % searchResults.length;
    const newExpanded = new Set(expandedPaths);
    const targetPath = searchResults[newIndex].path;
    expandPathTo(targetPath, newExpanded);

    // Get scroll target for editor
    const pointer = getPositionForPath(sourcePointers, targetPath);

    set({
      searchIndex: newIndex,
      selectedPath: targetPath,
      expandedPaths: newExpanded,
      scrollTarget: pointer ? { pos: pointer.value.pos, timestamp: Date.now() } : null,
    });
  },

  prevSearchResult: () => {
    const { searchResults, searchIndex, expandedPaths, sourcePointers } = get();
    if (searchResults.length === 0) return;

    const newIndex =
      searchIndex <= 0 ? searchResults.length - 1 : searchIndex - 1;
    const newExpanded = new Set(expandedPaths);
    const targetPath = searchResults[newIndex].path;
    expandPathTo(targetPath, newExpanded);

    // Get scroll target for editor
    const pointer = getPositionForPath(sourcePointers, targetPath);

    set({
      searchIndex: newIndex,
      selectedPath: targetPath,
      expandedPaths: newExpanded,
      scrollTarget: pointer ? { pos: pointer.value.pos, timestamp: Date.now() } : null,
    });
  },

  clearSearch: () => {
    set({ searchQuery: "", searchResults: [], searchIndex: 0, showSearch: false });
  },

  setShowCommandPalette: (show: boolean) => {
    set({ showCommandPalette: show });
  },

  repairCurrentJson: () => {
    const { rawJson } = get();
    if (!rawJson) return false;

    const repairResult = repairJson(rawJson);
    if (!repairResult.wasRepaired || !repairResult.parsed) {
      return false;
    }

    const result = parseJson(repairResult.repaired);
    if (!result.success) return false;

    const expandedPaths = new Set<string>();
    expandToDepthHelper(result.data, [], 2, expandedPaths);
    const sourceMap = generateSourceMap(result.data, 2);

    set({
      rawJson: repairResult.repaired,
      parsedJson: result.data,
      parseError: null,
      stats: result.stats,
      expandedPaths,
      selectedPath: [],
      searchQuery: "",
      searchResults: [],
      searchIndex: 0,
      repairedJson: null,
      wasRepaired: true,
      repairDismissed: false,
      sourcePointers: sourceMap.pointers,
      formattedJson: sourceMap.json,
    });

    return true;
  },

  reset: () => {
    set(initialState);
  },

  setHasHydrated: (hydrated: boolean) => {
    set({ _hasHydrated: hydrated });
  },
    }),
    {
      name: "superjson-editor",
      storage: {
        getItem: () => {
          if (typeof window === "undefined") return null;
          const key = getStorageKey();
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (_name, value) => {
          if (typeof window === "undefined") return;
          const key = getStorageKey();
          localStorage.setItem(key, JSON.stringify(value));

          // Update tab registry for history feature
          const state = value.state as { rawJson?: string; fileName?: string };
          if (state.rawJson) {
            updateTabRegistry({
              id: getTabId(),
              fileName: state.fileName || "Untitled",
              lastModified: Date.now(),
              preview: state.rawJson.slice(0, 100),
            });
          }
        },
        removeItem: () => {
          if (typeof window === "undefined") return;
          const key = getStorageKey();
          localStorage.removeItem(key);
        },
      },
      partialize: (state) =>
        ({
          rawJson: state.rawJson,
          fileName: state.fileName,
          layoutMode: state.layoutMode,
          viewMode: state.viewMode,
          wordWrap: state.wordWrap,
        }) as unknown as EditorState,
      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          rawJson?: string;
          fileName?: string;
          layoutMode?: LayoutMode;
          viewMode?: ViewMode;
          wordWrap?: boolean;
        } | undefined;

        if (!persisted?.rawJson) {
          return {
            ...currentState,
            _hasHydrated: true,
          };
        }

        // Re-parse the JSON to reconstruct full state
        const result = parseJson(persisted.rawJson);
        if (result.success) {
          const expandedPaths = new Set<string>();
          expandToDepthHelper(result.data, [], 2, expandedPaths);
          const sourceMap = generateSourceMap(result.data, 2);

          return {
            ...currentState,
            rawJson: persisted.rawJson,
            parsedJson: result.data,
            parseError: null,
            stats: result.stats,
            fileName: persisted.fileName || "",
            layoutMode: persisted.layoutMode || currentState.layoutMode,
            viewMode: persisted.viewMode || currentState.viewMode,
            wordWrap: persisted.wordWrap ?? currentState.wordWrap,
            expandedPaths,
            sourcePointers: sourceMap.pointers,
            formattedJson: sourceMap.json,
            _hasHydrated: true,
          };
        }

        return {
          ...currentState,
          rawJson: persisted.rawJson,
          fileName: persisted.fileName || "",
          layoutMode: persisted.layoutMode || currentState.layoutMode,
          viewMode: persisted.viewMode || currentState.viewMode,
          wordWrap: persisted.wordWrap ?? currentState.wordWrap,
          _hasHydrated: true,
        };
      },
    }
  )
);

// Helper functions

function expandToDepthHelper(
  value: JsonValue,
  path: string[],
  maxDepth: number,
  expandedPaths: Set<string>
): void {
  if (path.length >= maxDepth) return;
  if (value === null || typeof value !== "object") return;

  expandedPaths.add(pathToKey(path));

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      expandToDepthHelper(item, [...path, String(index)], maxDepth, expandedPaths);
    });
  } else {
    Object.keys(value).forEach((key) => {
      expandToDepthHelper(value[key], [...path, key], maxDepth, expandedPaths);
    });
  }
}

function searchHelper(
  value: JsonValue,
  path: string[],
  query: string,
  results: SearchResult[]
): void {
  if (value === null) {
    if ("null".includes(query)) {
      results.push({ path, matchType: "value", value });
    }
    return;
  }

  if (typeof value === "string") {
    if (value.toLowerCase().includes(query)) {
      results.push({ path, matchType: "value", value });
    }
    return;
  }

  if (typeof value === "number") {
    if (String(value).includes(query)) {
      results.push({ path, matchType: "value", value });
    }
    return;
  }

  if (typeof value === "boolean") {
    if (String(value).includes(query)) {
      results.push({ path, matchType: "value", value });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      searchHelper(item, [...path, String(index)], query, results);
    });
    return;
  }

  // Object
  Object.keys(value).forEach((key) => {
    if (key.toLowerCase().includes(query)) {
      results.push({ path: [...path, key], matchType: "key", value: value[key] });
    }
    searchHelper(value[key], [...path, key], query, results);
  });
}

function expandPathTo(path: string[], expandedPaths: Set<string>): void {
  for (let i = 0; i < path.length; i++) {
    expandedPaths.add(pathToKey(path.slice(0, i)));
  }
}
