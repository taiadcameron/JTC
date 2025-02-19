import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Color:
        primary: {
          50: "#000411",
          100: "#000822",
          200: "#001044",
          300: "#001866",
          400: "#002088",
          500: "#00070E", // Main
          600: "#001E3C",
          700: "#003662",
          800: "#004E88",
          900: "#0066AE",
          950: "#007ED4",
        },
        // Secondary Color
        secondary: {
          50: "#030405",
          100: "#06090A",
          200: "#0C1214",
          300: "#121A1E",
          400: "#080C10", // Main
          500: "#1E2428",
          600: "#2A3238",
          700: "#364048",
          800: "#424D57",
          900: "#4E5B67",
          950: "#5A6977",
        },
        // Button Color
        button: {
          50: "#1A1A1A",
          100: "#1F1F1F",
          200: "#252525", // Main
          300: "#2A2A2A",
          400: "#303030",
          500: "#363636",
          600: "#3C3C3C",
          700: "#424242",
          800: "#484848",
          900: "#4E4E4E",
          950: "#545454",
        },

        card: {
          500: "#0D1115",
        },
      },
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
        helvetica: ["Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
