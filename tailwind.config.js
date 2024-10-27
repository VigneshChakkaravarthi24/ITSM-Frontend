/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700', // Custom gold color
        brown: '#8B4513', // Custom brown color
        gray: {
          100: '#f9f9f9', // Custom light gray background for the box
        },
      },
    },
  },
  plugins: [],
};
