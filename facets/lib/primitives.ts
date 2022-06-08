import { z } from 'zod';
import { DataTypes } from 'sequelize';

import { propType } from './propType';

export const string = propType({
	name: 'string',
	schema: z.string(),
	postgresType: DataTypes.TEXT,
});

export const boolean = propType({
	name: 'boolean',
	schema: z.boolean(),
	postgresType: DataTypes.BOOLEAN,
});

export const integer = propType({
	name: 'integer',
	schema: z.number().int(),
	postgresType: DataTypes.INTEGER,
});

export const double = propType({
	name: 'double',
	schema: z.number(),
	postgresType: DataTypes.DOUBLE,
});

export const oneOf = <T extends string, U extends readonly [T, ...T[]]>(strings: U) => {
	return propType({
		schema: z.enum(strings),
		postgresType: DataTypes.STRING,
	});
};
