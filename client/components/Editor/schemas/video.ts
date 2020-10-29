import { renderHtmlChildren } from '../utils/renderHtml';
import { counter } from './reactive/counter';
import { label } from './reactive/label';
import { buildLabel } from '../utils/references';
import { DOMOutputSpec } from 'prosemirror-model';
import { pruneFalsyValues } from 'utils/arrays';
import { withValue } from 'utils/fp';

export default {
	video: {
		atom: true,
		reactive: true,
		attrs: {
			id: { default: null },
			url: { default: null },
			size: { default: 50 }, // number as percentage
			align: { default: 'center' },
			caption: { default: '' },
			hideLabel: { default: false },
		},
		reactiveAttrs: {
			count: counter(),
			label: label(),
		},
		parseDOM: [
			{
				tag: 'figure',
				getAttrs: (node) => {
					if (node.getAttribute('data-node-type') !== 'video') {
						return false;
					}
					return {
						id: node.getAttribute('id') || null,
						url: node.firstChild.getAttribute('src') || null,
						size: Number(node.getAttribute('data-size')) || 50,
						align: node.getAttribute('data-align') || 'center',
						caption: node.firstChild.getAttribute('alt') || '',
					};
				},
			},
		],
		// @ts-expect-error ts-migrate(2525) FIXME: Initializer provides no value for this binding ele... Remove this comment to see the full error message
		toDOM: (node, { isReact } = {}) => {
			return [
				'figure',
				{
					...(node.attrs.id && { id: node.attrs.id }),
					'data-node-type': 'video',
					'data-size': node.attrs.size,
					'data-align': node.attrs.align,
				},
				[
					'video',
					{
						controls: 'true',
						preload: 'metadata',
						src: node.attrs.url,
						alt: node.attrs.caption,
					},
				],
				[
					'figcaption',
					{},
					pruneFalsyValues([
						'div',
						withValue(buildLabel(node), (label) => [
							'strong',
							{ spellcheck: 'false' },
							label,
						]),
						renderHtmlChildren(isReact, node.attrs.caption, 'div'),
					]),
				],
			] as DOMOutputSpec;
		},
		inline: false,
		group: 'block',

		/* These are not part of the standard Prosemirror Schema spec */
		onInsert: (view, attrs) => {
			const videoNode = view.state.schema.nodes.video.create(attrs);
			const transaction = view.state.tr.replaceSelectionWith(videoNode);
			view.dispatch(transaction);
		},
		defaultOptions: {},
	},
};