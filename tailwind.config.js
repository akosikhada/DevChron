/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3D2F7D",
        secondary: "#4A3B89",
        accent: "#6B4DE6",
        black: "#000000",
        white: "#FFFFFF",
        gray: "#9CA3AF",
        error: "#EF4444",
      },
      light: {
        primary: "#F5F3FF",
        secondary: "#F9F8FC",
        accent: "#EFE9FF",
        black: "#1F2937",
        white: "#FFFFFF",
        gray: "#F3F4F6",
        error: "#FEE2E2",
      },
      dark: {
        primary: "#251B4D",
        secondary: "#2E2059",
        accent: "#4C3392",
        black: "#F9FAFB",
        white: "#111827",
        gray: "#374151",
        error: "#EF4444",
      },
    },
  },
  plugins: [],
};
