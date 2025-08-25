/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    container: false, // Desactivar el plugin de container de Tailwind
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
