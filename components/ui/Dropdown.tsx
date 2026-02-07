"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export function Dropdown({ trigger, children, align = "left" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={cn(
            "absolute z-[100] mt-1 min-w-[180px]",
            "bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md shadow-lg",
            "py-1",
            {
              "left-0": align === "left",
              "right-0": align === "right",
            }
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  shortcut?: string;
}

export function DropdownItem({
  children,
  onClick,
  icon,
  shortcut,
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left",
        "text-[var(--fg-primary)] hover:bg-[var(--bg-hover)]",
        "transition-colors duration-100"
      )}
    >
      {icon && <span className="w-4 h-4 opacity-70">{icon}</span>}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="text-xs text-[var(--fg-muted)] font-mono">
          {shortcut}
        </span>
      )}
    </button>
  );
}

interface DropdownSeparatorProps {}

export function DropdownSeparator({}: DropdownSeparatorProps) {
  return <div className="h-px bg-[var(--border)] my-1" />;
}
