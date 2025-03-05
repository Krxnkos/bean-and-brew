/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./static/**/*.{css,js}"],
  theme: {
    extend: {
      colors: {
        'dark-green': '#414833',
        'light-green': '#A4AC86',
        'light-coffee': '#B6AD90',
        'coffee-brown': '#7F4F24',
        'light-beige': '#F5F5DC',
        'cream': '#FFF8E7'
      },
      fontFamily: {
        'prompt': ['Prompt', 'sans-serif'],
        'nerko': ['"Nerko One"', 'cursive']
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out',
        'slide-in': 'slideIn 0.6s ease-out'
      },
      backgroundImage: {
        'menu-parallax': "url('/images/menu_parallax.webp')"
      }
    }
  },
  plugins: [],
}