/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  daisyui: { themes: ["acid"] },
  plugins: [require("daisyui"), require("@kobalte/tailwindcss")],
};
