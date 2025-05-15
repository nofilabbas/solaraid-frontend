/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#ed8900",
        customBg: "#ffd7b2" // Your custom primary color
      },
    },
  },
  plugins: [],
};

