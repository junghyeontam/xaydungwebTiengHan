import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // Universal Token-Based Palette (Switchable via tokens.css & brand.ts)
        brand: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          tint: "var(--tint-panel)",
          "tint-hover": "var(--tint-panel-hover)",
          navy: "var(--heading)",
          body: "var(--body)",
          secondary: "var(--secondary)",
          muted: "var(--muted)",
          border: "var(--border)",
          "border-strong": "var(--border-strong)",
          primary: "var(--primary)",
          "primary-hover": "var(--primary-hover)",
          blue: "var(--primary-bright)",
          frame: "var(--frame)",
          gold: "var(--gold)",
          "gold-tint": "var(--gold-tint)",
          coral: "var(--coral)",
          "coral-hover": "var(--coral-hover)",
          success: "var(--success)",
          warning: "var(--warning)",
          danger: "var(--danger)",
          info: "var(--info)",
        },
        // Brand JungHyeon Heritage Palette
        junghyeon: {
          cream: "#FAF7F2",
          "cream-subtle": "#F3EFE6",
          dark: "#12302F",
          "dark-surface": "#0C1716",
          "dark-card": "#152423",
          teal: "#3DBBA8",
          "teal-hover": "#329E8E",
          yellow: "#F5B93A",
          "yellow-light": "#FEF5E7",
          coral: "#E8604C",
          "coral-hover": "#D34F3C",
          hanbok: "#2F5D9E",
          "hanbok-light": "#EBF2FC",
        },
        // Admin Design System Tokens (Ember Polish in Light Theme)
        admin: {
          bg: "var(--admin-bg)",
          surface: "var(--admin-surface)",
          sidebar: "var(--admin-sidebar)",
          subtle: "var(--admin-subtle)",
          border: "var(--admin-border)",
          "border-strong": "var(--admin-border-strong)",
          text: {
            primary: "var(--admin-text-primary)",
            secondary: "var(--admin-text-secondary)",
            muted: "var(--admin-text-muted)",
            placeholder: "var(--admin-text-placeholder)",
          },
          brand: {
            dark: "var(--admin-brand-dark)",
            teal: "var(--admin-brand-teal)",
            coral: "var(--admin-brand-coral)",
            yellow: "var(--admin-brand-yellow)",
            hanbok: "var(--admin-brand-hanbok)",
          },
          success: "var(--admin-success)",
          "success-tint": "var(--admin-success-tint)",
          warning: "var(--admin-warning)",
          "warning-tint": "var(--admin-warning-tint)",
          danger: "var(--admin-danger)",
          "danger-tint": "var(--admin-danger-tint)",
          info: "var(--admin-info)",
          "info-tint": "var(--admin-info-tint)",
          plan: {
            enterprise: "var(--admin-plan-enterprise)",
            business: "var(--admin-plan-business)",
            pro: "var(--admin-plan-pro)",
            starter: "var(--admin-plan-starter)",
            free: "var(--admin-plan-free)",
          },
        },
        border: "var(--color-border, #E6EAF1)",
        input: "var(--color-border-strong, #D3DAE6)",
        ring: "var(--primary, #1E44A8)",
        background: "var(--bg, #FFFFFF)",
        foreground: "var(--body, #2B3445)",
        surface: "var(--surface, #F7F9FC)",
        tint: "var(--tint-panel, #E3F0FF)",
        growth: "var(--tint-growth, #E8F6F1)",
        primary: {
          DEFAULT: "var(--primary, #1E44A8)",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "var(--surface, #F7F9FC)",
          foreground: "var(--body, #2B3445)",
        },
        accent: {
          DEFAULT: "var(--tint-panel, #E3F0FF)",
          foreground: "var(--primary, #1E44A8)",
        },
        card: {
          DEFAULT: "var(--surface, #F7F9FC)",
          foreground: "var(--body, #2B3445)",
        },
      },
      borderRadius: {
        lg: "var(--radius-card, 20px)",
        md: "calc(var(--radius-card, 20px) - 4px)",
        sm: "calc(var(--radius-card, 20px) - 8px)",
        "2xl": "1.25rem", // 20px
        "3xl": "1.75rem", // 28px
        panel: "var(--radius-panel, 28px)",
        container: "var(--radius-container, 28px)",
        card: "var(--radius-card, 20px)",
        control: "var(--radius-control, 12px)",
        pill: "var(--radius-pill, 999px)",
        "admin-card": "var(--admin-radius-card)",
        "admin-control": "var(--admin-radius-control)",
        "admin-pill": "var(--admin-radius-pill)",
      },
      boxShadow: {
        xs: "var(--shadow-xs, 0 1px 2px rgba(20, 32, 80, 0.04))",
        sm: "var(--shadow-sm, 0 2px 6px rgba(20, 32, 80, 0.04))",
        card: "var(--shadow-card, 0 8px 24px rgba(20, 32, 80, 0.05))",
        "card-hover": "var(--shadow-card-hover, 0 10px 28px rgba(20, 32, 80, 0.07))",
        soft: "0 8px 24px rgba(20, 32, 80, 0.05)",
        "gold-glow": "0 2px 8px rgba(245, 185, 58, 0.15)",
        "admin-card": "var(--admin-shadow-card)",
        "admin-hover": "var(--admin-shadow-hover)",
        "admin-active": "var(--admin-shadow-active-item)",
      },
      fontFamily: {
        sans: ["'Be Vietnam Pro'", "'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        heading: ["'Plus Jakarta Sans'", "'Be Vietnam Pro'", "system-ui", "sans-serif"],
        korean: ["'Noto Sans KR'", "sans-serif"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.75" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".num": {
          "font-family": "'Be Vietnam Pro', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          "font-variant-numeric": "lining-nums proportional-nums",
          "font-feature-settings": '"lnum" 1, "onum" 0, "zero" 0, "ss01" 0',
          "white-space": "nowrap",
        },
        ".num-tabular": {
          "font-family": "'Be Vietnam Pro', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          "font-variant-numeric": "lining-nums tabular-nums",
          "font-feature-settings": '"lnum" 1, "onum" 0, "zero" 0, "ss01" 0',
          "white-space": "nowrap",
        },
        ".num-kpi": {
          "font-family": "'Be Vietnam Pro', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          "font-size": "2rem",
          "font-weight": "600",
          "letter-spacing": "-0.02em",
          "font-variant-numeric": "lining-nums proportional-nums",
          "font-feature-settings": '"lnum" 1, "onum" 0, "zero" 0, "ss01" 0',
          "white-space": "nowrap",
        },
      });
    }),
  ],
};

export default config;
