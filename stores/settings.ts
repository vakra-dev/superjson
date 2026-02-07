import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CopyFormat } from "@/types";
import type { IndentType } from "@/lib/json-format";

interface SettingsState {
  // Appearance
  fontSize: number;
  indent: IndentType;

  // Behavior
  defaultExpandDepth: number;
  copyFormat: CopyFormat;

  // Actions
  setFontSize: (size: number) => void;
  setIndent: (indent: IndentType) => void;
  setDefaultExpandDepth: (depth: number) => void;
  setCopyFormat: (format: CopyFormat) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontSize: 14,
      indent: 2,
      defaultExpandDepth: 2,
      copyFormat: "jsonpath",

      setFontSize: (size: number) => {
        set({ fontSize: Math.min(Math.max(size, 10), 20) });
      },

      setIndent: (indent: IndentType) => {
        set({ indent });
      },

      setDefaultExpandDepth: (depth: number) => {
        set({ defaultExpandDepth: Math.min(Math.max(depth, 0), 10) });
      },

      setCopyFormat: (format: CopyFormat) => {
        set({ copyFormat: format });
      },
    }),
    {
      name: "superjson-settings",
    }
  )
);
