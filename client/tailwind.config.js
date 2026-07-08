/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B1F27',
        paper: '#F6F7F5',
        surface: '#FFFFFF',
        line: '#E3E5E1',
        muted: '#6B7280',
        accent: {
          DEFAULT: '#2F5D50',
          dark: '#234840',
          light: '#E7EFEC',
        },
        warn: {
          DEFAULT: '#B5502D',
          light: '#F5E8E2',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(27, 31, 39, 0.04), 0 1px 8px rgba(27, 31, 39, 0.04)',
      },
    },
  },
  plugins: [],
};
