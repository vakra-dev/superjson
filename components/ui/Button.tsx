"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1 focus:ring-offset-[var(--bg-base)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-[var(--accent)] text-[var(--bg-base)] hover:bg-[var(--accent-dim)]":
              variant === "primary",
            "bg-[var(--bg-elevated)] text-[var(--fg-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border)]":
              variant === "secondary",
            "text-[var(--fg-primary)] hover:bg-[var(--bg-hover)]":
              variant === "ghost",
          },
          {
            "text-xs px-2 py-1 rounded": size === "sm",
            "text-sm px-3 py-1.5 rounded-md": size === "md",
            "text-base px-4 py-2 rounded-md": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
