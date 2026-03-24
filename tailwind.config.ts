import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        board: "#0f172a",
        "board-cell": "#1e293b",
        "board-border": "#334155",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "laser-flow": "laserFlow 1s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.5)" },
        },
        laserFlow: {
          "0%": { strokeDashoffset: "20" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
