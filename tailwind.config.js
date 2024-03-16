/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./auction/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        anta: ['Anta', 'sans-serif'], 
      },
      backgroundImage: {
        'two-tone': 'linear-gradient(-60deg, rgba(229,231,235,0) 50%,  rgb(216 ,180, 254 ,1) 50%)',
      },
      
     
    },
  },
  plugins: [],
}
