const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
    extend: {

    },
    colors: {
      gray: {
        1: '#ffffff',
        2: '#fafafa',
        3: '#f5f5f5',
        4: '#f0f0f0',
        5: '#d9d9d9',
        6: '#bfbfbf',
        7: '#8c8c8c',
        8: '#595959',
        9: '#434343',
        10: '#262626',
        11: '#1f1f1f',
        12: '#191919',
        13: '#000000'
      },
      neutral: {
        title: '#000000E0',
        'title-dark': '#FFFFFFD9',
        'text-1': '#000000E0',
        'text-1-dark': '#FFFFFFD9',
        'text-2': '#000000A6',
        'text-2-dark': '#FFFFFFA6',
        'text-disabled': '#00000040',
        'text-disabled-dark': '#FFFFFF40',
        border: '#D9D9D9FF',
        'border-dark': '#424242FF',
        divide: '#0505050F',
        'divide-dark': '#FDFDFD1F',
        layout: 'F5F5F5FF',
        'layout-dark': '#000000FF'

      }
    }
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.active-able': {
          '&:hover': {
            backgroundColor: '#4096FF',
            cursor: 'pointer',
            color: '#FFFFFF ',
            '>span': {
              color: '#FFFFFF '
            }
          },
          '&[data-active=true]': {
            backgroundColor: '#E6F4FF',
            color: '#000'
          }
        }
      })
    })
  ]
}
