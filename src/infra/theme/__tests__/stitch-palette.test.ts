import {
  STITCH_COLOR_MODE,
  STITCH_THEME,
  getTabBarPalette,
} from "@/src/infra/theme/stitch-palette";

describe("stitch palette", () => {
  it("exposes the Retail Manager Stitch colors for light mode", () => {
    expect(STITCH_THEME.light.primary).toBe("#3b1e8a");
    expect(STITCH_THEME.light.background).toBe("#f6f6f8");
    expect(STITCH_THEME.light.surface).toBe("#ffffff");
    expect(STITCH_THEME.light.textStrong).toBe("#161220");
  });

  it("exposes the dark mode palette derived from the Stitch export", () => {
    expect(STITCH_THEME.dark.background).toBe("#161220");
    expect(STITCH_THEME.dark.surface).toBe("#211c2e");
    expect(STITCH_THEME.dark.textStrong).toBe("#f8fafc");
  });

  it("returns the correct tab bar palette for each color mode", () => {
    expect(getTabBarPalette(STITCH_COLOR_MODE.light)).toEqual({
      activeTintColor: "#3b1e8a",
      backgroundColor: "#ffffff",
      borderTopColor: "#e2e8f0",
      inactiveTintColor: "#64748b",
      sceneBackgroundColor: "#f6f6f8",
    });

    expect(getTabBarPalette(STITCH_COLOR_MODE.dark)).toEqual({
      activeTintColor: "#c7baff",
      backgroundColor: "#211c2e",
      borderTopColor: "#3b3450",
      inactiveTintColor: "#94a3b8",
      sceneBackgroundColor: "#161220",
    });
  });
});
