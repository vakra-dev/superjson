"use client";

import { useEditorStore } from "@/stores/editor";
import { formatBytes } from "@/lib/utils/json-utils";

export function StatusBar() {
  const { parsedJson, parseError, stats } = useEditorStore();

  const isValid = parsedJson !== null;

  return (
    <div className="h-8 flex items-center px-4 border-t border-[var(--border)] bg-[var(--bg-surface)] text-[15px]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {isValid ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
              <span className="text-[var(--fg-primary)]">Valid JSON</span>
            </>
          ) : parseError ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[var(--error)]" />
              <span className="text-[var(--error)]">Invalid JSON</span>
            </>
          ) : (
            <span className="text-[var(--fg-primary)]">No JSON loaded</span>
          )}
        </div>

        {stats && (
          <>
            <span className="text-[var(--fg-secondary)]">·</span>
            <span className="text-[var(--fg-primary)]">
              {formatBytes(stats.bytes)}
            </span>
            <span className="text-[var(--fg-secondary)]">·</span>
            <span className="text-[var(--fg-primary)]">
              {stats.lines} lines
            </span>
            <span className="text-[var(--fg-secondary)]">·</span>
            <span className="text-[var(--fg-primary)]">
              {stats.nodeCount} nodes
            </span>
          </>
        )}
      </div>
    </div>
  );
}
