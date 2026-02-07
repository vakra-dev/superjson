"use client";

import { cn } from "@/lib/utils/cn";

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-[1.5rem] h-5 px-1.5",
        "text-xs font-mono font-medium",
        "bg-[var(--bg-elevated)] text-[var(--fg-secondary)]",
        "border border-[var(--border)] rounded",
        "shadow-sm",
        className
      )}
    >
      {children}
    </kbd>
  );
}
