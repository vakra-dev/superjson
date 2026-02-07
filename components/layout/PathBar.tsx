"use client";

import { useState } from "react";
import { ChevronRight, Copy, Check } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { useEditorStore } from "@/stores/editor";
import { useSettingsStore } from "@/stores/settings";
import { formatPath } from "@/lib/utils/json-path";
import { copyToClipboard } from "@/lib/utils/copy";
import type { CopyFormat } from "@/types";

export function PathBar() {
  const [copied, setCopied] = useState(false);
  const { selectedPath, selectPath } = useEditorStore();
  const { copyFormat, setCopyFormat } = useSettingsStore();

  const handleCopyPath = async (format: CopyFormat) => {
    const path = formatPath(selectedPath, format);
    await copyToClipboard(path);
    setCopyFormat(format);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSegmentClick = (index: number) => {
    const newPath = selectedPath.slice(0, index + 1);
    selectPath(newPath);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[var(--border)] bg-[var(--bg-surface)] overflow-visible">
      <div className="flex items-center gap-0.5 min-w-0 overflow-x-auto scrollbar-none bg-[var(--bg-base)] px-2 py-1.5 rounded border border-[var(--border)]">
        <button
          onClick={() => selectPath([])}
          className={cn(
            "text-sm font-mono shrink-0 px-1 rounded hover:bg-[var(--bg-hover)]",
            selectedPath.length === 0
              ? "text-[var(--accent)]"
              : "text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]"
          )}
        >
          $
        </button>

        {selectedPath.map((segment, index) => (
          <div key={index} className="flex items-center shrink-0">
            <ChevronRight className="w-3.5 h-3.5 text-[var(--fg-secondary)]" />
            <button
              onClick={() => handleSegmentClick(index)}
              className={cn(
                "text-sm font-mono px-1 rounded hover:bg-[var(--bg-hover)]",
                index === selectedPath.length - 1
                  ? "text-[var(--accent)]"
                  : "text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]"
              )}
            >
              {/^\d+$/.test(segment) ? `[${segment}]` : segment}
            </button>
          </div>
        ))}
      </div>

      <Dropdown
        align="left"
        trigger={
          <Button variant="ghost" size="sm" className="gap-1 shrink-0">
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[var(--success)]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        }
      >
        <DropdownItem
          onClick={() => handleCopyPath("jsonpath")}
          shortcut={copyFormat === "jsonpath" ? "✓" : ""}
        >
          JSONPath
        </DropdownItem>
        <DropdownItem
          onClick={() => handleCopyPath("jq")}
          shortcut={copyFormat === "jq" ? "✓" : ""}
        >
          jq path
        </DropdownItem>
        <DropdownItem
          onClick={() => handleCopyPath("js")}
          shortcut={copyFormat === "js" ? "✓" : ""}
        >
          JavaScript
        </DropdownItem>
      </Dropdown>
    </div>
  );
}
