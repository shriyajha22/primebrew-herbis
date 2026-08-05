import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#6FAF5A",         // Soft herbal primary green
          darkGreen: "#3B5B30",     // Deep herbal green
          softGreen: "#8BCB75",     // Secondary soft sage green
          accentGreen: "#A8D89C",   // Light herbal green accent
          mint: "#A8D89C",          // Light green border / badge
          bgBeige: "#F8F3E8",       // Warm soft beige primary background
          bgSoft: "#F5EFE2",        // Soft natural cream shade
          cardBeige: "#FAF6EE",     // Warm off-white card background
          cardWhite: "#FAF6EE",     // Warm off-white card background
          darkGrey: "#2C352B",      // Dark natural charcoal text
          mediumGrey: "#556054",    // Medium sage grey text
          actionIncrease: "#6FAF5A",// Green +
          actionDecrease: "#E69C45",// Warm Orange -
          actionRemove: "rgb(215, 65, 65)", // Muted Red remove
          gold: "#D4AF37",
          charcoal: "#2C352B",
          lightGray: "#F3ECE0",
          darkBg: "#1F291E",
          darkCard: "#2B372A",
        },
      },
      borderRadius: {
        badge: "999px",
        input: "12px",
        button: "12px",
        card: "14px",
        modal: "16px",
        image: "14px",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(111, 175, 90, 0.12)",
        card: "0 6px 24px -4px rgba(60, 90, 50, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.03)",
        premium: "0 14px 35px -10px rgba(59, 91, 48, 0.15)",
        gold: "0 4px 15px rgba(212, 175, 55, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
