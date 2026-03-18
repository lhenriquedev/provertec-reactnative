/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

import { STITCH_THEME } from '@/src/infra/theme/stitch-palette';

const tintColorLight = STITCH_THEME.light.primary;
const tintColorDark = STITCH_THEME.dark.primary;

export const Colors = {
  light: {
    text: STITCH_THEME.light.textStrong,
    background: STITCH_THEME.light.background,
    tint: tintColorLight,
    icon: STITCH_THEME.light.textMuted,
    tabIconDefault: STITCH_THEME.light.textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: STITCH_THEME.dark.textStrong,
    background: STITCH_THEME.dark.background,
    tint: tintColorDark,
    icon: STITCH_THEME.dark.textMuted,
    tabIconDefault: STITCH_THEME.dark.textMuted,
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
