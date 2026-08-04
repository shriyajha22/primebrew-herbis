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
          green: "#2E7D32",
          darkGreen: "#1B5E20",
          mint: "#A5D6A7",
          beige: "#F8F5F0",
          cream: "#FFFDF8",
          brown: "#6D4C41",
          gold: "#D4AF37",
          charcoal: "#2F2F2F",
          lightGray: "#F3F4F6",
          darkBg: "#121212",
          darkCard: "#1E1E1E",
        },
      },
      borderRadius: {
        badge: "999px",
        input: "10px",
        button: "12px",
        card: "16px",
        modal: "18px",
        image: "20px",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(46, 125, 50, 0.08)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
        premium: "0 20px 40px -15px rgba(27, 94, 32, 0.15)",
        gold: "0 4px 15px rgba(212, 175, 55, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
