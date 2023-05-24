import * as React from 'react';
import { ThemeProvider as OriginalThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';
import { useThemeSlice } from './slice';
import { StyleConstants } from '../StyleConstants';
import { selectTheme } from './slice/selectors';

export const ThemeProvider = (props: { children: React.ReactChild }) => {
  useThemeSlice();

  const theme = useSelector(selectTheme);
  const customStyle = { ...StyleConstants, colors: theme };
  return (
    <OriginalThemeProvider theme={{ ...theme, ...customStyle }}>
      {React.Children.only(props.children)}
    </OriginalThemeProvider>
  );
};
