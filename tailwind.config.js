/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}', //  app/
    './src/core/**/*.{js,jsx,ts,tsx}', //  core/
    './src/features/**/*.{js,jsx,ts,tsx}', //  features/
    './src/shared/**/*.{js,jsx,ts,tsx}', //  shared/
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito'],
        nunitoItalic: ['NunitoItalic'],
      },
      colors: {
        // =============== BRAND COLORS ===============
        mirai: {
          light: '#E7E9DD', // light grey-green
          lime: '#C2F590', // brand lime
          white: '#FFFFFF',
          greenDark: '#314C19',
          grey: '#D9D9D9',
          black: '#13140E',

          // Backgrounds
          bgDeep: '#171E16', // deep green
          bgDarker: '#202718', // NEW bg level 2
          bgDarkest: '#33362E', // NEW bg level 3

          // Borders
          borderDark: '#262E1F', // existing
          borderDeep: '#1A2115', // NEW (darker)
        },

        // =============== SEMANTIC COLORS ===============
        primary: {
          DEFAULT: '#C2F590',
          foreground: '#13140E',
          soft: '#E7E9DD',
        },

        surface: {
          DEFAULT: '#13140E', // original background
          deep: '#171E16',
          darker: '#202718', // NEW
          darkest: '#33362E', // NEW
          soft: '#E7E9DD',
        },

        border: {
          DEFAULT: '#314C19',
          soft: '#E7E9DD',
          deep: '#262E1F',
          darker: '#1A2115', // NEW
        },

        text: {
          DEFAULT: '#FFFFFF',
          soft: '#E7E9DD',
          muted: '#979989',
          inverse: '#13140E',
          lime: '#C2F590',
        },

        success: '#4CAF50',
        warning: '#FFB300',
        danger: '#E53935',
      },

      borderRadius: {
        xl: '10px',
        '2xl': '20px',
      },
      height: {
        49: '12.5rem',
      },
    },
  },
  plugins: [],
};
