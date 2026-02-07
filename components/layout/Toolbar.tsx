"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { useEditorStore } from "@/stores/editor";
import { useSettingsStore } from "@/stores/settings";
import { formatJson, minifyJson } from "@/lib/json-format";
import { copyToClipboard } from "@/lib/utils/copy";
import {
  AlignLeft,
  Minimize2,
  ArrowDownAZ,
  WrapText,
  Copy,
  Check,
  LayoutPanelLeft,
  Rows3,
  Code2,
  TreePine,
  FileJson2,
  Columns2,
  Wrench,
} from "lucide-react";
import type { LayoutMode } from "@/types";

const LAYOUT_ORDER: LayoutMode[] = [
  "split-horizontal",
  "split-vertical",
  "editor-only",
  "preview-only",
];

interface ToolbarProps {
  className?: string;
}

export function Toolbar({ className }: ToolbarProps) {
  const [copied, setCopied] = useState(false);

  const {
    rawJson,
    parseError,
    layoutMode,
    viewMode,
    wordWrap,
    setJson,
    setLayoutMode,
    setViewMode,
    setWordWrap,
    repairCurrentJson,
    fileName,
  } = useEditorStore();

  const { indent, setIndent } = useSettingsStore();

  const handleFormat = useCallback(() => {
    if (!rawJson) return;
    try {
      const formatted = formatJson(rawJson, { indent });
      setJson(formatted, fileName);
    } catch {
      // Invalid JSON
    }
  }, [rawJson, indent, setJson, fileName]);

  const handleMinify = useCallback(() => {
    if (!rawJson) return;
    try {
      const minified = minifyJson(rawJson);
      setJson(minified, fileName);
    } catch {
      // Invalid JSON
    }
  }, [rawJson, setJson, fileName]);

  const handleSortKeys = useCallback(() => {
    if (!rawJson) return;
    try {
      const formatted = formatJson(rawJson, { indent, sortKeys: true });
      setJson(formatted, fileName);
    } catch {
      // Invalid JSON
    }
  }, [rawJson, indent, setJson, fileName]);

  const handleCopy = useCallback(async () => {
    await copyToClipboard(rawJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [rawJson]);

  const layoutIcons: Record<LayoutMode, React.ReactNode> = {
    "split-horizontal": <Columns2 className="w-[18px] h-[18px]" />,
    "split-vertical": <Rows3 className="w-[18px] h-[18px]" />,
    "editor-only": <Code2 className="w-[18px] h-[18px]" />,
    "preview-only": <LayoutPanelLeft className="w-[18px] h-[18px]" />,
  };

  const layoutLabels: Record<LayoutMode, string> = {
    "split-horizontal": "Split Horizontal",
    "split-vertical": "Split Vertical",
    "editor-only": "Editor Only",
    "preview-only": "Preview Only",
  };

  const cycleLayout = useCallback(() => {
    const currentIndex = LAYOUT_ORDER.indexOf(layoutMode);
    const nextIndex = (currentIndex + 1) % LAYOUT_ORDER.length;
    setLayoutMode(LAYOUT_ORDER[nextIndex]);
  }, [layoutMode, setLayoutMode]);

  const toggleViewMode = useCallback(() => {
    setViewMode(viewMode === "tree" ? "formatted" : "tree");
  }, [viewMode, setViewMode]);

  const cycleIndent = useCallback(() => {
    const newIndent = indent === 2 ? "tab" : 2;

    setIndent(newIndent);

    // Also format the JSON with the new indent
    if (rawJson) {
      try {
        const formatted = formatJson(rawJson, { indent: newIndent });
        setJson(formatted, fileName);
      } catch {
        // Invalid JSON, just update the preference
      }
    }
  }, [indent, setIndent, rawJson, setJson, fileName]);

  const indentLabel = indent === "tab" ? "Tab" : `${indent} spaces`;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-1.5 border-b border-[var(--border)] bg-[var(--bg-surface)]",
        className
      )}
    >
      <div className="flex items-center gap-1">
        {/* Format controls */}
        <Tooltip content="Format JSON (Cmd+E)" side="bottom" align="start">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            disabled={!rawJson}
          >
            <AlignLeft className="w-[18px] h-[18px]" />
          </Button>
        </Tooltip>

        <Tooltip content="Minify JSON (Cmd+M)" side="bottom">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinify}
            disabled={!rawJson}
          >
            <Minimize2 className="w-[18px] h-[18px]" />
          </Button>
        </Tooltip>

        <Tooltip content="Sort keys alphabetically" side="bottom">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSortKeys}
            disabled={!rawJson}
          >
            <ArrowDownAZ className="w-[18px] h-[18px]" />
          </Button>
        </Tooltip>

        <Tooltip content="Repair JSON (Cmd+D)" side="bottom">
          <Button
            variant="ghost"
            size="sm"
            onClick={repairCurrentJson}
            disabled={!rawJson || !parseError}
          >
            <Wrench className="w-[18px] h-[18px]" />
          </Button>
        </Tooltip>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* Indent selector */}
        <Tooltip content="Toggle indent (2 spaces / Tab)" side="bottom">
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleIndent}
            className="text-[15px] min-w-[75px]"
          >
            {indentLabel}
          </Button>
        </Tooltip>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* Word wrap toggle */}
        <Tooltip content={wordWrap ? "Disable word wrap" : "Enable word wrap"} side="bottom">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWordWrap(!wordWrap)}
            className={wordWrap ? "text-[var(--accent)]" : ""}
          >
            <WrapText className="w-[18px] h-[18px]" />
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-1">
        {/* View mode toggle */}
        <Tooltip
          content={viewMode === "tree" ? "Switch to Formatted View" : "Switch to Tree View"}
          side="bottom"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleViewMode}
            className="gap-1.5"
          >
            {viewMode === "tree" ? (
              <>
                <TreePine className="w-[18px] h-[18px]" />
                <span className="text-[15px] hidden sm:inline">Tree</span>
              </>
            ) : (
              <>
                <FileJson2 className="w-[18px] h-[18px]" />
                <span className="text-[15px] hidden sm:inline">Formatted</span>
              </>
            )}
          </Button>
        </Tooltip>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* Layout mode */}
        <Tooltip content={`Layout: ${layoutLabels[layoutMode]}`} side="bottom">
          <Button variant="ghost" size="sm" onClick={cycleLayout}>
            {layoutIcons[layoutMode]}
          </Button>
        </Tooltip>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* Copy */}
        <Tooltip content={copied ? "Copied!" : "Copy JSON"} side="bottom" align="end">
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!rawJson}>
            {copied ? (
              <Check className="w-[18px] h-[18px] text-[var(--success)]" />
            ) : (
              <Copy className="w-[18px] h-[18px]" />
            )}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
