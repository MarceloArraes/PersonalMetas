/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      colors: {
        primary: "#94b85c",
        primaryDark: "#5d7538",
        secondary: "#5c94b8",
        terciary: "#b85c94",
      },
    },
  },
  plugins: [],
};
