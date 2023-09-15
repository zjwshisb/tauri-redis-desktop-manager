const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/**/*.{js,ts,jsx,tsx}',
    './src/**/**/**/*.{js,ts,jsx,tsx}',
    './src/**/**/**/**/*.{js,ts,jsx,tsx}',
    './src/**/**/**/**/**/*.{js,ts,jsx,tsx}',
    './src/**/**/**/**/**/**/*.{js,ts,jsx,tsx}',
    './src/**/**/**/**/**/**/**/*.{js,ts,jsx,tsx}',
    './src/**/**/**/**/**/**/**/**/*.{js,ts,jsx,tsx}'

  ],
  theme: {
    container: false,
    extend: {}
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.active-able': {
          '&:hover': {
            backgroundColor: 'rgb(0,0,0, 0.04)',
            cursor: 'pointer'
          },
          '&[data-active=true]': {
            backgroundColor: 'rgb(96 165 250)',
            color: '#fff'
          }
        }
      })
    })
  ]
}
