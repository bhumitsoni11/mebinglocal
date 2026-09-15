import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#a83223",
          hover: "#c84937",
          container: "#c94a38",
          fixed: "#ffdad4",
          "fixed-dim": "#ffb4a8",
        },
        "on-primary": "#ffffff",
        "on-primary-container": "#fffbff",
        "on-primary-fixed": "#410100",
        "on-primary-fixed-variant": "#8a1c10",

        secondary: {
          DEFAULT: "#1e3a34",
          slate: "#48645d",
          container: "#c7e6dd",
          fixed: "#cae9e0",
          "fixed-dim": "#aecdc4",
        },
        "on-secondary": "#ffffff",
        "on-secondary-container": "#4c6861",
        "on-secondary-fixed": "#02201b",
        "on-secondary-fixed-variant": "#304c46",

        tertiary: {
          DEFAULT: "#d97706",
          dark: "#8d4b00",
          container: "#b15f00",
          fixed: "#ffdcc3",
          "fixed-dim": "#ffb77d",
        },
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fffbff",
        "on-tertiary-fixed": "#2f1500",
        "on-tertiary-fixed-variant": "#6e3900",

        surface: {
          DEFAULT: "#f6fbf5",
          dim: "#d7dbd6",
          bright: "#f6fbf5",
          container: "#ebefea",
          "container-lowest": "#ffffff",
          "container-low": "#f0f5f0",
          "container-high": "#e5e9e4",
          "container-highest": "#dfe4df",
          variant: "#dfe4df",
          tint: "#ab3425",
        },
        "on-surface": "#181d1a",
        "on-surface-variant": "#58413d",
        "inverse-surface": "#2c322e",
        "inverse-on-surface": "#edf2ed",

        background: "#f6fbf5",
        "on-background": "#181d1a",

        outline: {
          DEFAULT: "#8c716c",
          variant: "#e0bfba",
          hairline: "#e5e5df",
        },

        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        trust: {
          emerald: "#059669",
          tint: "#10b981",
        },
        rating: {
          gold: "#f59e0b",
        },
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        gutter: "1.5rem",
        "gutter-mobile": "1rem",
        margin: "3rem",
        "margin-tablet": "2rem",
        "margin-mobile": "1.25rem",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        full: "9999px",
      },
      boxShadow: {
        "warm-xs": "0 1px 3px 0 rgba(31, 36, 33, 0.03)",
        "warm-sm": "0 2px 8px -2px rgba(31, 36, 33, 0.04), 0 1px 3px 0 rgba(31, 36, 33, 0.02)",
        "warm-md": "0 12px 24px -6px rgba(31, 36, 33, 0.07), 0 4px 10px -2px rgba(31, 36, 33, 0.03)",
        "warm-lg": "0 16px 32px -8px rgba(31, 36, 33, 0.09), 0 6px 16px -4px rgba(31, 36, 33, 0.04)",
        "warm-xl": "0 24px 48px -12px rgba(31, 36, 33, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
