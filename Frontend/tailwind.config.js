/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        bebas: ['Bebas Neue', 'cursive'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      animation: {
        shake: 'shake 0.3s ease-in-out infinite',
    },
    animation: {
      writing: 'writing 6s ease-out infinite',
    },
      screens:{
        'max650':{'max' : '650px'},
      },
      colors:
      {
        'deepForestGreen' : '#064635',
        'teal-green': '#055E68'
      },
    keyframes: {
      shake: {
        '0%, 100%': { transform: 'translateX(0)' },
        '50%': { transform: 'translateX(-4px)' },
      },
      writing: {
        '0%': { transform: 'translateX(-100%)' },
        '50%': { transform: 'translateX(0%)' },
        '100%': { transform: 'translateX(100%)' },
      },
      
    },
  },
  },
  darkMode:'class',
  plugins: [],
}

