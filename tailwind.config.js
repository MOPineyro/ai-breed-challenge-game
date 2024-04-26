/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        shake: 'shake 0.5s ease-in-out'
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["synthwave"],
  }
}