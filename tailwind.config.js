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
        primary: "#1E3A8A", // Example primary color
        secondary: "#9333EA", // Example secondary color
      },
      animation: {
        float: "float 6s infinite ease-in-out",
        bounceSlow: "bounce 4s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Example custom font
        cursive: ["Dancing Script", "cursive"],
      },
      spacing: {
        "90vh": "90vh", // Example for large sections
      },
    },
  },
  plugins: [

  ],
};
