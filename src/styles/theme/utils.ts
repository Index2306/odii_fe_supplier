import {
  compose,
  space,
  color,
  layout,
  typography,
  flexbox,
  border,
  background,
  position,
  grid,
  shadow,
  width,
  minWidth,
  height,
  minHeight,
} from 'styled-system';
import styled from 'styled-components';

import { ThemeKeyType } from './slice/types';

/* istanbul ignore next line */
export const isSystemDark = window?.matchMedia
  ? window.matchMedia('(prefers-color-scheme: dark)')?.matches
  : undefined;

export function saveTheme(theme: ThemeKeyType) {
  window.localStorage && localStorage.setItem('selectedTheme', theme);
}

/* istanbul ignore next line */
export function getThemeFromStorage(): ThemeKeyType | null {
  return window.localStorage
    ? (localStorage.getItem('selectedTheme') as ThemeKeyType) || null
    : null;
}

export const styledSystem = (tag: any) =>
  styled(tag)(
    compose(
      space,
      color,
      layout,
      typography,
      flexbox,
      border,
      background,
      position,
      grid,
      shadow,
      width,
      minWidth,
      height,
      minHeight,
    ),
  );
