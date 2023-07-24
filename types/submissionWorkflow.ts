import { SubmissionWorkflow as SubmissionWorkflowModel } from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';
// import { Collection, DocJson } from 'types';

export type SubmissionWorkflow = RecursiveAttributes<SubmissionWorkflowModel>;
// {
// 	id: string;
// 	createdAt: string;
// 	updatedAt: string;
// 	enabled: boolean;
// 	title: string;
// 	introText: DocJson;
// 	instructionsText: DocJson;
// 	acceptedText: DocJson;
// 	declinedText: DocJson;
// 	receivedEmailText: DocJson;
// 	targetEmailAddresses: string[];
// 	requireAbstract: boolean;
// 	requireDescription: boolean;
// 	collectionId: string;
// 	collection?: Collection;
// };
