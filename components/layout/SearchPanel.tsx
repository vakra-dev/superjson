"use client";

import { useRef, useEffect } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { useEditorStore } from "@/stores/editor";
import { cn } from "@/lib/utils/cn";

export function SearchPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    showSearch,
    searchQuery,
    searchResults,
    searchIndex,
    search,
    nextSearchResult,
    prevSearchResult,
    setShowSearch,
  } = useEditorStore();

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  if (!showSearch) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        prevSearchResult();
      } else {
        nextSearchResult();
      }
    } else if (e.key === "Escape") {
      setShowSearch(false);
    }
  };

  return (
    <div className="absolute top-0 right-0 z-30 m-4">
      <div className="flex items-center gap-2 p-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg shadow-lg">
        <Search className="w-4 h-4 text-[var(--fg-muted)]" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => search(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="w-48 bg-transparent text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)] focus:outline-none"
        />

        {searchResults.length > 0 && (
          <span className="text-xs text-[var(--fg-muted)] tabular-nums">
            {searchIndex + 1}/{searchResults.length}
          </span>
        )}

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSearchResult}
            disabled={searchResults.length === 0}
            className="p-1"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextSearchResult}
            disabled={searchResults.length === 0}
            className="p-1"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSearch(false)}
          className="p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
