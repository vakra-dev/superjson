"use client";

import { Dialog, DialogHeader, DialogContent } from "@/components/ui/Dialog";
import { cn } from "@/lib/utils/cn";
import { useThemeStore } from "@/stores/theme";
import { darkThemes, lightThemes, type Theme } from "@/lib/themes";
import { Check, Moon, Sun } from "lucide-react";

interface ThemePickerProps {
  open: boolean;
  onClose: () => void;
}

function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative p-3 rounded-lg border text-left transition-all",
        "hover:scale-[1.02]",
        isSelected
          ? "border-[var(--accent)] ring-1 ring-[var(--accent)]"
          : "border-[var(--border)] hover:border-[var(--fg-muted)]"
      )}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
          <Check className="w-3 h-3 text-[var(--bg-base)]" />
        </div>
      )}

      {/* Theme preview */}
      <div
        className="h-16 rounded mb-2 overflow-hidden border"
        style={{
          backgroundColor: theme.colors.bgBase,
          borderColor: theme.colors.border,
        }}
      >
        <div
          className="h-full p-2 font-mono text-[10px] leading-tight"
          style={{ color: theme.colors.fgPrimary }}
        >
          <span style={{ color: theme.colors.typeKey }}>{"{"}</span>
          <br />
          <span className="ml-2">
            <span style={{ color: theme.colors.typeKey }}>"name"</span>
            <span style={{ color: theme.colors.fgMuted }}>: </span>
            <span style={{ color: theme.colors.typeString }}>"json"</span>
          </span>
          <br />
          <span style={{ color: theme.colors.typeKey }}>{"}"}</span>
        </div>
      </div>

      <div className="font-medium text-sm text-[var(--fg-primary)]">
        {theme.name}
      </div>
    </button>
  );
}

export function ThemePicker({ open, onClose }: ThemePickerProps) {
  const { themeId, setTheme } = useThemeStore();

  const handleSelectTheme = (theme: Theme) => {
    setTheme(theme.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="max-w-lg">
      <DialogHeader onClose={onClose}>Choose Theme</DialogHeader>
      <DialogContent className="p-0">
        <div className="max-h-[450px] overflow-y-auto">
          {/* Dark themes */}
          <div className="p-4 pb-2">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[var(--fg-muted)]">
              <Moon className="w-4 h-4" />
              Dark Themes
            </div>
            <div className="grid grid-cols-2 gap-3">
              {darkThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={theme.id === themeId}
                  onSelect={() => handleSelectTheme(theme)}
                />
              ))}
            </div>
          </div>

          {/* Light themes */}
          <div className="p-4 pt-2">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[var(--fg-muted)]">
              <Sun className="w-4 h-4" />
              Light Themes
            </div>
            <div className="grid grid-cols-2 gap-3">
              {lightThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={theme.id === themeId}
                  onSelect={() => handleSelectTheme(theme)}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
