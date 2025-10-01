import borderGradient from './plugins/border-gradient';
import dynamicSize from './plugins/dynamic-size';

import type { Config } from 'tailwindcss';

export default {
	content: ['./app/**/*.{css,js,ts,tsx,html}'],
	theme: {},
	plugins: [
		dynamicSize,
		borderGradient,
		({ addVariant }) => {
			addVariant('collapsed', '&:is([data-state="collapsed"] *)');
			addVariant('menu-item-hover', '.menu-item:hover &');
		},
	],
} satisfies Config;
