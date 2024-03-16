/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      body: "rgba(var(--body) / <alpha-value>)",
      card: "rgba(var(--card) / <alpha-value>)",
      "card-strong": "rgba(var(--card-strong) / <alpha-value>)",
      "content-1": "rgba(var(--content-1) / <alpha-value>)",
      "content-2": "rgba(var(--content-2) / <alpha-value>)",
      "content-3": "rgba(var(--content-3) / <alpha-value>)",
      primary: "rgba(var(--primary) / <alpha-value>)",
      accent: "rgba(var(--accent) / <alpha-value>)",
      green: "rgba(var(--green) / <alpha-value>)",
      red: "rgba(var(--red) / <alpha-value>)",
      transparent: "transparent",
    },
    fontSize: {
      sm: "1.2rem",
      md: "1.4rem",
      lg: "1.8rem",
    },
    fontFamily: {
      sans: ["var(--wix-madefor-text-font)", "system-ui", "sans-serif"],
    },
    lineHeight: {
      tight: "1.35",
      normal: "1.4",
      loose: "1.45",
    },
  },
  plugins: [require("@pyncz/tailwind-mask-image")],
};
