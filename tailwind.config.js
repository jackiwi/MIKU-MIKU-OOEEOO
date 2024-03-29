/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./public/index.html",
    "./src/**/*.{html,js,vue}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'comic': ['Comic Sans MS', 'Comic Sans', 'sans-serif'],
        'comicNeue': ['Comic Neue', 'cursive']
      }
    },
  },
  plugins: [
    require('@headlessui/tailwindcss')
  ],
}