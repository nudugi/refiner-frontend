/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['Consolas', 'ui-monospace', 'SFMono-Regular', "Menlo", 'monospace'],
      },
      colors: {
        ink: '#141311',
        paper: '#fbfaf7',
        accent: '#a8402a',
        muted: '#6b6862',
      },
    },
  },
  plugins: [],
}
