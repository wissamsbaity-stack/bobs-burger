import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        accent: {
          DEFAULT: "#FF5C00",
          hover: "#FF7A2E",
          muted: "rgba(255, 92, 0, 0.12)",
        },
        whatsapp: "#25D366",
        surface: {
          DEFAULT: "#0a0a0a",
          raised: "#111111",
          overlay: "#1a1a1a",
        },
        cream: "#FAFAFA",
        muted: "#A1A1AA",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        ember: "0 0 80px -10px rgba(255, 92, 0, 0.45)",
        card: "0 8px 32px -8px rgba(0, 0, 0, 0.6)",
        float: "0 12px 40px -8px rgba(255, 92, 0, 0.35)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 92, 0, 0.08) 0%, transparent 70%)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
