import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#faf6ed",
          100: "#f3ead4",
          200: "#e6d3a8",
          300: "#d9bc7c",
          400: "#c5a059",
          500: "#b08840",
          600: "#8f6d33",
          700: "#6e5428",
          800: "#4d3b1c",
          900: "#2c2210",
        },
        surface: {
          DEFAULT: "#0a0a0a",
          card: "#141414",
          elevated: "#1a1a1a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 80% 60% at 70% -10%, rgba(197,160,89,0.15), transparent), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(197,160,89,0.08), transparent)",
        "gold-gradient": "linear-gradient(135deg, #c5a059 0%, #d9bc7c 50%, #b08840 100%)",
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(197,160,89,0.35)",
        card: "0 25px 50px -12px rgba(0,0,0,0.5)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
