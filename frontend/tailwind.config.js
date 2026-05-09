/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#7C3AED', light: '#F1EAFE', dark: '#5B21B6' },
        dark:      { DEFAULT: '#091127', nav: '#071026' },
        surface:   { DEFAULT: '#F7F8FB', card: '#FFFFFF' },
      },
      borderRadius: {
        card: '24px',
        btn:  '12px',
      },
      boxShadow: {
        card:  '0 2px 24px 0 rgba(124,58,237,0.06)',
        hover: '0 8px 32px 0 rgba(124,58,237,0.14)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
