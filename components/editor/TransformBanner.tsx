"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { Wand2, ChevronDown, ChevronUp, X, Check } from "lucide-react";
import type { TransformChange } from "@/lib/json-transform";

interface TransformBannerProps {
  changes: TransformChange[];
  onApply: () => void;
  onDismiss: () => void;
  className?: string;
}

export function TransformBanner({
  changes,
  onApply,
  onDismiss,
  className,
}: TransformBannerProps) {
  const [expanded, setExpanded] = useState(false);

  if (changes.length === 0) return null;

  const changeDescriptions: Record<TransformChange["type"], string> = {
    keys: "Quoted unquoted keys",
    quotes: "Converted single quotes to double quotes",
    commas: "Removed trailing commas",
    comments: "Removed comments",
    undefined: "Converted undefined to null",
    nan: "Converted NaN to null",
    infinity: "Converted Infinity to null",
  };

  return (
    <div
      className={cn(
        "bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-md overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-sm text-[var(--fg-primary)]">
            {changes.length} fix{changes.length > 1 ? "es" : ""} available
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-5 px-1"
          >
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onApply}
            className="text-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Check className="w-4 h-4 mr-1" />
            Apply
          </Button>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-2 space-y-1">
          {changes.map((change, index) => (
            <div
              key={index}
              className="text-xs text-[var(--fg-secondary)] flex items-center gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
              {changeDescriptions[change.type]}
              {change.count > 1 && (
                <span className="text-[var(--fg-muted)]">
                  ({change.count} occurrences)
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
