"use client";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { Sparkles, Check, X } from "lucide-react";

interface RepairBannerProps {
  onApply: () => void;
  onDismiss: () => void;
  className?: string;
}

export function RepairBanner({
  onApply,
  onDismiss,
  className,
}: RepairBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2 text-sm",
        "bg-[var(--accent)]/10 border-b border-[var(--accent)]/20",
        className
      )}
    >
      <div className="flex items-center gap-2 text-[var(--fg-secondary)]">
        <Sparkles className="w-4 h-4 text-[var(--accent)]" />
        <span>JSON was automatically repaired</span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onApply}
          className="text-[var(--accent)] hover:text-[var(--accent)] gap-1"
        >
          <Check className="w-4 h-4" />
          Apply
        </Button>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
