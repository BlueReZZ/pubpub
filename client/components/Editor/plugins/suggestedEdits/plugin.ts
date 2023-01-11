import { Plugin, PluginKey, Transaction } from 'prosemirror-state';

import { SuggestedEditsPluginState } from './types';
import { appendTransactionForSuggestedEdits } from './transactions';

export const suggestedEditsPluginKey = new PluginKey('suggested-edits');

export default () => {
	return new Plugin<SuggestedEditsPluginState>({
		key: suggestedEditsPluginKey,
		appendTransaction: appendTransactionForSuggestedEdits,
		view: () => {
			return {
				update: (view) => {
					(window as any).editorView = view;
				},
			};
		},
		state: {
			init: () => {
				return { isEnabled: false };
			},
			apply: (tr: Transaction, pluginState: SuggestedEditsPluginState) => {
				const meta = tr.getMeta(suggestedEditsPluginKey);
				if (meta?.updatedState) {
					return {
						...pluginState,
						...meta.updatedState,
					};
				}
				return pluginState;
			},
		},
	});
};