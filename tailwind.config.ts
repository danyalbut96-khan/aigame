import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        cyan: {
          400: '#00f5ff',
          500: '#00c8d4',
          600: '#009aaa',
          700: '#006d80',
          800: '#004055',
          900: '#001a22',
        },
        green: {
          400: '#39ff14',
        },
        orange: {
          400: '#ff6b00',
          500: '#e05a00',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      boxShadow: {
        cyber: '0 0 15px rgba(0, 245, 255, 0.4)',
        'cyber-sm': '0 0 8px rgba(0, 245, 255, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
