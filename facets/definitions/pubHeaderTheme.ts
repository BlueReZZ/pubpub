import { prop, facet, string, choice } from '../core';

const textStylePropType = choice(['dark', 'light', 'black-blocks', 'white-blocks']);

export const PubHeaderTheme = facet({
	name: 'PubHeaderTheme',
	label: 'Pub header theme',
	props: {
		backgroundImage: prop(string, { label: 'Background image', rootValue: null }),
		backgroundColor: prop(string, { label: 'Background color', rootValue: 'community' }),
		textStyle: prop(textStylePropType, { label: 'Text style', rootValue: 'light' }),
	},
});
