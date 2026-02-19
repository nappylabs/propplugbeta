/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#020617', // Main background
          900: '#0F172A', // Card background
          800: '#1E293B', // Card borders
        },
        prop: {
          purple: '#6366F1',   // Primary brand color
          lavender: '#A5B4FC', // Highlights
          surface: '#F8FAFC',  // Light sections
          dark: '#0F172A',     // Navy text/elements
        }
      },
      borderRadius: {
        'card': '2rem',
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(99, 102, 241, 0.15)',
        'glow': '0 0 20px -5px rgba(99, 102, 241, 0.3)',
      },
      keyframes: {
        vibrate: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px) rotate(-1deg)' },
          '75%': { transform: 'translateX(2px) rotate(1deg)' },
        }
      },
      animation: {
        vibrate: 'vibrate 0.1s linear infinite',
      }
    },
  },
  plugins: [],
};
