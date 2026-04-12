/** @type {import('tailwindcss').Config} */
// ─────────────────────────────────────────────────────────────────────────────
// TuitorHub Design System — Tailwind / NativeWind token extension
// All custom values mirror theme/index.js so that both StyleSheet-based code
// (import theme) and NativeWind className-based code (className="bg-brand-yellow")
// stay in sync.
// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // ── Colors ─────────────────────────────────────────────────────────────
      colors: {
        // Primary brand
        "brand-yellow": "#FFE033",
        "brand-blue": "#4BC8F5",
        "brand-black": "#1A1A1A",
        "brand-white": "#FFFFFF",
        "brand-offwhite": "#F5F5F0",

        // Semantic
        "semantic-green": "#4CAF7D",
        "semantic-amber": "#F5A623",
        "semantic-red": "#FF4B4B",
        "semantic-coral": "#F47C52",

        // Text hierarchy
        "text-primary": "#1A1A1A",
        "text-secondary": "#555555",
        "text-muted": "#888888",
        "text-meta": "#AAAAAA",

        // Structural
        "ui-border": "#1A1A1A",
        "ui-divider": "#F0F0F0",

        // Badge backgrounds
        "badge-yellow-bg": "#FFE033",
        "badge-black-bg": "#1A1A1A",
        "badge-red-bg": "#FF4B4B",
        "badge-green-bg": "#D4F7E2",
        "badge-green-text": "#1A7A45",
        "badge-pink-bg": "#FFEAEA",
        "badge-pink-text": "#CC3333",
        "badge-blue-bg": "#E5F6FF",
        "badge-blue-text": "#1A7AAA",

        // Icon circle backgrounds
        "icon-students-bg": "#E8F4FF",
        "icon-students": "#1A7AAA",
        "icon-revenue-bg": "#E8F9F0",
        "icon-revenue": "#1A7A45",
        "icon-classes-bg": "#FFF8E5",
        "icon-classes": "#A06000",
        "icon-completion-bg": "#FFEEE8",
        "icon-completion": "#CC3333",
      },

      // ── Font sizes ──────────────────────────────────────────────────────────
      fontSize: {
        "2xs": ["9px", { lineHeight: "12px" }], // nav labels
        xs: ["10px", { lineHeight: "14px" }], // stat card labels
        sm: ["11px", { lineHeight: "15px" }], // badges, meta, labels
        base: ["13px", { lineHeight: "18px" }], // greeting sub
        md: ["14px", { lineHeight: "20px" }], // body, list titles, button
        lg: ["15px", { lineHeight: "21px" }], // blue button
        xl: ["16px", { lineHeight: "22px" }], // section headers (h3)
        "2xl": ["22px", { lineHeight: "28px" }], // page title (h2), screen header
        "3xl": ["28px", { lineHeight: "34px" }], // h1, stat card number
        "4xl": ["36px", { lineHeight: "42px" }], // large stat number
      },

      // ── Font weights ────────────────────────────────────────────────────────
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },

      // ── Letter spacing ──────────────────────────────────────────────────────
      letterSpacing: {
        tightest: "-0.05em", // stat numbers
        tighter: "-0.03em", // h1 / hero
        tight: "-0.02em", // h2 title
        "tight-sm": "-0.01em", // h3 section
        normal: "0em",
        wide: "0.05em", // nav labels
        wider: "0.1em", // labels
        widest: "0.12em", // uppercase labels
      },

      // ── Spacing ─────────────────────────────────────────────────────────────
      // These extend Tailwind defaults, so p-xs = 4px, gap-screen = 20px, etc.
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
        screen: "20px", // screen horizontal padding
      },

      // ── Border radius ───────────────────────────────────────────────────────
      borderRadius: {
        chip: "4px",
        input: "12px",
        button: "24px",
        "button-lg": "40px",
        "card-sm": "14px",
        card: "16px",
        nav: "20px",
        pill: "999px",
        circle: "9999px",
      },

      // ── Border widths ───────────────────────────────────────────────────────
      borderWidth: {
        DEFAULT: "2px",
        thin: "1.5px",
        divider: "1px",
      },

      // ── Box shadow ──────────────────────────────────────────────────────────
      // NativeWind v4 maps boxShadow to RN shadow props.
      // For flat offset shadows we use the ShadowCard component instead,
      // but these are kept for completeness / web parity.
      boxShadow: {
        "flat-sm": "2px 2px 0px #1A1A1A",
        "flat-md": "3px 3px 0px #1A1A1A",
        "flat-lg": "5px 5px 0px #1A1A1A",
      },
    },
  },
  plugins: [],
};
