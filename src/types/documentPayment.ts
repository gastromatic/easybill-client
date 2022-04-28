import { definitions, paths } from '../generated/types';

export type DocumentPayment = definitions['DocumentPayment'];
export type GetDocumentPaymentListParams =
  paths['/document-payments']['get']['parameters']['query'];
export type CreateDocumentPaymentParams =
  paths['/document-payments']['post']['parameters']['body']['body'];
