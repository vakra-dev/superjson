export interface Theme {
  id: string;
  name: string;
  type: "dark" | "light";
  colors: {
    // Backgrounds
    bgBase: string;
    bgSurface: string;
    bgElevated: string;
    bgHover: string;

    // Foreground
    fgPrimary: string;
    fgSecondary: string;
    fgMuted: string;

    // Accent
    accent: string;
    accentDim: string;

    // JSON Syntax
    typeString: string;
    typeNumber: string;
    typeBoolean: string;
    typeNull: string;
    typeKey: string;

    // Borders
    border: string;
    borderFocus: string;

    // Status
    success: string;
    warning: string;
    error: string;
  };
}

// ============================================================================
// DARK THEMES
// ============================================================================

export const moonlight: Theme = {
  id: "moonlight",
  name: "Moonlight",
  type: "dark",
  colors: {
    bgBase: "#1a1b26",
    bgSurface: "#1f2335",
    bgElevated: "#292e42",
    bgHover: "#33384d",
    fgPrimary: "#c0caf5",
    fgSecondary: "#9aa5ce",
    fgMuted: "#565f89",
    accent: "#7dcfff",
    accentDim: "#5eadd4",
    typeString: "#9ece6a",
    typeNumber: "#ff9e64",
    typeBoolean: "#bb9af7",
    typeNull: "#565f89",
    typeKey: "#7aa2f7",
    border: "#292e42",
    borderFocus: "#7dcfff",
    success: "#9ece6a",
    warning: "#e0af68",
    error: "#f7768e",
  },
};

export const rosePine: Theme = {
  id: "rose-pine",
  name: "Rosé Pine",
  type: "dark",
  colors: {
    bgBase: "#191724",
    bgSurface: "#1f1d2e",
    bgElevated: "#26233a",
    bgHover: "#2a2837",
    fgPrimary: "#e0def4",
    fgSecondary: "#908caa",
    fgMuted: "#6e6a86",
    accent: "#ebbcba",
    accentDim: "#d4a5a4",
    typeString: "#f6c177",
    typeNumber: "#ebbcba",
    typeBoolean: "#c4a7e7",
    typeNull: "#6e6a86",
    typeKey: "#9ccfd8",
    border: "#26233a",
    borderFocus: "#ebbcba",
    success: "#9ccfd8",
    warning: "#f6c177",
    error: "#eb6f92",
  },
};

export const ember: Theme = {
  id: "ember",
  name: "Ember",
  type: "dark",
  colors: {
    bgBase: "#1d2021",
    bgSurface: "#282828",
    bgElevated: "#32302f",
    bgHover: "#3c3836",
    fgPrimary: "#ebdbb2",
    fgSecondary: "#bdae93",
    fgMuted: "#7c6f64",
    accent: "#fe8019",
    accentDim: "#d65d0e",
    typeString: "#b8bb26",
    typeNumber: "#fabd2f",
    typeBoolean: "#d3869b",
    typeNull: "#7c6f64",
    typeKey: "#83a598",
    border: "#3c3836",
    borderFocus: "#fe8019",
    success: "#b8bb26",
    warning: "#fabd2f",
    error: "#fb4934",
  },
};

export const glacier: Theme = {
  id: "glacier",
  name: "Glacier",
  type: "dark",
  colors: {
    bgBase: "#2e3440",
    bgSurface: "#3b4252",
    bgElevated: "#434c5e",
    bgHover: "#4c566a",
    fgPrimary: "#eceff4",
    fgSecondary: "#d8dee9",
    fgMuted: "#677690",
    accent: "#88c0d0",
    accentDim: "#6ba8b8",
    typeString: "#a3be8c",
    typeNumber: "#ebcb8b",
    typeBoolean: "#b48ead",
    typeNull: "#677690",
    typeKey: "#81a1c1",
    border: "#434c5e",
    borderFocus: "#88c0d0",
    success: "#a3be8c",
    warning: "#ebcb8b",
    error: "#bf616a",
  },
};

export const moss: Theme = {
  id: "moss",
  name: "Moss",
  type: "dark",
  colors: {
    bgBase: "#1a1f1d",
    bgSurface: "#212826",
    bgElevated: "#2a322f",
    bgHover: "#343d3a",
    fgPrimary: "#d4dbd8",
    fgSecondary: "#a3b0ab",
    fgMuted: "#6b7d76",
    accent: "#7fb685",
    accentDim: "#5f9466",
    typeString: "#98c379",
    typeNumber: "#e0c285",
    typeBoolean: "#c9a0dc",
    typeNull: "#6b7d76",
    typeKey: "#89bfdc",
    border: "#2a322f",
    borderFocus: "#7fb685",
    success: "#7fb685",
    warning: "#e0c285",
    error: "#e06c75",
  },
};

