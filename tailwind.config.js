const defaultTheme = require('tailwindcss/defaultTheme')

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
    },
    extend: {
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