/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A9B8C',
        secondary: '#E8F5F1',
        accent: '#F5F5F5',
        muted: '#6B7280',
        dark: '#1F2937',
      }
    },
  },
  plugins: [],
}
