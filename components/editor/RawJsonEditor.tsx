"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useEditorStore } from "@/stores/editor";
import { Button } from "@/components/ui/Button";
import { WrapText, AlignLeft, Minimize2, Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/copy";

export function RawJsonEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [localValue, setLocalValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);

  const { rawJson, setJson, parseError, fileName } = useEditorStore();

  // Sync from store to local value
  useEffect(() => {
    setLocalValue(rawJson);
  }, [rawJson]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setLocalValue(value);
      // Debounce the store update
      setJson(value, fileName);
    },
    [setJson, fileName]
  );

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(localValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setLocalValue(formatted);
      setJson(formatted, fileName);
    } catch {
      // Invalid JSON, can't format
    }
  }, [localValue, setJson, fileName]);

  const handleMinify = useCallback(() => {
    try {
      const parsed = JSON.parse(localValue);
      const minified = JSON.stringify(parsed);
      setLocalValue(minified);
      setJson(minified, fileName);
    } catch {
      // Invalid JSON, can't minify
    }
  }, [localValue, setJson, fileName]);

  const handleCopy = useCallback(async () => {
    await copyToClipboard(localValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [localValue]);

  // Calculate line numbers
  const lineCount = localValue.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] border-r border-[var(--border)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            title="Format JSON"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinify}
            title="Minify JSON"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-[var(--border)] mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWordWrap(!wordWrap)}
            title={wordWrap ? "Disable word wrap" : "Enable word wrap"}
            className={wordWrap ? "text-[var(--accent)]" : ""}
          >
            <WrapText className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="w-4 h-4 text-[var(--success)]" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Editor area with line numbers */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line numbers */}
        <div className="flex-shrink-0 py-3 px-2 text-right select-none bg-[var(--bg-base)] border-r border-[var(--border)] overflow-hidden">
          <div className="font-mono text-[13px] leading-6 text-[var(--fg-muted)]">
            {lineNumbers.map((num) => (
              <div key={num}>{num}</div>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={localValue}
          onChange={handleChange}
          spellCheck={false}
          className={cn(
            "flex-1 p-3 font-mono text-[15px] leading-6 resize-none",
            "bg-[var(--bg-base)] text-[var(--fg-primary)]",
            "focus:outline-none",
            "placeholder:text-[var(--fg-muted)]",
            wordWrap ? "whitespace-pre-wrap break-all" : "whitespace-pre overflow-x-auto"
          )}
          placeholder="Paste or type JSON here..."
        />
      </div>

      {/* Error bar */}
      {parseError && (
        <div className="px-3 py-2 text-[13px] text-[var(--error)] bg-[var(--error)]/10 border-t border-[var(--error)]/20">
          {parseError}
        </div>
      )}
    </div>
  );
}
