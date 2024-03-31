import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      colors: {
        'primary': '#13678A',
        'secondary': '#45C4B0',
        'secondary-h': '#65F4E0',
        'accent': '#DAFDBA',
        'background': '#F5F5F5',
        'text': '#012030',
        'border': '#012030',
        'error': '#FF8E8E',
        'success': '#9AEBA3',
        'warning': '#F9D94C',
        'info': '#2E2E4D',
      },
    },
  },
  plugins: []
};
export default config;

/*
'Primary': The main color used for branding and important elements.
'Secondary': A supporting color that complements the primary color.
'Accent': A color used for emphasis or to draw attention to specific elements.
'Background': The color of the background, often in light and dark variations for light and dark modes.
'Text': The color of text, usually in light and dark variations for readability in different modes.
'Border': The color of borders and dividers between elements.
'Error': A color used to indicate errors or warnings.
'Success': A color used to indicate success or positive feedback.
'Warning': A color used to indicate warnings or alerts.
'Info': A color used to provide informational messages.
*/