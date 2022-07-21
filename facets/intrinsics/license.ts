import { z } from 'zod';

import { choice, prop, facet, propType } from '../lib';

const licenseKind = choice([
	'cc-by',
	'cc-0',
	'cc-by-nc',
	'cc-by-nd',
	'cc-by-nc-nd',
	'cc-by-nc-sa',
	'cc-by-sa',
	'copyright',
]);

const copyrightSelection = propType({
	name: 'copyrightSelection',
	schema: z.object({
		choice: z.enum(['infer-from-scope', 'choose-here']),
		year: z.nullable(z.number()),
	}),
	postgresType: 'jsonb',
});

export const License = facet({
	name: 'License',
	props: {
		kind: prop(licenseKind, { rootValue: 'cc-by' as const }),
		copyrightSelection: prop(copyrightSelection, {
			rootValue: { choice: 'infer-from-scope', year: null },
		}),
	},
});
