"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme";
import { getThemeCssVars } from "@/lib/themes";

export function useTheme() {
  const { theme, themeId, setTheme, toggleDarkLight } = useThemeStore();

  useEffect(() => {
    const cssVars = getThemeCssVars(theme);
    const root = document.documentElement;

    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Set color-scheme for native elements
    root.style.setProperty("color-scheme", theme.type);
  }, [theme]);

  return { theme, themeId, setTheme, toggleDarkLight };
}
