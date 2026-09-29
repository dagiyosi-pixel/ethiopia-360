import type { Config } from "tailwindcss";

/**
 * ETHIOPIA//360 design tokens.
 * Dark, cinematic surface stack + restrained Ethiopian-inspired accents.
 * Colour usage rule: accents are sparse — gold for emphasis, rift for action,
 * highland for growth/social, and a single blue for informational states.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#04060b",
          900: "#070a12",
          850: "#0a0e18",
          800: "#0d121e",
          700: "#121826",
          600: "#1a2233",
          500: "#26304a",
          400: "#3a4966",
          300: "#6b7a97",
          200: "#9aa8c2",
          100: "#cbd4e4",
        },
        gold: {
          200: "#fbeecd",
          300: "#f6dfa4",
          400: "#f0cc73",
          500: "#e2b354",
          600: "#c8952f",
          50: "rgba(226,179,84,0.12)",
        },
        rift: {
          400: "#e0703f",
          500: "#c4542a",
          600: "#a03f1d",
        },
        highland: {
          300: "#6bd3ad",
          400: "#3fb98c",
          500: "#1f8a6a",
          600: "#14654f",
        },
        nile: {
          400: "#5aa9e6",
          500: "#2f7fc1",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans Ethiopic",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["Fraunces", "Noto Serif Ethiopic", "Georgia", "serif"],
        ethiopic: ["Noto Sans Ethiopic", "Noto Serif Ethiopic", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      /**
       * Two control heights used by the shell (header bar, large buttons) that are
       * not part of Tailwind's default spacing scale. Declared here rather than
       * dropped into components as magic numbers.
       */
      spacing: {
        13: "3.25rem",
        18: "4.5rem",
      },
      maxWidth: {
        shell: "82rem",
        prose: "68ch",
      },
      letterSpacing: {
        tightest: "-0.045em",
        wider2: "0.18em",
        wider3: "0.3em",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 60px -32px rgba(0,0,0,0.9)",
        lift: "0 30px 80px -40px rgba(0,0,0,0.95)",
        glowgold: "0 0 0 1px rgba(226,179,84,0.28), 0 20px 60px -30px rgba(226,179,84,0.35)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "contour-faint":
          "radial-gradient(120% 90% at 50% 0%, rgba(226,179,84,0.10) 0%, transparent 60%)",
      },
      backgroundSize: {
        grid: "64px 64px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slow-pan": {
          "0%": { transform: "scale(1.04) translate3d(0,0,0)" },
          "50%": { transform: "scale(1.1) translate3d(-1%, -1%, 0)" },
          "100%": { transform: "scale(1.04) translate3d(0,0,0)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "1200" },
          "100%": { strokeDashoffset: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.9s ease both",
        "slow-pan": "slow-pan 26s ease-in-out infinite",
        "draw-line": "draw-line 3.2s ease-out both",
        shimmer: "shimmer 2.2s linear infinite",
        "pulse-ring": "pulse-ring 2.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
