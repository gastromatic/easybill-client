import { definitions, paths } from '../generated/types';

export type DocumentPayment = definitions['DocumentPayments'];
export type GetDocumentPaymentsParams = paths['/document-payments']['get']['parameters']['query'];
export type CreateDocumentPaymentParams = paths['/document-payments']['post']['parameters']['body']['body'];