import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'kpi-level-1': '#dc2626',
        'kpi-level-2': '#f97316',
        'kpi-level-3': '#4ade80',
        'kpi-level-4': '#15803d'
      },
      fontFamily: {
        display: ['"IBM Plex Sans Arabic"', '"IBM Plex Sans"', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
