/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        prop: {
          950: "#020617",      // Deepest Slate
          dark: "#0F172A",     // Deep Navy
          purple: "#6366F1",   // Primary Action Purple
          accent: "#A5B4FC",   // Muted Lavender
          surface: "#F8FAFC",  // High-legibility background
        }
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