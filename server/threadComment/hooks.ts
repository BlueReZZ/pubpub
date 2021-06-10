import * as types from 'types';
import { ThreadComment } from 'server/models';
import { createUserThreadSubscription } from 'server/userThreadSubscription/queries';

ThreadComment.afterCreate(async (threadComment: types.ThreadComment) => {
	await createUserThreadSubscription({
		userId: threadComment.userId,
		threadId: threadComment.threadId,
		createdAutomatically: true,
	});
});
