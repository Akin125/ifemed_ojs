export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1e3a8a",
          dark: "#1e40af",
          light: "#3b82f6",
        },
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
      },
    },
  },
};
