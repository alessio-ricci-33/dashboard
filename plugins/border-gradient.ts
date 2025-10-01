import plugin from 'tailwindcss/plugin';

export default plugin(({ addUtilities, matchUtilities, theme }) => {
	matchUtilities(
		{
			// @ts-ignore
			'border-gradient': value => {
				let [color, turn1, color2, turn2] = value.split(' ');

				if (!color2) color2 = color;
				if (!turn1) turn1 = '0.39';
				if (!turn2) turn2 = '0.89';

				return {
					'z-index': 10,
					content: '""',
					position: 'absolute',
					inset: 0,
					width: '100%',
					height: '100%',
					'border-radius': 'inherit',
					padding: '1px',
					'-webkit-mask':
						'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
					'-webkit-mask-composite': 'xor',
					'mask-composite': 'exclude',
					'pointer-events': 'none',
					background: `conic-gradient(from 188deg at 50% 50%, #5a5a5a .26turn, ${color}, #4f4f4f ${turn1}turn,  #5a5a5a .85turn, ${color2}, #535353 ${turn2}turn,  #5a5a5a 1turn)`,
				};
			},
		},
		{
			values: theme('borderColor', {}),
			type: 'any', // This allows any value inside the brackets
		}
	);
});
