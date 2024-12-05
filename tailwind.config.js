/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1E3A8A",
        secondary: "#9333EA",
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(0, 128, 128, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 128, 128, 0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-pattern': '50px 50px',
      },
      animation: {
        float: "float 6s infinite ease-in-out",
        bounceSlow: "bounce 4s infinite",
        'modal-slide': 'modal-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'modal-fade': 'modal-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'modal-content': 'modal-content 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'dropdown': 'dropdown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'gradient-x': 'gradient-x 15s ease infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'tab-slide-right': 'tab-slide-right 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'tab-slide-left': 'tab-slide-left 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'underline-slide': 'underline-slide 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        'modal-slide': {
          '0%': { 
            transform: 'translateY(30px) scale(0.95)',
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateY(0) scale(1)',
            opacity: '1' 
          }
        },
        'modal-fade': {
          '0%': { 
            opacity: '0',
            backdropFilter: 'blur(0px)'
          },
          '100%': { 
            opacity: '1',
            backdropFilter: 'blur(4px)'
          }
        },
        'modal-content': {
          '0%': { 
            transform: 'scale(0.95)',
            opacity: '0',
            filter: 'blur(4px)'
          },
          '40%': { 
            opacity: '0.5',
            filter: 'blur(2px)'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1',
            filter: 'blur(0px)'
          }
        },
        'dropdown': {
          '0%': {
            transform: 'scaleY(0)',
            opacity: '0'
          },
          '100%': {
            transform: 'scaleY(1)',
            opacity: '1'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'fadeIn': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'tab-slide-right': {
          '0%': {
            transform: 'translateX(-30px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'tab-slide-left': {
          '0%': {
            transform: 'translateX(30px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'underline-slide': {
          '0%': {
            transform: 'scaleX(0)',
            transformOrigin: 'left'
          },
          '100%': {
            transform: 'scaleX(1)',
            transformOrigin: 'left'
          }
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        cursive: ["Dancing Script", "cursive"],
      },
      spacing: {
        "90vh": "90vh",
      },
    },
  },
  plugins: [],
};
