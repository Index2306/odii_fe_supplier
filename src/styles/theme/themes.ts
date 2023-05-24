const lightTheme = {
  primary: '#3D56A6',
  secondary: '#A3E5FD',
  secondary2: '#EB5757',
  // stroke: '#f0f0f0',
  stroke: '#EBEBF0',
  text: '#333333',
  disabled: 'rgba(0, 0, 0, 0.25)',
  textSecondary: 'rgba(58,52,51,0.7)',
  background: '#F7F7F9',
  backgroundBlue: '#F4F6FD',
  border: 'rgba(58,52,51,0.12)',
  borderLight: 'rgba(58,52,51,0.05)',
  // Red palette
  redPrimary: '#BE1E2D',

  // pink
  pinkPrimary: '#EE496B',

  // Blue palette
  darkBlue1: '#2F80ED',
  darkBlue2: '#2D9CDB',
  darkBlue3: '#3161AD',
  violet: '#652F8D',
  orange: '#EA501F',
  // Green palette
  greenMedium: '#27AE60',
  greenMedium1: '#50BF4E',

  // white palette
  whitePrimary: '#FFFFFF',

  // Gray pallete
  grayPrimary: '#ddd',
  gray1: '#6c757d',
  gray2: '#4F4F4F',
  gray3: '#828282',
  gray4: '#E6E6E9',
  grayBlue: '#6C798F',

  // Orange pallete
  orangePrimary: '#EB5757',

  // Black pallete
  blackPrimary: '#000',
};

const darkTheme: Theme = {
  primary: 'rgba(220,120,95,1)',
  secondary: '#A3E5FD',
  secondary2: '#FF4D4F',
  orange: '#F2994A',
  stroke: '#D9D9D9',
  disabled: 'rgba(0, 0, 0, 0.25)',
  text: 'rgba(241,233,231,1)',
  textSecondary: 'rgba(241,233,231,0.6)',
  background: 'rgba(0,0,0,1)',
  backgroundBlue: 'rgba(28,26,26,1)',
  border: 'rgba(241,233,231,0.15)',
  borderLight: 'rgba(241,233,231,0.05)',
  // Red palette
  redPrimary: '#BE1E2D',

  // pink
  pinkPrimary: '#EE496B',

  // Blue palette
  darkBlue1: '#1C75BC',
  darkBlue2: '#1985d9',
  darkBlue3: '#3161AD',
  violet: '#652F8D',
  // Green palette
  greenMedium: '#7EA802',
  greenMedium1: '#29CC97',

  // white palette
  whitePrimary: '#FFFFFF',

  // Gray pallete
  grayPrimary: '#ddd',
  gray1: '#6c757d',
  gray2: '#4F4F4F',
  gray3: '#828282',
  gray4: '#E6E6E9',
  grayBlue: '#6C798F',

  // Orange pallete
  orangePrimary: '#EB5757',

  // Black pallete
  blackPrimary: '#000',
};

export type Theme = typeof lightTheme;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
