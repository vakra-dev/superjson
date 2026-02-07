"use client";

import { useState, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delay?: number;
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delay = 300,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const getAlignmentClasses = () => {
    if (side === "left" || side === "right") {
      // Vertical alignment for left/right positioned tooltips
      switch (align) {
        case "start": return "top-0";
        case "end": return "bottom-0";
        default: return "top-1/2 -translate-y-1/2";
      }
    }
    // Horizontal alignment for top/bottom positioned tooltips
    switch (align) {
      case "start": return "left-0";
      case "end": return "right-0";
      default: return "left-1/2 -translate-x-1/2";
    }
  };

  const getSideClasses = () => {
    switch (side) {
      case "top": return "bottom-full mb-1";
      case "bottom": return "top-full mt-1";
      case "left": return "right-full mr-1";
      case "right": return "left-full ml-1";
    }
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs font-medium whitespace-nowrap pointer-events-none",
            "bg-[var(--bg-elevated)] text-[var(--fg-primary)]",
            "border border-[var(--border)] rounded shadow-lg",
            getSideClasses(),
            getAlignmentClasses()
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
