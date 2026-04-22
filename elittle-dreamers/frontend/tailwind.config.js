/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,mdx}',
    './components/**/*.{js,jsx,mdx}',
    './app/**/*.{js,jsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sky-blue': '#87CEEB',
        'hero-dark': '#2C3E50',
        'steel-blue': '#7BA7C4',
        'navy': '#1B3A4B',
        'teal': '#2C5F7A',
        'footer-light': '#F0F4F8',
        'img-slot': '#D5CEC8',
        'slot-text': '#9A9490',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [],
}
