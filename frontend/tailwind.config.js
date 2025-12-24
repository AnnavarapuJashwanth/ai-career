/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0052CC',
        secondary: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        light: '#F3F4F6',
        dark: '#1F2937',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideUp: 'slideUp 0.6s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
