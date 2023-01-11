// @ts-expect-error (TableView is exported by this package but not present in its .d.ts definitions)
import { TableView as BaseTableView } from 'prosemirror-tables';

import { buildLabel } from '../utils';

export class TableView extends BaseTableView {
	constructor(node, ...rest) {
		super(node, ...rest);
		this.sync(node);
	}

	update(node, decorations) {
		const shouldUpdate = super.update(node, decorations);
		this.sync(node);
		return shouldUpdate;
	}

	syncCaption(node) {
		const { dom } = this as any as { dom: HTMLElement };
		const label = buildLabel(node);
		const table = dom.querySelector('table');
		if (table) {
			const existingCaption = table.querySelector('caption');
			if (existingCaption && existingCaption.parentNode === table) {
				existingCaption.remove();
			}
			if (label) {
				const caption = document.createElement('caption');
				caption.innerHTML = label;
				table.append(caption);
			}
		}
	}

	syncAttributes(node) {
		const {
			id,
			suggestionAction,
			suggestionId,
			suggestionUserId,
			suggestionTimestamp,
			suggestionDiscussionId,
			suggestionOriginalAttrs,
		} = node.attrs;
		const { dom } = this as any as { dom: HTMLElement };
		dom.setAttribute('id', id);
		dom.setAttribute('data-suggestion-action', suggestionAction);
		dom.setAttribute('data-suggestion-id', suggestionId);
		dom.setAttribute('data-suggestion-user-id', suggestionUserId);
		dom.setAttribute('data-suggestion-timestamp', suggestionTimestamp);
		dom.setAttribute('data-suggestion-discussion-id', suggestionDiscussionId);
		dom.setAttribute('data-suggestion-original-attrs', suggestionOriginalAttrs);
	}

	sync(node) {
		this.syncAttributes(node);
		this.syncCaption(node);
	}
}
