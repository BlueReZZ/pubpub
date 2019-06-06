import React, { useContext, useState } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { pubDataProps } from 'types/pub';
import { GridWrapper } from 'components';
import { PageContext } from 'components/PageWrapper/PageWrapper';
import { apiFetch } from 'utils';

const propTypes = {
	pubData: pubDataProps.isRequired,
};

const PubMerge = (props) => {
	const { pubData } = props;
	const { locationData, communityData } = useContext(PageContext);
	const [isLoading, setIsLoading] = useState(false);
	const sourceBranch = pubData.branches.find((branch) => {
		return branch.shortId === Number(locationData.params.fromBranchShortId);
	});
	const destinationBranch = pubData.branches.find((branch) => {
		return branch.shortId === Number(locationData.params.toBranchShortId);
	});

	const mergeBranch = () => {
		setIsLoading(true);
		return apiFetch('/api/reviews/merge', {
			method: 'POST',
			body: JSON.stringify({
				sourceBranchId: sourceBranch.id,
				destinationBranchId: destinationBranch.id,
				pubId: pubData.id,
				communityId: communityData.id,
			}),
		})
			.then(() => {
				window.location.href = `/pub/${pubData.slug}/branch/${destinationBranch.shortId}`;
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<GridWrapper containerClassName="pub pub-merge-component">
			<h1>Merge</h1>
			<p>
				{sourceBranch.title} -> {destinationBranch.title}
			</p>

			<Button
				intent={Intent.PRIMARY}
				text={`Merge into #${destinationBranch.title}`}
				loading={isLoading}
				onClick={mergeBranch}
			/>
		</GridWrapper>
	);
};

PubMerge.propTypes = propTypes;
export default PubMerge;
