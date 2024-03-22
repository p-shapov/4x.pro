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
      white: "rgba(var(--rgb-white) / <alpha-value>)",
      body: "rgba(var(--rgb-body) / <alpha-value>)",
      card: "rgba(var(--rgb-card) / <alpha-value>)",
      strong: "rgba(var(--rgb-strong) / <alpha-value>)",
      "content-1": "rgba(var(--rgb-content-1) / <alpha-value>)",
      "content-2": "rgba(var(--rgb-content-2) / <alpha-value>)",
      "content-3": "rgba(var(--rgb-content-3) / <alpha-value>)",
      primary: "rgba(var(--rgb-primary) / <alpha-value>)",
      accent: "rgba(var(--rgb-accent) / <alpha-value>)",
      green: "rgba(var(--rgb-green) / <alpha-value>)",
      red: "rgba(var(--rgb-red) / <alpha-value>)",
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
    screens: {
      phone: {
        max: "639px",
      },
      not_phone: {
        min: "640px",
      },
      tablet: {
        min: "640px",
        max: "1023px",
      },
      mobile: {
        max: "1023px",
      },
      not_mobile: {
        min: "1024px",
      },
      laptop: {
        min: "1024px",
        max: "1279px",
      },
      not_desktop: {
        max: "1279px",
      },
      desktop: {
        min: "1280px",
      },
    },
  },
  plugins: [
    require("@pyncz/tailwind-mask-image"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
