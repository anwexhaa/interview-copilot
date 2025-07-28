import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0c0c0d',
        foreground: '#f4f4f5',
        accent: '#5eead4',
      },
      boxShadow: {
        glow: '0 0 8px #5eead4',
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
