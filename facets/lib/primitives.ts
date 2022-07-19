import { z } from 'zod';

import { FacetPropType, propType } from './propType';

export const string = propType({
	name: 'varchar',
	schema: z.string(),
	postgresType: 'text',
});

export const boolean = propType({
	name: 'boolean',
	schema: z.boolean(),
	postgresType: 'boolean',
});

export const integer = propType({
	name: 'integer',
	schema: z.number().int(),
	postgresType: 'integer',
});

export const double = propType({
	name: 'double',
	schema: z.number(),
	postgresType: 'double',
});

export const choice = <T extends string, U extends [T, ...T[]]>(
	values: U,
): FacetPropType<z.ZodEnum<U>, { values: U }> => {
	return propType({
		identity: choice,
		schema: z.enum(values),
		postgresType: 'varchar',
		extension: { values },
	});
};

export const arrayOf = <PropType extends FacetPropType>(type: PropType) => {
	return propType({
		schema: z.array(type.schema),
		postgresType: 'jsonb',
	});
};