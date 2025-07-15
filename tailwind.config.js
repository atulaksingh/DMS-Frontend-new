/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#366FA1", // Custom primary color
        secondary: "#FFFFFF", // Custom white color
        accent: "#0D0D0D", // Custom black color
        // Add more custom colors as needed
      },
      screens: {
                 // Custom breakpoints
                 xs: "475px", // Extra small devices (mobile)
                 sm: "640px", // Small devices (tablets)
                 md: "768px", // Medium devices (large tablets/small desktops)
                 lg: "1024px", // Large devices (desktops)
                 xl: "1280px", // Extra-large devices
                 "2xl": "1536px", // Double extra-large devices
               },
               spacing: {
                 // Custom spacing utilities
                 18: "4.5rem", // Example for 72px
                 22: "5.5rem", // Example for 88px
               },
               fontSize: {
                 xs: "0.75rem", // 12px
                 sm: "0.875rem", // 14px
                 base: "1rem", // 16px
                 lg: "1.125rem", // 18px
                 xl: "1.25rem", // 20px
                 "2xl": "1.5rem", // 24px
                 "3xl": "1.875rem", // 30px
                 "4xl": "2.25rem", // 36px
                 "5xl": "3rem", // 48px
                 "6xl": "3.75rem", // 60px
              },
    },
  },
  plugins: [],
});







// /** @type {import('tailwindcss').Config} */
// const withMT = require("@material-tailwind/react/utils/withMT");

// module.exports = withMT({
//   content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#366FA1", // Custom primary color
//         secondary: "#FFFFFF", // Custom white color
//         accent: "#0D0D0D", // Custom black color
//         // Add more custom colors as needed
//       },
//       screens: {
//         // Custom breakpoints
//         xs: "475px", // Extra small devices (mobile)
//         sm: "640px", // Small devices (tablets)
//         md: "768px", // Medium devices (large tablets/small desktops)
//         lg: "1024px", // Large devices (desktops)
//         xl: "1280px", // Extra-large devices
//         "2xl": "1536px", // Double extra-large devices
//       },
//       spacing: {
//         // Custom spacing utilities
//         18: "4.5rem", // Example for 72px
//         22: "5.5rem", // Example for 88px
//       },
//       fontSize: {
//         xs: "0.75rem", // 12px
//         sm: "0.875rem", // 14px
//         base: "1rem", // 16px
//         lg: "1.125rem", // 18px
//         xl: "1.25rem", // 20px
//         "2xl": "1.5rem", // 24px
//         "3xl": "1.875rem", // 30px
//         "4xl": "2.25rem", // 36px
//         "5xl": "3rem", // 48px
//         "6xl": "3.75rem", // 60px
//       },
//     },
//   },
//   plugins: [
//     require("@tailwindcss/forms"), // For better form styling
//     require("@tailwindcss/aspect-ratio"), // For maintaining aspect ratios
//     require("@tailwindcss/typography"), // For better typography
//   ],
// });
