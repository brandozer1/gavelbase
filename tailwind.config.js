const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      color1: "#FF1A1A",
      color2: "#FF4717",
      color3: "#FF7414",
      color4: "#FFA011",
      color5: "#FFCC0E",
      color6: "#FFF80B",
      color7: "#D4FF08",
      color8: "#A8FF05",
      color9: "#7DFF02",
      color10: "#52FF00",
      ...colors,
    },
    extend: {
      backgroundColor: {
        slate: '#485c66',
        'slate-150': '#63757d',
        'slate-250': '#788e96',
        'slate-350': '#8ea5ad',
        'slate-450': '#a3bcb5',
        'slate-550': '#b8d3bd',
        'slate-650': '#cceacf',
        'slate-750': '#e1f1d7',
        'slate-850': '#f6f8de',
        'slate-950': '#fcfdf6',

        stone: '#5c787d',
        'stone-150': '#748f96',
        'stone-250': '#91aca7',
        'stone-350': '#adc9b8',
        'stone-450': '#cad6c9',
        'stone-550': '#e6e3da',
        'stone-650': '#f3f1e8',
        'stone-750': '#f8f7ef',
        'stone-850': '#fcfbf7',
        'stone-950': '#fdfefc',

        neutral: '#6b7c7d',
        'neutral-150': '#849698',
        'neutral-250': '#a0b2b3',
        'neutral-350': '#bccbcc',
        'neutral-450': '#d8e5e5',
        'neutral-550': '#e5f0f0',
        'neutral-650': '#f2fafa',
        'neutral-750': '#f7fbfb',
        'neutral-850': '#fcfdfd',
        'neutral-950': '#fdfefe',

        zinc: '#8e9a9b',
        'zinc-150': '#a6b4b5',
        'zinc-250': '#c3cdce',
        'zinc-350': '#e0e5e5',
        'zinc-450': '#edf2f2',
        'zinc-550': '#f7fafa',
        'zinc-650': '#fcfdfd',
        'zinc-750': '#fdfefe',
        'zinc-850': '#fdfefe',
        'zinc-950': '#fdfefe',

        gray: '#bfc8c9',
        'gray-150': '#d4dadb',
        'gray-250': '#e7ecef',
        'gray-350': '#f0f4f4',
        'gray-450': '#f7fbfb',
        'gray-550': '#fcfdfd',
        'gray-650': '#fdfefe',
        'gray-750': '#fdfefe',
        'gray-850': '#fdfefe',
        'gray-950': '#fdfefe',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    // ...
    require('@tailwindcss/forms'),
  ],
  // ...
}