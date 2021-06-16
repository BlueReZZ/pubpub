import { Op } from 'sequelize';

import * as types from 'types';
import { UserNotification, UserSubscription } from 'server/models';
import { indexByProperty, splitArrayOn } from 'utils/arrays';
import { filterUsersWhoCanSeeThread } from 'server/thread/queries';

type ActivityItemResponder<Kind extends types.ActivityItemKind> = (
	item: types.ActivityItemOfKind<Kind>,
) => Promise<void>;

const createNotificationsForNewThreadComment = async (
	item: types.ActivityItemOfKind<'pub-discussion-comment-added' | 'pub-review-comment-added'>,
	includePubLevelSubscribers: boolean,
) => {
	const {
		actorId,
		pubId,
		payload: { threadId },
	} = item;

	const subscriptionWhereQueries = includePubLevelSubscribers
		? [{ pubId }, { threadId }]
		: [{ threadId }];

	const subscriptions: types.UserSubscription[] = await UserSubscription.findAll({
		where: { [Op.or]: subscriptionWhereQueries, userId: { [Op.not]: actorId } },
	});

	const [mutedThreadSubscriptions, unmutedThreadSubscriptions] = splitArrayOn(
		subscriptions.filter((sub) => !!sub.threadId),
		(s) => s.muted,
	);

	const unmutedPubSubscriptionsNotSupersededByThreadMute = subscriptions.filter(
		(sub) =>
			sub.pubId &&
			!sub.muted &&
			!mutedThreadSubscriptions.some((mutedSub) => mutedSub.userId === sub.userId),
	);

	const subscriptionsThatMayProduceNotifications = [
		...unmutedThreadSubscriptions,
		...unmutedPubSubscriptionsNotSupersededByThreadMute,
	];

	const subscriptionsByUserId = indexByProperty(
		subscriptionsThatMayProduceNotifications,
		'userId',
	);

	const userIdsToNotifty = await filterUsersWhoCanSeeThread({
		threadId,
		userIds: subscriptionsThatMayProduceNotifications.map((sub) => sub.userId),
	});

	await UserNotification.bulkCreate(
		userIdsToNotifty.map((userId) => {
			return {
				userId,
				userSubscriptionId: subscriptionsByUserId[userId].id,
				activityItemId: item.id,
			};
		}),
	);
};

const notificationCreatorsByKind: Partial<
	{ [Kind in types.ActivityItemKind]: ActivityItemResponder<Kind> }
> = {
	'pub-discussion-comment-added': (item) => createNotificationsForNewThreadComment(item, true),
	'pub-review-comment-added': (item) => createNotificationsForNewThreadComment(item, false),
};

export const getNotificationTask = (item: types.ActivityItem) => {
	const creator = notificationCreatorsByKind[item.kind] as ActivityItemResponder<any>;
	if (creator) {
		return () => creator(item);
	}
	return null;
};
