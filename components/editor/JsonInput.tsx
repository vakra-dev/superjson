"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Link, FileJson, Clipboard, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogHeader, DialogContent } from "@/components/ui/Dialog";
import { useEditorStore } from "@/stores/editor";
import { cn } from "@/lib/utils/cn";

interface JsonInputProps {
  onUrlImport?: (url: string) => Promise<void>;
}

export function JsonInput({ onUrlImport }: JsonInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textValue, setTextValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { setJson, parsedJson } = useEditorStore();

  const processJson = useCallback(
    (text: string, fileName: string = "pasted.json") => {
      setError(null);
      const trimmed = text.trim();
      if (!trimmed) {
        setError("Please enter some JSON");
        return false;
      }
      try {
        JSON.parse(trimmed);
        setJson(trimmed, fileName);
        return true;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Invalid JSON";
        setError(message);
        return false;
      }
    },
    [setJson]
  );

  // Listen for global paste events
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Only handle if not focused on an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" && target !== textareaRef.current) return;

      const text = e.clipboardData?.getData("text");
      if (text) {
        e.preventDefault();
        setTextValue(text);
        processJson(text);
      }
    };

    document.addEventListener("paste", handleGlobalPaste);
    return () => document.removeEventListener("paste", handleGlobalPaste);
  }, [processJson]);

  const handleFileDrop = useCallback(
    async (file: File) => {
      setError(null);
      const text = await file.text();
      processJson(text, file.name);
    },
    [processJson]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // Check for JSON text in clipboard
    const text = e.dataTransfer.getData("text");
    if (text) {
      setTextValue(text);
      processJson(text);
      return;
    }

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileDrop(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileDrop(file);
    }
  };

  const handleUrlSubmit = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (onUrlImport) {
        await onUrlImport(url);
      } else {
        const response = await fetch(url);
        const text = await response.text();
        JSON.parse(text);
        setJson(text, url.split("/").pop() || "fetched.json");
      }
      setShowUrlDialog(false);
      setUrl("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTextValue(text);
      processJson(text);
    } catch {
      setError("Failed to read clipboard. Try pasting directly into the text area.");
    }
  };

  const handleLoadJson = () => {
    processJson(textValue);
  };

  const handleTextareaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    if (text) {
      e.preventDefault();
      setTextValue(text);
      // Auto-submit on paste
      setTimeout(() => processJson(text), 0);
    }
  };

  // If JSON is already loaded, don't show the input
  if (parsedJson) return null;

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "w-full max-w-2xl p-8 rounded-xl border-2 border-dashed transition-colors",
          isDragging
            ? "border-[var(--accent)] bg-[var(--accent)]/5"
            : "border-[var(--border)] hover:border-[var(--fg-muted)]"
        )}
      >
        <div className="text-center mb-6">
          <FileJson className="w-12 h-12 mx-auto mb-4 text-[var(--fg-muted)]" />
          <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">
            Drop JSON here
          </h2>
          <p className="text-[15px] text-[var(--fg-muted)]">
            or paste JSON, upload a file, or import from URL
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[var(--error)]/10 text-[var(--error)] text-[15px] text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="secondary" onClick={handlePasteFromClipboard}>
            <Clipboard className="w-4 h-4 mr-2" />
            Paste JSON
          </Button>

          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>

          <Button variant="secondary" onClick={() => setShowUrlDialog(true)}>
            <Link className="w-4 h-4 mr-2" />
            Import URL
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <textarea
            ref={textareaRef}
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              setError(null);
            }}
            onPaste={handleTextareaPaste}
            placeholder="Or paste/type JSON directly here..."
            className={cn(
              "w-full h-40 p-4 rounded-lg font-mono text-[15px] resize-none",
              "bg-[var(--bg-surface)] text-[var(--fg-primary)]",
              "border border-[var(--border)] focus:border-[var(--border-focus)]",
              "placeholder:text-[var(--fg-muted)]",
              "focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
            )}
          />
          <div className="mt-3 flex justify-end">
            <Button
              variant="primary"
              onClick={handleLoadJson}
              disabled={!textValue.trim()}
            >
              <Play className="w-4 h-4 mr-2" />
              Load JSON
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showUrlDialog} onClose={() => setShowUrlDialog(false)}>
        <DialogHeader onClose={() => setShowUrlDialog(false)}>
          Import from URL
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/data.json"
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            />
            {error && (
              <p className="text-[15px] text-[var(--error)]">{error}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowUrlDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUrlSubmit}
                disabled={isLoading || !url.trim()}
              >
                {isLoading ? "Loading..." : "Import"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
