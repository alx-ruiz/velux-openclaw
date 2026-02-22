import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        velux: {
          navy: '#0B1F3A',
          blue: '#2563EB',
          amber: '#F59E0B'
        }
      }
    }
  },
  plugins: []
};

export default config;
