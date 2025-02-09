/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
        border: 'var(--color-border)',
        hoverBackground: 'var(--color-hoverBackground)',
        accent1: 'var(--color-accent1)',
        accent2: 'var(--color-accent2)',
        accent3: 'var(--color-accent3)',
      },
      backgroundImage: {
        'gradient-1': 'var(--color-gradient1)',
        'gradient-2': 'var(--color-gradient2)',
      },
    },
  },
  plugins: [],
};