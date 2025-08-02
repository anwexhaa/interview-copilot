import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
     './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    primary: 'var(--primary)',
    'primary-foreground': 'var(--primary-foreground)',
    muted: 'var(--muted)',
    'muted-foreground': 'var(--muted-foreground)',
    accent: 'var(--accent)',
    'accent-foreground': 'var(--accent-foreground)',
    destructive: 'var(--destructive)',
    border: 'var(--border)',
    input: 'var(--input)',
    ring: 'var(--ring)',
    card: 'var(--card)',
    'card-foreground': 'var(--card-foreground)',
    popover: 'var(--popover)',
    'popover-foreground': 'var(--popover-foreground)',
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
