import React from 'react';
import { useUpdateEffect } from 'react-use';

import { usePageContext } from 'utils/hooks';
import { getDashUrl } from 'utils/dashboard';
import { AttributionEditor, DashboardFrame, FacetEditor, SettingsSection } from 'components';

// TODO(ian): this should probably be moved somewhere else, but not sure where yet
import { pruneFalsyValues } from 'utils/arrays';
import { ALL_INTRINSIC_FACETS } from 'facets';
import { useCollectionState } from '../../DashboardOverview/CollectionOverview/collectionState';

import CollectionDetailsEditor from './CollectionDetailsEditor';
import CollectionMetadataEditor from './CollectionMetadataEditor';
import DashboardSettingsFrame, { Subtab } from '../DashboardSettingsFrame';

const CollectionSettings = () => {
	const {
		communityData,
		scopeData: {
			elements: { activeCollection },
		},
	} = usePageContext();
	const { collection, updateCollection, deleteCollection, slugStatus, hasChanges } =
		useCollectionState(activeCollection!);

	useUpdateEffect(() => {
		if (!hasChanges) {
			window.history.replaceState(
				{},
				'',
				getDashUrl({ collectionSlug: collection.slug, mode: 'settings' }),
			);
		}
	}, [collection.slug, hasChanges]);

	const tabs: Subtab[] = pruneFalsyValues([
		{
			id: 'general',
			title: 'General',
			icon: 'settings',
			sections: [
				<CollectionDetailsEditor
					slugStatus={slugStatus}
					communityData={communityData}
					collection={collection}
					onUpdateCollection={updateCollection}
					onDeleteCollection={() =>
						deleteCollection().then(() => {
							window.location.href = getDashUrl({});
						})
					}
				/>,
			],
		},
		collection.kind !== 'tag' && {
			id: 'contributors',
			title: 'Contributors',
			pubPubIcon: 'contributor',
			sections: [
				<SettingsSection title="Attribution" id="attribution" showTitle={false}>
					<AttributionEditor
						apiRoute="/api/collectionAttributions"
						canEdit={true}
						hasEmptyState={false}
						attributions={collection.attributions!}
						listOnBylineText="List on Collection byline"
						identifyingProps={{
							collectionId: collection.id,
							communityId: communityData.id,
						}}
						onUpdateAttributions={(attributions) => updateCollection({ attributions })}
					/>
				</SettingsSection>,
			],
		},
		collection.kind !== 'tag' && {
			id: 'metadata',
			title: 'Metadata',
			icon: 'heat-grid',
			sections: [
				<SettingsSection title="Metadata" id="metadata" showTitle={false}>
					<CollectionMetadataEditor
						collection={collection}
						communityData={communityData}
						onUpdateCollection={updateCollection}
					/>
				</SettingsSection>,
			],
		},
		collection.kind !== 'tag' && {
			id: 'pub-defaults',
			title: 'Pub settings',
			pubPubIcon: 'pub',
			sections: ALL_INTRINSIC_FACETS.map((facetName) => (
				<FacetEditor key={facetName} facetName={facetName} />
			)),
		},
	]);

	return (
		<DashboardSettingsFrame
			id="collection-settings"
			className="collection-settings-component"
			tabs={tabs}
			hasChanges={false}
			persist={() => Promise.resolve()}
		/>
	);
};

export default CollectionSettings;