export const lavender: Theme = {
  id: "lavender",
  name: "Lavender",
  type: "dark",
  colors: {
    bgBase: "#1e1e2e",
    bgSurface: "#24243b",
    bgElevated: "#313147",
    bgHover: "#3b3b52",
    fgPrimary: "#cdd6f4",
    fgSecondary: "#a6adc8",
    fgMuted: "#6c7086",
    accent: "#cba6f7",
    accentDim: "#a88bd4",
    typeString: "#a6e3a1",
    typeNumber: "#fab387",
    typeBoolean: "#f5c2e7",
    typeNull: "#6c7086",
    typeKey: "#89dceb",
    border: "#313147",
    borderFocus: "#cba6f7",
    success: "#a6e3a1",
    warning: "#f9e2af",
    error: "#f38ba8",
  },
};

export const midnight: Theme = {
  id: "midnight",
  name: "Midnight",
  type: "dark",
  colors: {
    bgBase: "#151820",
    bgSurface: "#1c1f2b",
    bgElevated: "#252836",
    bgHover: "#2e3241",
    fgPrimary: "#e2e4e9",
    fgSecondary: "#a8adb8",
    fgMuted: "#5c6370",
    accent: "#61afef",
    accentDim: "#4d8bc4",
    typeString: "#98c379",
    typeNumber: "#d19a66",
    typeBoolean: "#c678dd",
    typeNull: "#5c6370",
    typeKey: "#56b6c2",
    border: "#2e3241",
    borderFocus: "#61afef",
    success: "#98c379",
    warning: "#e5c07b",
    error: "#e06c75",
  },
};

// ============================================================================
// LIGHT THEMES
// ============================================================================

// Paper theme - used for landing page, also available in editor
export const paper: Theme = {
  id: "paper",
  name: "Paper",
  type: "light",
  colors: {
    bgBase: "#f8f5f0",
    bgSurface: "#ffffff",
    bgElevated: "#f0ebe4",
    bgHover: "#e8e2d9",
    fgPrimary: "#3b3228",
    fgSecondary: "#6b5d4d",
    fgMuted: "#a89f91",
    accent: "#c35b35",
    accentDim: "#9a4829",
    typeString: "#448c27",
    typeNumber: "#b86330",
    typeBoolean: "#8959a8",
    typeNull: "#a89f91",
    typeKey: "#2e6fa3",
    border: "#e0d8cc",
    borderFocus: "#c35b35",
    success: "#448c27",
    warning: "#b86330",
    error: "#c33535",
  },
};

export const cloud: Theme = {
  id: "cloud",
  name: "Cloud",
  type: "light",
  colors: {
    bgBase: "#f5f5f5",
    bgSurface: "#ffffff",
    bgElevated: "#ebebeb",
    bgHover: "#e0e0e0",
    fgPrimary: "#2c2c2c",
    fgSecondary: "#5a5a5a",
    fgMuted: "#9e9e9e",
    accent: "#0066cc",
    accentDim: "#0052a3",
    typeString: "#2e7d32",
    typeNumber: "#d84315",
    typeBoolean: "#7b1fa2",
    typeNull: "#9e9e9e",
    typeKey: "#1565c0",
    border: "#e0e0e0",
    borderFocus: "#0066cc",
    success: "#2e7d32",
    warning: "#f57c00",
    error: "#d32f2f",
  },
};

export const dawn: Theme = {
  id: "dawn",
  name: "Dawn",
  type: "light",
  colors: {
    bgBase: "#faf4ed",
    bgSurface: "#fffaf3",
    bgElevated: "#f2e9de",
    bgHover: "#e4d8c8",
    fgPrimary: "#575279",
    fgSecondary: "#797593",
    fgMuted: "#9893a5",
    accent: "#d7827e",
    accentDim: "#b4637a",
    typeString: "#ea9d34",
    typeNumber: "#d7827e",
    typeBoolean: "#907aa9",
    typeNull: "#9893a5",
    typeKey: "#56949f",
    border: "#dfdad0",
    borderFocus: "#d7827e",
    success: "#56949f",
    warning: "#ea9d34",
    error: "#b4637a",
  },
};

