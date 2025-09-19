/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './app/**/*.{js,jsx,ts,tsx}', //  app/
    './core/**/*.{js,jsx,ts,tsx}', //  core/
    './features/**/*.{js,jsx,ts,tsx}', //  features/
    './shared/**/*.{js,jsx,ts,tsx}', //  shared/
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
