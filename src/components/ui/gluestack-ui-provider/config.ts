'use client';

import { vars } from 'nativewind';

import { STITCH_THEME_TOKENS } from '@/src/infra/theme/stitch-palette';

export const config = {
  dark: vars(STITCH_THEME_TOKENS.dark),
  light: vars(STITCH_THEME_TOKENS.light),
};
