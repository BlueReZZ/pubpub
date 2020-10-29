import { Hooks } from '@pubpub/prosemirror-reactive/dist/store/types';
import { Node } from 'prosemirror-model';
import { NodeLabelMap, ReferenceableNodeType } from '../../types';

import { isNodeLabelEnabled } from '../../utils';

export const counter = (counterType?: string, nodeFingerprintFn?) => {
	const hasFingerprint = !!nodeFingerprintFn;

	return function(this: Hooks, node: Node) {
		const { nodeLabels } = this.useDocumentState();
		const nodeLabel = (nodeLabels as NodeLabelMap)[node.type.name as ReferenceableNodeType];
		const resolvedCounterType = counterType || nodeLabel?.text;
		const counterState = this.useTransactionState(
			resolvedCounterType ? ['counter', resolvedCounterType] : ['counter'],
			{
				countsMap: {},
				maxCount: 0,
			},
		);

		if (hasFingerprint) {
			const fingerprint = JSON.stringify(nodeFingerprintFn(node));
			if (!counterState.countsMap[fingerprint]) {
				counterState.maxCount++;
				counterState.countsMap[fingerprint] = counterState.maxCount;
			}
			return counterState.countsMap[fingerprint];
		}

		if (!isNodeLabelEnabled(node, nodeLabels)) {
			return null;
		}

		counterState.maxCount++;

		return counterState.maxCount;
	};
};