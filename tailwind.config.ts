import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/redux/**/*.{js,ts,jsx,tsx}",
    "./src/utils/**/*.{js,ts,jsx,tsx}",
    "./src/actions/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-medium": "float 6s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-10px) translateX(5px)" },
        },
      },

      colors: {
        primary: "#121212",
        secondary: "#179AE0",
        orange: "#FF7300",
        // green: "#026C34",
        // gray: "#E1E1E1",
        grayText: "#65778A",
        lightGreen: "#79DE90",
        bordered: "#1212121A",
        lightGray: "#9AA4B2",
        grayDark: "#7C7C7C",
        borderColor: "#A1B0CC",
        Cgreen: "#8DD3BB",
        gray2: "#737373",
        grayBorder: "#D8D8D8",
      },
      fontFamily: {
        // cairo: ["var(--font-cairo)", "sans-serif"],
        // montserrat: ["var(--font-montserrat)", "sans-serif"],
        almarai: ["var(--font-almarai)", "sans-serif"],
      },
      backgroundImage: {
        heroFligthsBanner: "url('/assets/images/hero-hotels.jpg')",
        heroHotelsBanner: "url('/assets/hero-flights.webp')",
        greenGradient:
          "linear-gradient(58.16deg, #016733 -6.21%, #1C1466 103.2%)",
        heroCard: "url('/assets/images/hero-card.png')",
        footerBanner: "url('/assets/images/footer-banner.png')",
      },
    },
  },
  plugins: [],
};

export default config;
