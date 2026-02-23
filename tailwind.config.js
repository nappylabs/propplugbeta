/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        prop: {
          950: "#09090b",      // Charcoal (zinc-950)
          dark: "#18181b",     // Charcoal (zinc-900)
          accent: "#F97316",   // Orange-Red (orange-500)
          surface: "#F8FAFC",  // High-legibility background
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(99, 102, 241, 0.15)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};