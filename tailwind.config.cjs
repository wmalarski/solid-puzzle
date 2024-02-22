/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  daisyui: { themes: ["dracula", "fantasy"] },
  plugins: [require("daisyui"), require("@kobalte/tailwindcss")]
};
