import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Theme, getThemeById, getOppositeTheme, defaultTheme } from "@/lib/themes";

interface ThemeState {
  themeId: string;
  theme: Theme;
  _hasHydrated: boolean;
  setTheme: (themeId: string) => void;
  toggleDarkLight: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeId: defaultTheme.id,
      theme: defaultTheme,
      _hasHydrated: false,

      setTheme: (themeId: string) => {
        const theme = getThemeById(themeId);
        set({ themeId, theme });
      },

      toggleDarkLight: () => {
        const currentThemeId = get().themeId;
        const oppositeTheme = getOppositeTheme(currentThemeId);
        set({ themeId: oppositeTheme.id, theme: oppositeTheme });
      },

      setHasHydrated: (hydrated: boolean) => {
        set({ _hasHydrated: hydrated });
      },
    }),
    {
      name: "superjson-theme",
      partialize: (state) => ({ themeId: state.themeId }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as { themeId?: string } | undefined;
        const themeId = persisted?.themeId || currentState.themeId;
        return {
          ...currentState,
          themeId,
          theme: getThemeById(themeId),
          _hasHydrated: true,
        };
      },
    }
  )
);
