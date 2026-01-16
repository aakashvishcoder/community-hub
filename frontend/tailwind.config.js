export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {

        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', 
          600: '#0284c7',
        },
        accent: {
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316', 
          600: '#ea580c',
        },
        secondary: {
          500: '#10b981', 
        }
      },
      fontFamily: {
        heading: ['"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem', 
        '3xl': '1.5rem'
      },
      boxShadow: {
        'card': '0 4px 12px -4px rgba(0, 0, 0, 0.08)',
        'hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}