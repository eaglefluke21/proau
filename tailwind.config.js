/** @type {import('tailwindcss').Config} */
export const content = ["./auction/*.{html,js}"];
export const theme = {
  extend: {
    fontFamily: {
      anta: ['Anta', 'sans-serif'],
      comic: ['Comic Neue', 'sans-serif'],
    },
    backgroundImage: {
      'two-tone': 'linear-gradient(-55deg, rgba(229,231,235,0.5) 40%,  rgb(216 ,180, 254 ,0.5) 60%)',
    },
  },
};
export const plugins = [];
