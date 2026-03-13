/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html"],
  theme: {
    extend: {
      colors: {
        'cyan': '#37C79C',
        'cyan-dark': '#32b991',
        'cyan-darker': '#2daa85',
        'white': '#ffffff',
        'pink': '#FF387F',
        'dark-gray': '#383838'
      },
      fontFamily: {
        'damion': ['Damion', 'sans-serif']
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(55, 199, 156, 0.5), 0 0 40px rgba(55, 199, 156, 0.3)',
      }
    },
  },
  plugins: [],
}

