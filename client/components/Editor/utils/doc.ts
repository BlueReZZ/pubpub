import { DOMParser, Node, Schema } from 'prosemirror-model';

import { DocJson } from 'types';

export const getEmptyDoc = () => {
	return { type: 'doc' as const, attrs: { meta: {} }, content: [{ type: 'paragraph' }] };
};

export const docIsEmpty = (doc: Node) => {
	if (doc.childCount === 0) {
		return true;
	}
	if (doc.childCount === 1) {
		const { isTextblock, content, attrs } = doc.firstChild!;
		return isTextblock && content.size === 0 && !attrs.textAlign;
	}
	return false;
};

export const getDocForHtmlString = (htmlString: string, schema: Schema) => {
	const wrapperElem = document.createElement('div');
	wrapperElem.innerHTML = htmlString;
	return DOMParser.fromSchema(schema).parse(wrapperElem);
};

export const jsonToNode = (doc: DocJson, schema: Schema) => {
	return Node.fromJSON(schema, doc);
};
