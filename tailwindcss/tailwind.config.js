/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        'cyan': '#37C79C',
        'cyan-dark': '#32b991',
        'cyan-darker': '#2daa85',
        'white': '#ffffff',
        'pink': '#FF387F'
      },
      fontFamily: {
        'damion': ['Damion', 'sans-serif']
      }
    },
  },
  plugins: [],
}

