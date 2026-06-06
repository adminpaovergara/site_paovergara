import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        paper: "#f7f4ef",
        mist: "#dedbd4",
        graphite: "#595959",
        signal: "#9eefe0"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Inter", "Helvetica Neue", "Arial", "sans-serif"]
      },
      maxWidth: {
        frame: "1440px"
      }
    }
  },
  plugins: []
};

export default config;
