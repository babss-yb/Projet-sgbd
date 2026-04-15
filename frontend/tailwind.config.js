/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#06080f',
        bgSecondary: '#0d1117',
        bgTertiary: '#161b22',
        bgElevated: '#1c2333',
        bgSurface: 'rgba(22, 27, 34, 0.7)',
        accentPrimary: '#7c5bff',
        accentSecondary: '#00d4aa',
        accentTertiary: '#ff6b9d',
        accentWarning: '#ffb347',
        accentInfo: '#4dabf7',
        textPrimary: '#e6edf3',
        textSecondary: '#8b949e',
        textMuted: '#484f58',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7c5bff 0%, #00d4aa 100%)',
        'gradient-card-blue': 'linear-gradient(135deg, rgba(77, 171, 247, 0.12) 0%, rgba(124, 91, 255, 0.06) 100%)',
        'gradient-card-green': 'linear-gradient(135deg, rgba(0, 212, 170, 0.12) 0%, rgba(0, 212, 170, 0.03) 100%)',
        'gradient-card-purple': 'linear-gradient(135deg, rgba(124, 91, 255, 0.12) 0%, rgba(255, 107, 157, 0.06) 100%)',
        'gradient-card-red': 'linear-gradient(135deg, rgba(255, 107, 157, 0.12) 0%, rgba(255, 179, 71, 0.06) 100%)',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(124, 91, 255, 0.15)',
      },
      animation: {
        'float': 'float 20s infinite ease-in-out alternate',
        'pulse-glow': 'pulse-glow 2s infinite alternate',
        'typing': 'typing 1.4s infinite ease-in-out both',
        'fade-slide-up': 'fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-30px, 50px) scale(1.1)' },
          '100%': { transform: 'translate(50px, -30px) scale(0.9)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 5px #7c5bff', opacity: '0.5', transform: 'scale(1)' },
          '100%': { boxShadow: '0 0 20px #7c5bff', opacity: '1', transform: 'scale(1.1)' },
        },
        typing: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.5' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeSlideUp: {
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
