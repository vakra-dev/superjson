"use client";

import { useState } from "react";
import { Palette, Upload, Link, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { Kbd } from "@/components/ui/Kbd";
import { ThemePicker } from "./ThemePicker";
import { useEditorStore } from "@/stores/editor";
import { useThemeStore } from "@/stores/theme";
import { createShare } from "@/lib/utils/share";

interface HeaderProps {
  onImportFile?: () => void;
  onImportUrl?: () => void;
}

export function Header({ onImportFile, onImportUrl }: HeaderProps) {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copying" | "copied" | "error">("idle");

  const { fileName, rawJson, parsedJson } = useEditorStore();
  const { theme } = useThemeStore();

  const handleShare = async () => {
    if (!rawJson) return;

    setShareStatus("copying");
    const baseUrl = window.location.origin;
    const result = await createShare(rawJson, baseUrl, fileName);

    if ("error" in result) {
      setShareStatus("error");
      alert(result.error);
      setTimeout(() => setShareStatus("idle"), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(result.url);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch {
      // Fallback: show the URL
      prompt("Copy this share URL:", result.url);
      setShareStatus("idle");
    }
  };

  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-[var(--border)] bg-[var(--bg-surface)]/80 backdrop-blur-sm sticky top-[40px] z-40">
      <div className="flex items-center gap-3">
        <span className="text-[15px] font-mono font-medium">
          <span className="text-[var(--accent)]">{"{ "}</span>
          <span className="text-[var(--fg-primary)]">"super"</span>
          <span className="text-[var(--fg-secondary)]">: </span>
          <span className="text-[var(--fg-primary)]">"json"</span>
          <span className="text-[var(--accent)]">{" }"}</span>
        </span>

        {fileName && (
          <span className="text-[15px] text-[var(--fg-secondary)] truncate max-w-[200px]">
            {fileName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content="Import file" side="bottom">
          <Button variant="ghost" size="sm" onClick={onImportFile}>
            <Upload className="w-[18px] h-[18px]" />
          </Button>
        </Tooltip>

        <Tooltip content="Import from URL" side="bottom">
          <Button variant="ghost" size="sm" onClick={onImportUrl}>
            <Link className="w-[18px] h-[18px]" />
          </Button>
        </Tooltip>

        {parsedJson && (
          <Tooltip
            content={
              shareStatus === "copied" ? "Copied!" :
              shareStatus === "copying" ? "Creating link..." :
              shareStatus === "error" ? "Failed" : "Share"
            }
            side="bottom"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={shareStatus === "copying"}
            >
              <Share2
                className={`w-[18px] h-[18px] ${
                  shareStatus === "copied" ? "text-[var(--success)]" :
                  shareStatus === "error" ? "text-[var(--error)]" :
                  shareStatus === "copying" ? "animate-pulse" : ""
                }`}
              />
            </Button>
          </Tooltip>
        )}

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <Tooltip
          content={
            <span className="flex items-center gap-2">
              Theme <Kbd>T</Kbd>
            </span>
          }
          side="bottom"
          align="end"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThemePicker(true)}
            className="gap-2"
          >
            <Palette className="w-[18px] h-[18px]" />
            <span className="text-[15px] text-[var(--fg-primary)] hidden sm:inline">{theme.name}</span>
          </Button>
        </Tooltip>
      </div>

      <ThemePicker
        open={showThemePicker}
        onClose={() => setShowThemePicker(false)}
      />
    </header>
  );
}
