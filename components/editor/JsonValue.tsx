"use client";

import { cn } from "@/lib/utils/cn";
import type { JsonValue as JsonValueType, JsonValueType as ValueType } from "@/types";
import { getValueType } from "@/lib/utils/json-utils";

interface JsonValueProps {
  value: JsonValueType;
  className?: string;
}

export function JsonValue({ value, className }: JsonValueProps) {
  const type = getValueType(value);

  const colorClass = {
    string: "text-[var(--type-string)]",
    number: "text-[var(--type-number)]",
    boolean: "text-[var(--type-boolean)]",
    null: "text-[var(--type-null)]",
    object: "text-[var(--fg-muted)]",
    array: "text-[var(--fg-muted)]",
  }[type];

  const formatValue = (): string => {
    switch (type) {
      case "string":
        const str = value as string;
        const maxLen = 100;
        const display = str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
        return `"${display}"`;
      case "number":
        return String(value);
      case "boolean":
        return String(value);
      case "null":
        return "null";
      case "object":
        const keys = Object.keys(value as object);
        return `{${keys.length}}`;
      case "array":
        return `[${(value as unknown[]).length}]`;
    }
  };

  return (
    <span className={cn("font-mono", colorClass, className)}>
      {formatValue()}
    </span>
  );
}
