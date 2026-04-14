/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
theme: {
  extend: {
    keyframes: {
      grow: {
        '0%':   { transform: 'scaleX(0)' },
        '100%': { transform: 'scaleX(1)' },
      },
    },
    animation: {
      grow: 'grow 2.5s ease-out forwards',
    },
  },
},
  plugins: [],
};
