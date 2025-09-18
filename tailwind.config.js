/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:"#effbfb",100:"#d7f3f5",200:"#aee7ea",300:"#7ad6da",400:"#49c1c8",
          500:"#17a2b8",600:"#11899b",700:"#0f6f7e",800:"#0f5966",900:"#0e4954",
        },
      },
    },
  },
  plugins: [],
};
