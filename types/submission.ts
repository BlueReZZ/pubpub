import { Submission as SubmissionModel } from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';

export const managerStatuses = ['received', 'accepted', 'declined'] as const;
export const submitterStatuses = ['received'] as const;
export const initialStatuses = ['incomplete'] as const;

export const submissionStatuses = [
	...new Set([...initialStatuses, ...managerStatuses, ...submitterStatuses]),
] as const;

export type SubmissionStatus = (typeof submissionStatuses)[number];

export type Submission = RecursiveAttributes<SubmissionModel>;
export type SubmissionEmailKind = 'received' | 'accepted' | 'declined';