export const frost: Theme = {
  id: "frost",
  name: "Frost",
  type: "light",
  colors: {
    bgBase: "#f0f4f8",
    bgSurface: "#ffffff",
    bgElevated: "#e3eaf2",
    bgHover: "#d6e1eb",
    fgPrimary: "#2e3440",
    fgSecondary: "#4c566a",
    fgMuted: "#8892a2",
    accent: "#5e81ac",
    accentDim: "#4a6d94",
    typeString: "#689d6a",
    typeNumber: "#bf616a",
    typeBoolean: "#a3688f",
    typeNull: "#8892a2",
    typeKey: "#5e81ac",
    border: "#d8dfe7",
    borderFocus: "#5e81ac",
    success: "#689d6a",
    warning: "#d08770",
    error: "#bf616a",
  },
};

export const sand: Theme = {
  id: "sand",
  name: "Sand",
  type: "light",
  colors: {
    bgBase: "#f5f2e9",
    bgSurface: "#fdfcf8",
    bgElevated: "#ebe7db",
    bgHover: "#dfd9c9",
    fgPrimary: "#433f34",
    fgSecondary: "#6b6558",
    fgMuted: "#a09a8c",
    accent: "#8f6c3d",
    accentDim: "#725530",
    typeString: "#5c7a38",
    typeNumber: "#b07040",
    typeBoolean: "#906090",
    typeNull: "#a09a8c",
    typeKey: "#4078a0",
    border: "#ddd8c8",
    borderFocus: "#8f6c3d",
    success: "#5c7a38",
    warning: "#b07040",
    error: "#c04040",
  },
};

export const mint: Theme = {
  id: "mint",
  name: "Mint",
  type: "light",
  colors: {
    bgBase: "#f2f7f5",
    bgSurface: "#ffffff",
    bgElevated: "#e5efeb",
    bgHover: "#d8e6e0",
    fgPrimary: "#2d3a36",
    fgSecondary: "#4d5c56",
    fgMuted: "#8a9a94",
    accent: "#3d9970",
    accentDim: "#2e7a58",
    typeString: "#3d9970",
    typeNumber: "#d68c4a",
    typeBoolean: "#8866aa",
    typeNull: "#8a9a94",
    typeKey: "#4488aa",
    border: "#d4e4dc",
    borderFocus: "#3d9970",
    success: "#3d9970",
    warning: "#d68c4a",
    error: "#cc5555",
  },
};

// ============================================================================
// THEME COLLECTIONS
// ============================================================================

export const defaultTheme = paper;

// All themes available in the editor
export const allThemes: Theme[] = [
  // Dark themes
  moonlight,
  rosePine,
  ember,
  glacier,
  moss,
  lavender,
  midnight,
  // Light themes
  paper,
  cloud,
  dawn,
  frost,
  sand,
  mint,
];

export const darkThemes: Theme[] = allThemes.filter((t) => t.type === "dark");
export const lightThemes: Theme[] = allThemes.filter((t) => t.type === "light");

export const themeMap: Record<string, Theme> = Object.fromEntries(
  allThemes.map((theme) => [theme.id, theme])
);

// Theme pairs for toggle functionality (dark <-> light)
const themePairs: Record<string, string> = {
  // Dark -> Light
  moonlight: "cloud",
  "rose-pine": "dawn",
  ember: "sand",
  glacier: "frost",
  moss: "mint",
  lavender: "cloud",
  midnight: "cloud",
  // Light -> Dark
  paper: "ember",
  cloud: "moonlight",
  dawn: "rose-pine",
  frost: "glacier",
  sand: "ember",
  mint: "moss",
};

export function getThemeById(id: string): Theme {
  return themeMap[id] || defaultTheme;
}

export function getOppositeTheme(themeId: string): Theme {
  const pairedId = themePairs[themeId];
  return pairedId ? getThemeById(pairedId) : defaultTheme;
}

export function getThemeCssVars(theme: Theme): Record<string, string> {
  return {
    "--bg-base": theme.colors.bgBase,
    "--bg-surface": theme.colors.bgSurface,
    "--bg-elevated": theme.colors.bgElevated,
    "--bg-hover": theme.colors.bgHover,
    "--fg-primary": theme.colors.fgPrimary,
    "--fg-secondary": theme.colors.fgSecondary,
    "--fg-muted": theme.colors.fgMuted,
    "--accent": theme.colors.accent,
    "--accent-dim": theme.colors.accentDim,
    "--type-string": theme.colors.typeString,
    "--type-number": theme.colors.typeNumber,
    "--type-boolean": theme.colors.typeBoolean,
    "--type-null": theme.colors.typeNull,
    "--type-key": theme.colors.typeKey,
    "--border": theme.colors.border,
    "--border-focus": theme.colors.borderFocus,
    "--success": theme.colors.success,
    "--warning": theme.colors.warning,
    "--error": theme.colors.error,
  };
}
