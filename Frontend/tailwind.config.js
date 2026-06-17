import frappeui from "frappe-ui/tailwind";

const defaultTheme = require("tailwindcss/defaultTheme");
export default {
	presets: [frappeui],
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts}",
		"./node_modules/frappe-ui/src/**/*.{vue,js,ts}",
	],
	theme: {
		extend: {
			fontFamily: {
				// This overrides the default font-sans to use Roboto globally
				sans: ["Roboto", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [],
};
