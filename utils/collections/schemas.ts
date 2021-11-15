import { CollectionKind } from 'types';
import { collectionUrl } from 'utils/canonicalUrls';

import { CollectionSchema, MetadataField, MetadataType } from './types';

const dateRegex = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;

const dateType: MetadataType<Date> = {
	name: 'date',
	deserialize: (str) => {
		const [year, month, day] = dateRegex.exec(str)!.slice(1);
		const date = new Date();
		date.setFullYear(parseInt(year, 10));
		date.setMonth(parseInt(month, 10) - 1);
		date.setDate(parseInt(day, 10));
		return date;
	},
	validate: (str) => dateRegex.test(str),
	labelInfo: '(in YYYY-MM-DD format)',
};

const sharedFields: Record<string, MetadataField> = {
	doi: {
		name: 'doi',
		label: 'DOI',
		derivedFrom: ({ collection }) => collection && collection.doi,
		derivedLabelInfo: '(Registered and cannot be changed)',
	},
	url: {
		name: 'url',
		label: 'URL',
		defaultDerivedFrom: ({ community, collection }) =>
			community && collection && collection.id && collectionUrl(community, collection),
	},
};

const schemas: CollectionSchema[] = [
	{
		kind: 'tag',
		label: { singular: 'tag', plural: 'tags' },
		bpDisplayIcon: 'tag',
		metadata: [],
		contextHints: [],
	},
	{
		kind: 'issue',
		label: { singular: 'issue', plural: 'issues' },
		bpDisplayIcon: 'manual',
		contextHints: [{ value: 'article', label: 'Article', isDefault: true }],
		metadata: [
			sharedFields.doi,
			sharedFields.url,
			{ name: 'printIssn', label: 'Print ISSN' },
			{ name: 'electronicIssn', label: 'Electronic ISSN' },
			{ name: 'volume', label: 'Volume' },
			{ name: 'issue', label: 'Issue' },
			{ name: 'printPublicationDate', label: 'Print publication date', type: dateType },
			{
				name: 'publicationDate',
				label: 'Publication date',
				type: dateType,
			},
		],
	},
	{
		kind: 'book',
		label: { singular: 'book', plural: 'books' },
		bpDisplayIcon: 'book',
		contextHints: [
			{ value: 'foreword', label: 'Foreword', crossrefComponentType: 'section' },
			{ value: 'preface', label: 'Preface', crossrefComponentType: 'section' },
			{
				value: 'supplementaryMaterial',
				label: 'Supplementary Material',
				crossrefComponentType: 'reference_entry',
			},
			{
				value: 'chapter',
				label: 'Chapter',
				isDefault: true,
				crossrefComponentType: 'chapter',
			},
			{ value: 'appendix', label: 'Appendix', crossrefComponentType: 'reference_entry' },
			{ value: 'glossary', label: 'Glossary', crossrefComponentType: 'reference_entry' },
			{
				value: 'acknowledgements',
				label: 'Acknowledgements',
				crossrefComponentType: 'section',
			},
		],
		metadata: [
			sharedFields.doi,
			sharedFields.url,
			{ name: 'isbn', label: 'ISBN' },
			{ name: 'copyrightYear', label: 'Copyright year', pattern: '^[0-9]*$' },
			{ name: 'publicationDate', label: 'Publication date', type: dateType },
			{ name: 'edition', label: 'Edition no.', pattern: '^[0-9]*$' },
		],
	},
	{
		kind: 'conference',
		label: { singular: 'conference', plural: 'conferences' },
		bpDisplayIcon: 'presentation',
		contextHints: [{ value: 'paper', label: 'Paper', isDefault: true }],
		metadata: [
			sharedFields.doi,
			sharedFields.url,
			{ name: 'theme', label: 'Theme' },
			{ name: 'acronym', label: 'Acronym' },
			{ name: 'location', label: 'Location' },
			{ name: 'date', label: 'Date', type: dateType },
		],
	},
];

export type MetadataSchemaField = typeof schemas[number]['metadata'][number];

export default schemas;

export const getSchemaForKind = (kind: CollectionKind) => {
	const result = schemas.find((s) => s.kind === kind);
	if (result) {
		return result;
	}
	return null;
};

export const getIconForCollectionKind = (kind: CollectionKind) => {
	const schema = getSchemaForKind(kind);
	if (schema) {
		return schema.bpDisplayIcon;
	}
	return null;
};
