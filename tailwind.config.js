const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  theme: {
    container: {
      center: true,
      //padding on sides of container
      padding: {
        DEFAULT: ".5rem",
        sm: ".5rem",
        md: "1rem",
        lg: "2.5rem",
        xl: "3rem",
        "2xl": "3.5rem",
      },
      //container widths
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1440px",
        "2xl": "1792px",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
      "2xl": "1792px",
    },
    extend: {
      colors: {
        primary: {
          text: "#000",
          background: "#000",
        },
        secondary: {
          text: "#000",
          background: "#000",
        },
        gray: {
          DEFAULT: "#EFF2F5",
          600: "#CAD2DD",
          700: "#B4B4B4",
        },
        purple: "#6200FF",
        purpleLight: "#CDAEFF",
        lime: "#89FF00",
        limeLight: "#CBFF8F",
        orange: "#FF4800",
        orangeLight: "#FFAE8E",
        error: {
          DEFAULT: "red",
        },
      },
      fontFamily: {
        primary: ["var(--font-body)"],
        secondary: ["var(--font-headings)"],
      },
        fontSize: {
          h1: ["clamp(3rem, 5vw, 5rem)", "4.875rem"], // Mobile: 48px, Desktop: 80px
          h2: ["clamp(2.5rem, 4vw, 3.75rem)", "3.625rem"], // Mobile: 40px, Desktop: 60px
          h3: ["clamp(2.25rem, 3vw, 3rem)", "3rem"], // Mobile: 36px, Desktop: 48px
          h4: ["clamp(1.5rem, 2.5vw, 2.5rem)", "2.5rem"], // Mobile: 24px, Desktop: 40px
          h5: ["clamp(1.5rem, 2vw, 1.875rem)", "2.375rem"], // Mobile: 24px, Desktop: 30px
          h6: ["clamp(1.25rem, 1.5vw, 2.25rem)", "2.25rem"], // Mobile: 20px, Desktop: 36px
          data: ["clamp(3.75rem, 6vw, 4.688rem)", "4.5rem"], // Mobile: 60px, Desktop: 75px
          quote: ["clamp(1.5rem, 2.5vw, 2.25rem)", "2.75rem"], // Mobile: 24px, Desktop: 36px
          "big-body": ["clamp(2rem, 3vw, 2.75rem)", "3.25rem"], // Mobile: 32px, Desktop: 44px
          body: ["clamp(1.125rem, 1.5vw, 1.375rem)", "2.5rem"], // Mobile: 18px, Desktop: 22px
          "body-small": ["clamp(0.875rem, 1vw, 1rem)", "1.875rem"], // Mobile: 14px, Desktop: 16px
          "body-xsmall": ["clamp(0.75rem, 1vw, 1rem)", "1.125rem"], // Mobile: 12px, Desktop: 14px
          button: ["clamp(1rem, 1.5vw, 1.5rem)", "1.5rem"], // Mobile: 16px, Desktop: 24px
        },
        
      spacing: {
        30: "1.875rem", // 30px
        60: "3.75rem", // 60px
        120: "7.5rem", // 120px
      },
      animation: {
        "fade-in": "fade-in .6s linear normal",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      aspectRatio: {
        portrait: "9 / 16",
        landscape: "3 / 2",
      },
    },
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
