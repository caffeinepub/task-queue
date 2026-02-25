/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50:  'oklch(0.97 0.01 240)',
          100: 'oklch(0.92 0.03 240)',
          200: 'oklch(0.82 0.05 240)',
          300: 'oklch(0.68 0.07 240)',
          400: 'oklch(0.55 0.09 240)',
          500: 'oklch(0.42 0.10 240)',
          600: 'oklch(0.32 0.10 240)',
          700: 'oklch(0.25 0.09 240)',
          800: 'oklch(0.20 0.08 240)',
          900: 'oklch(0.15 0.07 240)',
        },
        sky: {
          50:  'oklch(0.97 0.04 220)',
          100: 'oklch(0.93 0.07 220)',
          200: 'oklch(0.86 0.11 220)',
          300: 'oklch(0.76 0.14 220)',
          400: 'oklch(0.66 0.17 220)',
          500: 'oklch(0.60 0.18 220)',
          600: 'oklch(0.52 0.17 220)',
          700: 'oklch(0.44 0.15 220)',
          800: 'oklch(0.36 0.12 220)',
          900: 'oklch(0.28 0.09 220)',
        },
        surface: {
          50:  'oklch(0.98 0.005 240)',
          100: 'oklch(0.95 0.01 240)',
          200: 'oklch(0.90 0.015 240)',
        },
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        modal: '0 20px 60px -10px rgba(0,0,0,0.25)',
        nav: '0 1px 0 0 rgba(255,255,255,0.05)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
