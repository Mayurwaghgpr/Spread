/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      keyframes: {
        fromRight: { // Corrected typo here
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' }, // Corrected typo here
        },
         fromLeft: { // Corrected typo here
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' }, // Corrected typo here
         },
         fromTop: {
           '0%': { transform: 'translateY(-10%)'},
           '100%': { transform: 'translateY(0%)' },
  
         },
         toTop: {  // New keyframes for sliding up on remove
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
          fedin: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' }, // Correct opacity range
          }
      },
      animation: {
        'slide-in-left':'fromLeft .5s ease-in-out forwards',
        'slide-in-right': 'fromRight .5s ease-in-out forwards',
        'slide-in-top': 'fromTop .5s ease-in-out forwards',
        'slide-out-top': 'toTop .5s ease-in-out forwards',
        'fedin2s':'fedin 2s  ease-in-out',
        'fedin1s':'fedin 1s  ease-in-out',
        'fedin.2s':'fedin .2s  ease-in-out'
      },
      
    },
  },
  plugins: [],
}
