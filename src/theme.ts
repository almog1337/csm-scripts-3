export const lightTheme = {
  primary: '#3B1E54', // Dark purple
  secondary: '#9B7EBD', // Soft lavender
  background: '#EEEEEE', // Light gray
  text: '#605678', // Soft dark gray
  error: '#FF8C00', // Brighter orange for better visibility
  success: '#8ABFA3', // Soft teal for success
  warning: '#FFE6A5', // Soft yellow for warnings
  info: '#D4BEE4', // Light lavender for info
  border: '#D1D1D1', // Light gray
  hoverBackground: '#E8E8E8', // Lighter gray for hover effects
  accent1: '#9B7EBD', // Soft lavender
  accent2: '#E2E4FF', // Light purple-white for header text/icons
  accent3: '#D4BEE4', // Light lavender
  gradient1: 'linear-gradient(45deg, #3B1E54, #9B7EBD)', // Dark purple to soft lavender
  gradient2: 'linear-gradient(45deg, #EEEEEE, #D4BEE4)', // Light gray to light lavender
};

export const darkTheme = {
  primary: '#8B8FD9', // Lighter navy-purple for better visibility
  secondary: '#5D5E8A', // Darker muted purple for better contrast
  background: '#1A1B2E', // Dark navy background
  text: '#E2E4FF', // Light purple-tinted white for better readability
  error: '#FFBF61', // Soft orange for errors
  success: '#8ABFA3', // Soft teal for success
  warning: '#FFE6A5', // Soft yellow for warnings
  info: '#6F70A4', // Brighter navy-purple for info
  border: '#363856', // Dark navy-purple border
  hoverBackground: '#252742', // Slightly lighter navy-purple for hover
  accent1: '#A69BC1', // Lighter muted purple
  accent2: '#B8BBFF', // Slightly darker purple-white for better contrast in dark mode
  accent3: '#6F70A4', // Brighter navy-purple
  gradient1: 'linear-gradient(45deg, #8B8FD9, #5D5E8A)', // Lighter navy-purple to darker muted purple
  gradient2: 'linear-gradient(45deg, #6F70A4, #5D5E8A)', // Brighter navy-purple to darker muted purple
};

export type Theme = typeof lightTheme;