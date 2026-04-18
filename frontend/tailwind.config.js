/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light: '#60A5FA',
          dark: '#1D4ED8',
        },
        accent: '#38BDF8',
        background: '#F8FAFC',
        foreground: '#0F172A',
        muted: '#64748B',
        border: '#E2E8F0',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        // Event type colors
        'event-class': {
          bg: '#EFF6FF',
          text: '#2563EB',
        },
        'event-workshop': {
          bg: '#FFF7ED',
          text: '#EA580C',
        },
        'event-event': {
          bg: '#F0FDF4',
          text: '#16A34A',
        },
        'event-seminar': {
          bg: '#FAF5FF',
          text: '#7C3AED',
        },
      },
      fontFamily: {
        heading: ['Zapline', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(37, 99, 235, 0.07)',
        'card-hover': '0 8px 30px rgba(37, 99, 235, 0.12)',
      },
    },
  },
  plugins: [],
}
