/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  daisyui: { themes: ["synthwave"] },
  plugins: [require("daisyui"), require("@kobalte/tailwindcss")],
};
