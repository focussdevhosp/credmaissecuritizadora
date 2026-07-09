/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
      },
      colors: {
        ink: "#16211D",
        forest: "#0D5E45",
        mint: "#DFF7EC",
        gold: "#D8A941",
        pearl: "#F7F4EC",
        clay: "#B96942",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(22, 33, 29, 0.14)",
      },
    },
  },
  plugins: [],
};
