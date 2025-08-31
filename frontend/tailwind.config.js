module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
  montserrat: ['Montserrat', 'sans-serif'],
  sans: ["Poppins", "ui-sans-serif", "system-ui"],
  
},

    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}

