/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Libre Baskerville"', 'Georgia', 'serif'],
        body: ['Almarai', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
        wide: '1500px',
      },
    },
  },
  plugins: [],
};
