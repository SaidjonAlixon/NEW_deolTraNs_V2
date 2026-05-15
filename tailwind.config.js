/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /** Semantic surfaces (HSL tokens from index.css — 3 themes: default / day / night) */
        app: {
          DEFAULT: 'hsl(var(--app) / <alpha-value>)',
        },
        'app-deep': {
          DEFAULT: 'hsl(var(--app-deep) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
        },
        'header-bar': {
          DEFAULT: 'hsl(var(--header-bar) / <alpha-value>)',
        },
        navy: {
          900: '#0B0F17',
          800: '#141B2A',
          700: '#1e293b',
          600: '#334155',
        },
        orange: {
          DEFAULT: '#fd0a07',
          dark: '#d60906',
        },
        gray: {
          light: '#A7B1C8',
          DEFAULT: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        '2xl': '1rem',
        '3xl': '1.125rem',
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 24px 70px rgba(0, 0, 0, 0.45)",
        button: "0 10px 30px rgba(0, 0, 0, 0.35)",
        glow: "0 0 40px rgba(253, 10, 7, 0.2)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        /** Hero Apply Now — red pulse + expanding ring */
        "hero-apply-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow:
              "0 6px 26px rgba(253, 10, 7, 0.5), 0 0 0 0 rgba(253, 10, 7, 0.45)",
          },
          "55%": {
            transform: "scale(1.04)",
            boxShadow:
              "0 14px 40px rgba(253, 10, 7, 0.65), 0 0 0 14px rgba(253, 10, 7, 0)",
          },
        },
        "hero-arrow-nudge": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(5px)" },
        },
        /** Hero Get in touch — warm gradient shift + glow */
        "hero-get-in-touch": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
            boxShadow:
              "0 6px 28px rgba(234, 88, 12, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            boxShadow:
              "0 14px 42px rgba(253, 10, 7, 0.5), 0 0 28px rgba(251, 191, 36, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
          },
        },
        "hero-shine-sweep": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        /** Navbar CTA — soft pulse + expanding teal ring */
        "cta-breathe": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow:
              "0 8px 22px rgba(13, 148, 136, 0.38), 0 0 0 0 rgba(45, 212, 191, 0.5)",
          },
          "45%": {
            transform: "scale(1.045)",
            boxShadow:
              "0 14px 34px rgba(14, 165, 233, 0.45), 0 0 0 10px rgba(45, 212, 191, 0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "hero-apply-pulse": "hero-apply-pulse 2.4s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        "hero-arrow-nudge": "hero-arrow-nudge 1.5s ease-in-out infinite",
        "hero-get-in-touch": "hero-get-in-touch 3.2s ease-in-out infinite",
        "hero-shine-sweep": "hero-shine-sweep 2.6s ease-in-out infinite",
        "cta-breathe": "cta-breathe 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addVariant }) {
      addVariant('day-theme', 'html[data-theme="day"] &');
      addVariant('dark-theme', 'html[data-theme="night"] &');
    }
  ],
}
