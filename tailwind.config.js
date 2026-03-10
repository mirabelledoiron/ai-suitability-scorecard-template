/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)',
        background: 'var(--color-bg)',
        foreground: 'var(--color-text)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-text-on-dark)',
        },
        muted: {
          DEFAULT: 'var(--color-surface-hover)',
          foreground: 'var(--color-text-muted)',
        },
        card: {
          DEFAULT: 'var(--color-card-bg)',
          foreground: 'var(--color-text)',
        },
        sidebar: {
          DEFAULT: 'var(--color-sidebar-bg)',
          foreground: 'var(--color-sidebar-text)',
          active: 'var(--color-sidebar-active-bg)',
          'active-foreground': 'var(--color-sidebar-active-text)',
          hover: 'var(--color-sidebar-hover-bg)',
          'hover-foreground': 'var(--color-sidebar-hover-text)',
        },
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      fontFamily: {
        sans: ['var(--font-family)'],
      },
    },
  },
  corePlugins: {
    preflight: false, // keep our existing CSS reset intact
  },
  plugins: [],
};
