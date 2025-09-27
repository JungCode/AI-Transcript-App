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
    extend: {},
  },
  plugins: [],
};
