import daisyui from 'daisyui';
import tailwindTypography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'class',

	theme: {
		extend: {}
	},

	plugins: [tailwindTypography, daisyui],
	daisyui: {
		logs: false
	}
};

module.exports = config;
