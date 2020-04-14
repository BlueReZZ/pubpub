import { Op } from 'sequelize';
import findRank from 'shared/utils/findRank';
import {
	Collection,
	CollectionPub,
	sequelize,
	Pub,
	Branch,
	CommunityAdmin,
	PubManager,
	BranchPermission,
} from '../models';
import { getCollectionPubsInCollection } from '../utils/collectionQueries';
import { getBranchAccess } from '../branch/permissions';

const canUserSeePub = (userId, pubData, isCommunityAdmin) =>
	pubData.branches.some((branch) =>
		getBranchAccess(
			null,
			branch,
			userId,
			isCommunityAdmin,
			pubData.managers.some((manager) => manager.userId === userId),
		),
	);

export const getCollectionPubs = async ({ collectionId, userId }) => {
	// TODO(ian): Figure out a good two-way collection <=> pub association
	// so we can do all of this with a single query.
	const [{ communityId }, collectionPubs] = await Promise.all([
		Collection.findOne({ where: { id: collectionId }, attributes: ['communityId'] }),
		CollectionPub.findAll({
			where: { collectionId: collectionId },
			attributes: ['pubId', 'rank'],
			order: [['rank', 'ASC']],
		}),
	]);
	const pubRanks = {};
	collectionPubs.forEach((cp) => {
		pubRanks[cp.pubId] = cp.rank;
	});
	const [communityAdmin, pubs] = await Promise.all([
		userId && CommunityAdmin.findOne({ where: { communityId: communityId, userId: userId } }),
		Pub.findAll({
			where: { id: { [Op.in]: collectionPubs.map((cp) => cp.pubId) } },
			include: [
				{
					model: Branch,
					as: 'branches',
					include: [{ model: BranchPermission, as: 'permissions' }],
				},
				{ model: PubManager, as: 'managers' },
			],
		}),
	]);
	return pubs
		.filter((pubData) => canUserSeePub(userId, pubData, !!communityAdmin))
		.sort((a, b) => {
			return pubRanks[a.id] > pubRanks[b.id] ? 1 : -1;
		});
};

export const createCollectionPub = ({ collectionId, pubId, rank, moveToTop = false }) => {
	return Promise.all([
		Collection.findOne({ where: { id: collectionId } }),
		CollectionPub.findAll({
			where: { pubId: pubId },
			include: [{ model: Collection, as: 'collection' }],
		}),
		getCollectionPubsInCollection(collectionId),
	]).then(([collection, pubLevelPeers, collectionLevelPeers]) => {
		// If this is the first non-tag collection in the bunch, make it the primary one
		const isPrimary =
			pubLevelPeers.filter((peer) => peer.collection.kind !== 'tag').length === 0 &&
			collection.kind !== 'tag' &&
			collection.isPublic;
		// If a rank wasn't provided, move the CollectionPub to the top or bottom of the collection
		let setRank = rank;
		if (!setRank) {
			const ranks = collectionLevelPeers.map((cp) => cp.rank).filter((r) => r);
			// eslint-disable-next-line no-param-reassign
			const targetIndex = moveToTop ? 0 : ranks.length;
			setRank = findRank(ranks, targetIndex);
		}
		return CollectionPub.create({
			collectionId: collectionId,
			pubId: pubId,
			rank: setRank,
			isPrimary: isPrimary,
		});
	});
};

export const setPrimaryCollectionPub = ({ collectionPubId, isPrimary }) => {
	return CollectionPub.findOne({
		where: { id: collectionPubId },
		include: [{ model: Collection, as: 'collection' }],
	}).then((collectionPub) => {
		return (
			(!collectionPubId || collectionPub.collection.isPublic) &&
			sequelize.transaction((txn) => {
				return CollectionPub.update(
					{ isPrimary: false },
					{
						transaction: txn,
						where: {
							pubId: collectionPub.pubId,
							id: { [Op.ne]: collectionPubId },
						},
					},
				).then(() => {
					return CollectionPub.update(
						{ isPrimary: isPrimary },
						{
							where: { id: collectionPubId },
							returning: true,
							transaction: txn,
						},
					);
				});
			})
		);
	});
};

export const updateCollectionPub = ({ collectionPubId, ...inputValues }, updatePermissions) => {
	// Filter to only allow certain fields to be updated
	const filteredValues = {};
	Object.keys(inputValues).forEach((key) => {
		if (updatePermissions.includes(key)) {
			filteredValues[key] = inputValues[key];
		}
	});

	return CollectionPub.update(filteredValues, {
		where: { id: collectionPubId },
		returning: true,
	}).then(() => {
		return filteredValues;
	});
};

export const destroyCollectionPub = ({ collectionPubId }) => {
	return CollectionPub.destroy({
		where: { id: collectionPubId },
	});
};
