import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark surface stack — Xtract-style near-black palette
        bg:      "#070708",
        bg2:     "#0E0E11",
        bg3:     "#16161B",
        bg4:     "#1F1F26",
        line:    "#22222A",
        ink:     "#FAFAFA",
        ink2:    "#B4B4BE",
        ink3:    "#7A7A85",
        muted:   "#4A4A52",
        // Warm amber/rust accent — avoids the standard purple AI-agency gradient
        accent:  "#FF7A3C",
        accent2: "#FFB47A",
        accent3: "#D2491F",
        accent4: "#7A1F0A",
        gold:    "#E9C46A",
      },
      fontFamily: {
        sans:    ['"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ['"Geist Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        eyebrow:  ["0.72rem", { lineHeight: "1", letterSpacing: "0.18em" }],
        hero:     ["clamp(2.75rem, 7vw, 6.25rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        h1:       ["clamp(2rem, 4.5vw, 3.5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        h2:       ["clamp(1.5rem, 2.5vw, 2.25rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(60% 50% at 50% 0%, rgba(255,122,60,0.25) 0%, rgba(255,122,60,0.05) 45%, transparent 75%)",
        "card-glow":
          "radial-gradient(120% 80% at 50% 0%, rgba(255,122,60,0.12) 0%, transparent 60%)",
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      boxShadow: {
        card:    "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 0 0 1px rgba(255,255,255,0.04)",
        "card-hi": "0 1px 0 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px -20px rgba(255,122,60,0.25)",
        btn:     "0 1px 0 0 rgba(255,255,255,0.12) inset, 0 0 0 1px rgba(255,255,255,0.06), 0 10px 30px -10px rgba(255,122,60,0.5)",
      },
      keyframes: {
        "rise-in": { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        marquee:   { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "pulse-dot": { "0%,100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: "0.6", transform: "scale(0.9)" } },
        shimmer:   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        "rise-in":   "rise-in 0.7s cubic-bezier(.2,.7,.2,1) both",
        "fade-in":   "fade-in 0.6s ease-out both",
        marquee:     "marquee 40s linear infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        shimmer:     "shimmer 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
