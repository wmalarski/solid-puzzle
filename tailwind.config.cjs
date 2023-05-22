/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  plugins: [require("flowbite/plugin"), require("@kobalte/tailwindcss")],
};
