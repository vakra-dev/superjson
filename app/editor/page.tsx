"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Header, PathBar, StatusBar, SearchPanel, Toolbar, CommandPalette, ThemePicker } from "@/components/layout";
import {
  JsonExplorer,
  EditorPanel,
  FormattedView,
} from "@/components/editor";
import { useEditorStore } from "@/stores/editor";
import { useThemeStore } from "@/stores/theme";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboard } from "@/hooks/useKeyboard";
import { cn } from "@/lib/utils/cn";

export default function EditorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [splitPosition, setSplitPosition] = useState(50);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const isDragging = useRef(false);

  const {
    parsedJson,
    rawJson,
    setJson,
    layoutMode,
    viewMode,
    fileName,
    showCommandPalette,
    setShowCommandPalette,
  } = useEditorStore();

  const hasThemeHydrated = useThemeStore((state) => state._hasHydrated);
  const setThemeHasHydrated = useThemeStore((state) => state.setHasHydrated);
  const hasEditorHydrated = useEditorStore((state) => state._hasHydrated);
  const setEditorHasHydrated = useEditorStore((state) => state.setHasHydrated);

  useTheme();
  useKeyboard();

  const handleFileImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const text = await file.text();
        setJson(text, file.name, true); // Enable repair for file imports
      }
    },
    [setJson]
  );

  const handleUrlImport = useCallback(
    async (url: string) => {
      const response = await fetch(
        `/api/fetch?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch");
      }
      const data = await response.json();
      setJson(JSON.stringify(data.data, null, 2), url.split("/").pop() || "fetched.json", true); // Enable repair for URL imports
    },
    [setJson]
  );

  const handleEditorChange = useCallback(
    (value: string) => {
      setJson(value, fileName);
    },
    [setJson, fileName]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = layoutMode === "split-vertical" ? "row-resize" : "col-resize";
    document.body.style.userSelect = "none";
  }, [layoutMode]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      const container = document.getElementById("split-container");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      let newPosition: number;

      if (layoutMode === "split-vertical") {
        newPosition = ((e.clientY - rect.top) / rect.height) * 100;
      } else {
        newPosition = ((e.clientX - rect.left) / rect.width) * 100;
      }

      setSplitPosition(Math.min(Math.max(newPosition, 20), 80));
    },
    [layoutMode]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  // Fallback: ensure hydration is marked complete after mount
  useEffect(() => {
    if (!hasThemeHydrated) {
      const timer = setTimeout(() => {
        setThemeHasHydrated(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [hasThemeHydrated, setThemeHasHydrated]);

  useEffect(() => {
    if (!hasEditorHydrated) {
      const timer = setTimeout(() => {
        setEditorHasHydrated(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [hasEditorHydrated, setEditorHasHydrated]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Wait for both stores to hydrate before rendering to prevent flash
  if (!hasThemeHydrated || !hasEditorHydrated) {
    return null;
  }

  const showEditor = layoutMode !== "preview-only";
  const showPreview = layoutMode !== "editor-only";
  const isVertical = layoutMode === "split-vertical";

  const renderPreviewContent = () => {
    if (!parsedJson) {
      return (
        <div className="flex-1 flex items-center justify-center text-[var(--fg-muted)]">
          <div className="text-center p-8">
            {!rawJson ? (
              <>
                <p className="text-lg mb-2">Paste or type JSON</p>
                <p className="text-sm">Start typing in the editor to see the preview</p>
              </>
            ) : (
              <>
                <p className="text-lg mb-2">Invalid JSON</p>
                <p className="text-sm">Fix the errors in the editor to see the preview</p>
              </>
            )}
          </div>
        </div>
      );
    }

    if (viewMode === "tree") {
      return <JsonExplorer />;
    }

    return <FormattedView />;
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-base)]">
      <Header
        onImportFile={handleFileImport}
        onImportUrl={() => {
          const url = prompt("Enter JSON URL:");
          if (url) handleUrlImport(url);
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Toolbar */}
        <Toolbar />


        {/* PathBar */}
        <PathBar />

        {/* Split view container */}
        <div
          id="split-container"
          className={cn(
            "flex-1 flex min-h-0",
            isVertical ? "flex-col" : "flex-row"
          )}
        >
          {/* Editor panel */}
          {showEditor && (
            <>
              <div
                className="min-h-0 min-w-0 overflow-hidden"
                style={
                  showPreview
                    ? isVertical
                      ? { height: `${splitPosition}%` }
                      : { width: `${splitPosition}%` }
                    : { flex: 1 }
                }
              >
                <EditorPanel
                  value={rawJson}
                  onChange={handleEditorChange}
                  className="h-full"
                />
              </div>

              {/* Resizer */}
              {showPreview && (
                <div
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isVertical
                      ? "h-1 cursor-row-resize hover:bg-[var(--accent)]"
                      : "w-1 cursor-col-resize hover:bg-[var(--accent)]",
                    "bg-[var(--border)]"
                  )}
                  onMouseDown={handleMouseDown}
                />
              )}
            </>
          )}

          {/* Preview panel */}
          {showPreview && (
            <div
              className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden"
              style={
                showEditor
                  ? isVertical
                    ? { height: `${100 - splitPosition}%` }
                    : { width: `${100 - splitPosition}%` }
                  : {}
              }
            >
              <div className="flex-1 flex flex-col relative min-h-0">
                <SearchPanel />
                {renderPreviewContent()}
              </div>
            </div>
          )}
        </div>

        <StatusBar />
      </div>

      <CommandPalette
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onOpenThemePicker={() => setShowThemePicker(true)}
      />

      <ThemePicker
        open={showThemePicker}
        onClose={() => setShowThemePicker(false)}
      />
    </div>
  );
}
