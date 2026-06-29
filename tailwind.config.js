/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#F8FAFC',
          secondary: '#EEF2F6',
        },
        ink: {
          primary: '#1E293B',
          secondary: '#64748B',
        },
        border: {
          DEFAULT: '#CBD5E1',
        },
        critical: '#DC2626',
        warning: '#F59E0B',
        info: '#2563EB',
        'info-hover': '#1D4ED8',
        success: '#16A34A',
        connectivity: '#06B6D4',
        donation: '#7C3AED',
        water: '#0EA5E9',
        food: '#F97316',
        electricity: '#EAB308',
      },
    },
  },
  plugins: [],
}
