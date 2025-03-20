import type { Config } from "tailwindcss";

export default {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./features/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			// Les couleurs sont définies dans @theme inline dans globals.css
			// et sont accessibles via les variables CSS
		},
	},
	plugins: [],
} satisfies Config;
