/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#26302F',    // Verde oscuro elegante
        secondary: '#DCCBB5',  // Beige/Dorado suave
        accent: '#51483F',     // Marrón tierra
        light: '#FCFBF8',      // Blanco crema fondo
        soft: '#EDFEFF',       // Azul muy claro
        mint: '#EDFFFA'        // Verde menta muy claro
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}