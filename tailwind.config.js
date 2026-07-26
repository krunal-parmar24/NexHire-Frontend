/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB",
          purple: "#4F46E5",
          navy: "#0F172A",
        },
      },
    },
  },
  plugins: [],
};
