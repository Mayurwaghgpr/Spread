/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "var(--dark-color)",
        light:"var(--light-color)",
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      fontFamily: {
        nunito: ['"Nunito"', 'serif'], // Custom font-family
      },
      fontWeight: {
        nunito: '400', // Custom font-weight
      },
      fontStyle: {
        nunito: 'normal', // Custom font-style
      },
      animation: {
        },

      keyframes: {
        typewriter: {
          '0%': {
            width: '0%',
            opacity: '0',
            borderRightColor: 'transparent',
          },
          '50%': {

            width: '100%',
            opacity: '0.5',
            borderRightColor: 'black',
          },
          '100%': {
            width: '100%',
            opacity: '1',
            borderRightColor: 'transparent',
          },
        },
        fromRight: { // Corrected typo here
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' }, // Corrected typo here
        },
        toRight: { // Corrected typo here
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(110%)' }, // Corrected typo here
        },
         fromLeft: { // Corrected typo here
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' }, // Corrected typo here
        },
          toLeft: { // Corrected typo here
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-110%)' }, // Corrected typo here
         },
         fromTop: {
           '0%': { transform: 'translateY(-10%)'},
           '100%': { transform: 'translateY(0%)' },
  
        },
          fromBottom: {
           '0%': { transform: 'translateY(100%)'},
           '100%': { transform: 'translateY(0%)' },
  
        },
          toBottom: {
           '0%': { transform: 'translateY(0%)',},
            '100%': { transform: 'translateY(200%)' },
          
  
        },
           pop: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
         toTop: {  // New keyframes for sliding up on remove
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
          fedin: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' }, 
          },
          fedOut: {
            '0%': { opacity: '1' },
            '100%': { opacity: '0' }, 
          },
       slideUp: { 
      "0%": { transform: "translateY(20px)", opacity: "0" },
      "100%": { transform: "translateY(0)", opacity: "1" },
    },
    flip: {
      "0%": { transform: "rotateY(0deg)" },
      "100%": { transform: "rotateY(180deg)" },
    },
      },
      animation: {
        'slide-in-left':'fromLeft .5s ease-in-out forwards',
        'slide-in-right': 'fromRight .5s ease-in-out forwards',
        'slide-in-top': 'fromTop .5s ease-in-out forwards',
        'slide-out-top': 'toTop .5s ease-in-out forwards',
        'slide-out-left': 'toLeft 1s ease-in-out forwards',
        'slide-out-right': 'toRight .5s ease-in-out forwards',
        'slide-in-bottom': 'fromBottom .5s ease-in-out forwards',
        'slide-in-bottom.6s': 'fromBottom .6s ease-in-out forwards',
        'slide-in-bottom.7s': 'fromBottom .7s ease-in-out forwards',
        'slide-in-bottom.8s': 'fromBottom .8s ease-in-out forwards',
        'slide-in-bottom.9s': 'fromBottom .9s ease-in-out forwards',
        'slide-in-bottom1s': 'fromBottom 1s ease-in-out forwards',
        'slide-out-bottom': 'toBottom 1s ease-in-out forwards',
        "slide-up": "slideUp 0.5s ease-in-out",
    "flip": "flip 0.6s ease-in-out forwards",
        'fedin2s':'fedin 2s  ease-in-out',
        'fedin1s':'fedin 1s  ease-in-out',
        'fedin.2s': 'fedin .2s  ease-in-out',
        'fed-out': 'fedOut .3s ease-in-out',
        'pop': "pop 0.3s ease-out",
        'animate-typewriter': 'typewriter 2s steps(30) infinite',
      },

    },
  },
  plugins: [require('@tailwindcss/typography')],
}
