const SCALE_KEYS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const buildScale = (prefix: string, hexValues: readonly string[]) => {
  return Object.fromEntries(
    SCALE_KEYS.map((scale, index) => [
      `--color-${prefix}-${scale}`,
      hexToRgbString(hexValues[index]),
    ])
  );
};

const hexToRgbString = (hexColor: string) => {
  const sanitizedHex = hexColor.replace("#", "");
  const red = Number.parseInt(sanitizedHex.slice(0, 2), 16);
  const green = Number.parseInt(sanitizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(sanitizedHex.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
};

export const STITCH_COLOR_MODE = {
  dark: "dark",
  light: "light",
} as const;

export type StitchColorMode = (typeof STITCH_COLOR_MODE)[keyof typeof STITCH_COLOR_MODE];

export const STITCH_THEME = {
  dark: {
    background: "#161220",
    border: "#3b3450",
    primary: "#c7baff",
    surface: "#211c2e",
    textMuted: "#94a3b8",
    textStrong: "#f8fafc",
  },
  light: {
    background: "#f6f6f8",
    border: "#e2e8f0",
    primary: "#3b1e8a",
    surface: "#ffffff",
    textMuted: "#64748b",
    textStrong: "#161220",
  },
} as const;

const PRIMARY_LIGHT = [
  "#f8f5ff",
  "#f3eeff",
  "#e8e0ff",
  "#d7c8ff",
  "#c7b2ff",
  "#8c6ce6",
  "#3b1e8a",
  "#311874",
  "#27125d",
  "#1d0d46",
  "#14092f",
  "#0d061f",
] as const;

const PRIMARY_DARK = [
  "#0d061f",
  "#14092f",
  "#1d0d46",
  "#27125d",
  "#3b1e8a",
  "#7f5ae6",
  "#c7baff",
  "#ddd1ff",
  "#ece5ff",
  "#f5f0ff",
  "#faf7ff",
  "#fffaff",
] as const;

const SECONDARY_LIGHT = [
  "#ffffff",
  "#f8fafc",
  "#f1f5f9",
  "#e2e8f0",
  "#cbd5e1",
  "#94a3b8",
  "#64748b",
  "#475569",
  "#334155",
  "#1e293b",
  "#0f172a",
  "#020617",
] as const;

const SECONDARY_DARK = [
  "#020617",
  "#0f172a",
  "#1e293b",
  "#334155",
  "#475569",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#e2e8f0",
  "#f1f5f9",
  "#f8fafc",
  "#ffffff",
] as const;

const TERTIARY_LIGHT = [
  "#faf7ff",
  "#f5f0ff",
  "#ece5ff",
  "#ddd1ff",
  "#c7b2ff",
  "#a786f5",
  "#7f5ae6",
  "#6742c7",
  "#5432a8",
  "#3f247e",
  "#2e1a5c",
  "#1e103b",
] as const;

const TERTIARY_DARK = [
  "#1e103b",
  "#2e1a5c",
  "#3f247e",
  "#5432a8",
  "#6742c7",
  "#7f5ae6",
  "#a786f5",
  "#c7b2ff",
  "#ddd1ff",
  "#ece5ff",
  "#f5f0ff",
  "#faf7ff",
] as const;

const ERROR_LIGHT = [
  "#fef2f2",
  "#fee2e2",
  "#fecaca",
  "#fca5a5",
  "#f87171",
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#991b1b",
  "#7f1d1d",
  "#651515",
  "#450a0a",
] as const;

const ERROR_DARK = [
  "#450a0a",
  "#651515",
  "#7f1d1d",
  "#991b1b",
  "#b91c1c",
  "#dc2626",
  "#f87171",
  "#fca5a5",
  "#fecaca",
  "#fee2e2",
  "#fef2f2",
  "#fff5f5",
] as const;

const SUCCESS_LIGHT = [
  "#f0fdf4",
  "#dcfce7",
  "#bbf7d0",
  "#86efac",
  "#4ade80",
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#166534",
  "#14532d",
  "#124126",
  "#052e16",
] as const;

const SUCCESS_DARK = [
  "#052e16",
  "#124126",
  "#14532d",
  "#166534",
  "#15803d",
  "#16a34a",
  "#4ade80",
  "#86efac",
  "#bbf7d0",
  "#dcfce7",
  "#f0fdf4",
  "#f7fff9",
] as const;

const WARNING_LIGHT = [
  "#fffbeb",
  "#fef3c7",
  "#fde68a",
  "#fcd34d",
  "#fbbf24",
  "#f59e0b",
  "#d97706",
  "#b45309",
  "#92400e",
  "#78350f",
  "#5f2f10",
  "#451a03",
] as const;

const WARNING_DARK = [
  "#451a03",
  "#5f2f10",
  "#78350f",
  "#92400e",
  "#b45309",
  "#d97706",
  "#fbbf24",
  "#fcd34d",
  "#fde68a",
  "#fef3c7",
  "#fffbeb",
  "#fffdf5",
] as const;

const INFO_LIGHT = [
  "#f0f9ff",
  "#e0f2fe",
  "#bae6fd",
  "#7dd3fc",
  "#38bdf8",
  "#0ea5e9",
  "#0284c7",
  "#0369a1",
  "#075985",
  "#0c4a6e",
  "#0b3c5c",
  "#082f49",
] as const;

const INFO_DARK = [
  "#082f49",
  "#0b3c5c",
  "#0c4a6e",
  "#075985",
  "#0369a1",
  "#0284c7",
  "#38bdf8",
  "#7dd3fc",
  "#bae6fd",
  "#e0f2fe",
  "#f0f9ff",
  "#f7fcff",
] as const;

const TYPOGRAPHY_LIGHT = [
  "#ffffff",
  "#f8fafc",
  "#e2e8f0",
  "#cbd5e1",
  "#94a3b8",
  "#64748b",
  "#475569",
  "#334155",
  "#1e293b",
  "#182234",
  "#161220",
  "#0d061f",
] as const;

const TYPOGRAPHY_DARK = [
  "#161220",
  "#211c2e",
  "#334155",
  "#475569",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#e2e8f0",
  "#f1f5f9",
  "#f8fafc",
  "#fbfdff",
  "#f8fafc",
] as const;

const OUTLINE_LIGHT = [
  "#ffffff",
  "#f8fafc",
  "#f1f5f9",
  "#e2e8f0",
  "#cbd5e1",
  "#94a3b8",
  "#64748b",
  "#475569",
  "#334155",
  "#1e293b",
  "#161220",
  "#0d061f",
] as const;

const OUTLINE_DARK = [
  "#161220",
  "#211c2e",
  "#2c263f",
  "#3b3450",
  "#534970",
  "#6f6590",
  "#94a3b8",
  "#cbd5e1",
  "#e2e8f0",
  "#f1f5f9",
  "#f8fafc",
  "#ffffff",
] as const;

const BACKGROUND_LIGHT = [
  "#f6f6f8",
  "#ffffff",
  "#f1f5f9",
  "#e2e8f0",
  "#cbd5e1",
  "#94a3b8",
  "#64748b",
  "#475569",
  "#334155",
  "#1e293b",
  "#161220",
  "#0d061f",
] as const;

const BACKGROUND_DARK = [
  "#161220",
  "#211c2e",
  "#2c263f",
  "#3b3450",
  "#534970",
  "#6f6590",
  "#94a3b8",
  "#cbd5e1",
  "#e2e8f0",
  "#f1f5f9",
  "#f8fafc",
  "#ffffff",
] as const;

const LIGHT_SPECIALS = {
  "--color-background-error": hexToRgbString("#fef2f2"),
  "--color-background-info": hexToRgbString("#f0f9ff"),
  "--color-background-muted": hexToRgbString("#f1f5f9"),
  "--color-background-success": hexToRgbString("#f0fdf4"),
  "--color-background-warning": hexToRgbString("#fff7ed"),
  "--color-indicator-error": hexToRgbString("#dc2626"),
  "--color-indicator-info": hexToRgbString("#0ea5e9"),
  "--color-indicator-primary": hexToRgbString("#3b1e8a"),
} as const;

const DARK_SPECIALS = {
  "--color-background-error": hexToRgbString("#450a0a"),
  "--color-background-info": hexToRgbString("#082f49"),
  "--color-background-muted": hexToRgbString("#2c263f"),
  "--color-background-success": hexToRgbString("#052e16"),
  "--color-background-warning": hexToRgbString("#451a03"),
  "--color-indicator-error": hexToRgbString("#f87171"),
  "--color-indicator-info": hexToRgbString("#7dd3fc"),
  "--color-indicator-primary": hexToRgbString("#c7baff"),
} as const;

export const STITCH_THEME_TOKENS = {
  dark: {
    ...buildScale("primary", PRIMARY_DARK),
    ...buildScale("secondary", SECONDARY_DARK),
    ...buildScale("tertiary", TERTIARY_DARK),
    ...buildScale("error", ERROR_DARK),
    ...buildScale("success", SUCCESS_DARK),
    ...buildScale("warning", WARNING_DARK),
    ...buildScale("info", INFO_DARK),
    ...buildScale("typography", TYPOGRAPHY_DARK),
    ...buildScale("outline", OUTLINE_DARK),
    ...buildScale("background", BACKGROUND_DARK),
    ...DARK_SPECIALS,
  },
  light: {
    ...buildScale("primary", PRIMARY_LIGHT),
    ...buildScale("secondary", SECONDARY_LIGHT),
    ...buildScale("tertiary", TERTIARY_LIGHT),
    ...buildScale("error", ERROR_LIGHT),
    ...buildScale("success", SUCCESS_LIGHT),
    ...buildScale("warning", WARNING_LIGHT),
    ...buildScale("info", INFO_LIGHT),
    ...buildScale("typography", TYPOGRAPHY_LIGHT),
    ...buildScale("outline", OUTLINE_LIGHT),
    ...buildScale("background", BACKGROUND_LIGHT),
    ...LIGHT_SPECIALS,
  },
} as const;

export const getTabBarPalette = (colorMode: StitchColorMode) => {
  if (colorMode === STITCH_COLOR_MODE.dark) {
    return {
      activeTintColor: STITCH_THEME.dark.primary,
      backgroundColor: STITCH_THEME.dark.surface,
      borderTopColor: STITCH_THEME.dark.border,
      inactiveTintColor: STITCH_THEME.dark.textMuted,
      sceneBackgroundColor: STITCH_THEME.dark.background,
    };
  }

  return {
    activeTintColor: STITCH_THEME.light.primary,
    backgroundColor: STITCH_THEME.light.surface,
    borderTopColor: STITCH_THEME.light.border,
    inactiveTintColor: STITCH_THEME.light.textMuted,
    sceneBackgroundColor: STITCH_THEME.light.background,
  };
};
