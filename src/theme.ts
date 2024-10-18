export const lightTheme = {
  primary: '#536493',
  secondary: '#808080',
  background: '#F4F6FF',
  text: '#333333',
  error: '#FF6B6B',
  success: '#4CAF50',
  warning: '#FFA000',
  info: '#2196F3',
  border: '#E0E0E0',
  hoverBackground: '#E6E9F7', // Lighter version for hover
};

export const darkTheme = {
  primary: '#7B93D9',
  secondary: '#E0E0E0',
  background: '#1E1E1E',
  text: '#F4F6FF',
  error: '#FF8A80',
  success: '#69F0AE',
  warning: '#FFD740',
  info: '#64B5F6',
  border: '#424242',
  hoverBackground: '#2A2A2A', // Darker version for hover
};

export type Theme = typeof lightTheme;