
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				natural: {
					100: "#F2FCE2",
					200: "#E0F0D0",
					300: "#C2E0A8",
					400: "#A4D080",
					500: "#8BBF5E",
					600: "#74A84D", // Added darker shades
					700: "#5E8C3F",
					800: "#496F31"
				},
				cream: {
					100: "#FEF7CD",
					200: "#FDF2B0",
					300: "#FCE680",
					400: "#FBD951" // Added darker shade
				},
				stone: {
					100: "#F5F5F5",
					200: "#E5E5E5",
					300: "#D4D4D4",
					400: "#A3A3A3",
					500: "#737373",
					600: "#525252",
					700: "#404040",
					800: "#262626",
					900: "#171717",
					950: "#0A0A0A", // Added darker shade
				},
				dark: {
					100: "#202124", // Dark surface
					200: "#1C1D21", // Darker surface
					300: "#18191D", // Card background
					400: "#111215", // Background
					500: "#0A0B0E"  // Darkest shade
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0", opacity: "0" },
					to: { height: "var(--radix-accordion-content-height)", opacity: "1" }
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
					to: { height: "0", opacity: "0" }
				},
				"fade-in": {
					"0%": {
						opacity: "0",
						transform: "translateY(10px)"
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)"
					}
				},
				"fade-out": {
					"0%": {
						opacity: "1",
						transform: "translateY(0)"
					},
					"100%": {
						opacity: "0",
						transform: "translateY(10px)"
					}
				},
				"scale-in": {
					"0%": {
						transform: "scale(0.95)",
						opacity: "0"
					},
					"100%": {
						transform: "scale(1)",
						opacity: "1"
					}
				},
				"scale-out": {
					from: { transform: "scale(1)", opacity: "1" },
					to: { transform: "scale(0.95)", opacity: "0" }
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" }
				},
				"slide-out-right": {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(100%)" }
				},
				"rotate-slow": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" }
				},
				"float": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" }
				},
				"pulse-gentle": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.85" }
				},
				"ripple": {
					"0%": { transform: "scale(0)", opacity: "1" },
					"100%": { transform: "scale(6)", opacity: "0" }
				},
				"parallax-slow": {
					"0%": { transform: "translateY(0)" },
					"100%": { transform: "translateY(-20px)" }
				},
				"parallax-medium": {
					"0%": { transform: "translateY(0)" },
					"100%": { transform: "translateY(-40px)" }
				},
				"parallax-fast": {
					"0%": { transform: "translateY(0)" },
					"100%": { transform: "translateY(-60px)" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.6s ease-out",
				"fade-out": "fade-out 0.6s ease-out",
				"scale-in": "scale-in 0.5s ease-out",
				"scale-out": "scale-out 0.5s ease-out",
				"slide-in-right": "slide-in-right 0.5s ease-out",
				"slide-out-right": "slide-out-right 0.5s ease-out",
				"rotate-slow": "rotate-slow 20s linear infinite",
				"float": "float 6s ease-in-out infinite",
				"pulse-gentle": "pulse-gentle 4s ease-in-out infinite",
				"ripple": "ripple 3s linear infinite",
				"enter": "fade-in 0.6s ease-out, scale-in 0.5s ease-out",
				"exit": "fade-out 0.6s ease-out, scale-out 0.5s ease-out",
				"parallax-slow": "parallax-slow 1s ease-out forwards",
				"parallax-medium": "parallax-medium 1s ease-out forwards",
				"parallax-fast": "parallax-fast 1s ease-out forwards"
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['"Playfair Display"', 'serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
