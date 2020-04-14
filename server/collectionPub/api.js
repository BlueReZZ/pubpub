import app, { wrap } from '../server';
import { getPermissions } from './permissions';
import { ForbiddenError } from '../errors';
import {
	createCollectionPub,
	updateCollectionPub,
	setPrimaryCollectionPub,
	destroyCollectionPub,
	getCollectionPubs,
} from './queries';

const getRequestIds = (req, argsFrom = req.body) => {
	const user = req.user || {};
	return {
		userId: user.id,
		pubId: argsFrom.pubId || null,
		collectionId: argsFrom.collectionId,
		communityId: argsFrom.communityId,
		collectionPubId: argsFrom.id,
	};
};

app.get(
	'/api/collectionPubs',
	wrap(async (req, res) => {
		try {
			const collectionPubs = await getCollectionPubs(getRequestIds(req, req.query));
			return res.status(201).json(collectionPubs);
		} catch (err) {
			return res.status(500).json(err);
		}
	}),
);

app.post(
	'/api/collectionPubs',
	wrap(async (req, res) => {
		const { collectionId, pubId, userId, communityId } = getRequestIds(req);
		const { rank, moveToTop } = req.body;
		const permissions = await getPermissions({
			communityId: communityId,
			collectionId: collectionId,
			userId: userId,
		});
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const collectionPub = await createCollectionPub({
			collectionId: collectionId,
			pubId: pubId,
			rank: rank,
			moveToTop: moveToTop,
		});
		return res.status(201).json(collectionPub);
	}),
);

app.put(
	'/api/collectionPubs/setPrimary',
	wrap(async (req, res) => {
		const { isPrimary } = req.body;
		const { collectionPubId, communityId, collectionId, userId } = getRequestIds(req);
		const permissions = await getPermissions({
			communityId: communityId,
			collectionId: collectionId,
			userId: userId,
		});
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const updated = await setPrimaryCollectionPub({
			collectionPubId: collectionPubId,
			isPrimary: isPrimary,
		});
		return res.status(200).json(updated);
	}),
);

app.put(
	'/api/collectionPubs',
	wrap(async (req, res) => {
		const { collectionPubId, communityId, collectionId, userId } = getRequestIds(req);
		const permissions = await getPermissions({
			communityId: communityId,
			collectionId: collectionId,
			userId: userId,
		});
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const updated = await updateCollectionPub(
			{ ...req.body, collectionPubId: collectionPubId },
			permissions.update,
		);
		return res.status(200).json(updated);
	}),
);

app.delete(
	'/api/collectionPubs',
	wrap(async (req, res) => {
		const { collectionPubId, communityId, collectionId, userId } = getRequestIds(req);
		const permissions = await getPermissions({
			communityId: communityId,
			collectionId: collectionId,
			userId: userId,
		});
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		await destroyCollectionPub({ collectionPubId: collectionPubId });
		return res.status(200).json(req.body.id);
	}),
);
