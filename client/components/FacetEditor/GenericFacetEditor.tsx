import React, { useCallback } from 'react';
import classNames from 'classnames';

import {
	FacetDefinition,
	FacetProp,
	FacetPropCascadeResult,
	FacetSourceScope,
	mapFacet,
	FacetCascadeNotImplError,
} from 'facets';

import {
	FacetPropSourceInfo,
	GenericFacetEditorProps,
	PropTypeEditorComponent,
	PropTypeEditorProps,
} from './types';
import FacetPropEditorSkeleton from './FacetPropEditorSkeleton';

require('./facetEditor.scss');

function getPropSourceInfo<Prop extends FacetProp>(
	prop: Prop,
	currentScope: FacetSourceScope,
	cascadeResult: FacetPropCascadeResult<Prop>,
): FacetPropSourceInfo {
	const { sources } = cascadeResult;
	const contributingScopes = sources.filter((s) => s.value !== null).map((s) => s.scope);
	const lowestContributingScope = contributingScopes[contributingScopes.length - 1];
	const isValueLocal = lowestContributingScope?.id === currentScope.id;
	if (prop.cascade === 'overwrite') {
		return {
			isValueLocal,
			contributingScopes: [lowestContributingScope],
		};
	}
	throw new FacetCascadeNotImplError(prop.cascade);
}

function GenericFacetEditor<Def extends FacetDefinition>(props: GenericFacetEditorProps<Def>) {
	const {
		cascadeResult,
		currentScope,
		description,
		facetDefinition,
		onUpdateValue,
		propEditors,
		displayStyle,
	} = props;
	const { props: cascadedProps, value: facetValue } = cascadeResult;
	const { name, label } = facetDefinition;

	const renderPropEditor = useCallback(
		(key, prop: FacetProp) => {
			const { propType } = prop;
			const PropEditor: PropTypeEditorComponent<any> = propEditors[key]!;
			const propCascadeResult = cascadedProps[key];
			const { value } = propCascadeResult;

			const propSourceInfo = getPropSourceInfo(prop, currentScope, propCascadeResult);
			const onUpdatePropValue = (newValue) => onUpdateValue({ [key]: newValue } as any);

			const renderProps: PropTypeEditorProps<any> = {
				value,
				prop,
				propType,
				facetValue,
				propSourceInfo,
				onUpdateValue: onUpdatePropValue,
			};

			return (
				<FacetPropEditorSkeleton
					displayStyle={displayStyle}
					label={prop.label}
					onReset={() => onUpdatePropValue(null)}
					propSourceInfo={propSourceInfo}
				>
					<PropEditor key={key} {...renderProps} />
				</FacetPropEditorSkeleton>
			);
		},
		[propEditors, cascadedProps, currentScope, facetValue, onUpdateValue, displayStyle],
	);

	const propEditorsByName = mapFacet(facetDefinition, renderPropEditor);

	const descriptionNode =
		displayStyle === 'settings' ? (
			<div className="description">{description}</div>
		) : (
			<details className="description">
				<summary>Description</summary>
				{description}
			</details>
		);

	return (
		<div
			className={classNames(
				'facet-editor-component',
				displayStyle === 'settings' && 'settings-style',
			)}
		>
			<div className="gradient" />
			<div className="title-area">
				<div className="name">{label ?? name}</div>
			</div>
			{description && descriptionNode}
			<div className="prop-editors">{Object.values(propEditorsByName)}</div>
		</div>
	);
}

export default GenericFacetEditor;