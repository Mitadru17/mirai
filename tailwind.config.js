/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0F1115",
        surface: "#181A20",
        card: "#23262F",
        primary: "#F6F5F2",
        secondary: "#A4A8B3",
        accent: {
          green: "#8DBA7A",
          blue: "#8CB9FF",
          beige: "#DDD2C4",
        },
      },
    },
  },
  plugins: [],
};
