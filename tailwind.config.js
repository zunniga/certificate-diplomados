/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Century Gothic', 'sans-serif'],
        'futura-bkbt': ['Futura Bk BT', 'sans-serif'], // Agrega tu nueva fuente aquí
      },
    },
  },
  plugins: [require("daisyui")],
}
