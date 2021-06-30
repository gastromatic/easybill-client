import { definitions, paths } from '../generated/types';

export type Document = definitions['Document'];
export type DocumentPosition = definitions['DocumentPosition'];
export type GetDocumentsListParams = paths['/documents']['get']['parameters']['query'];
export type CreateDocumentParams = paths['/documents']['post']['parameters']['body']['body'];
export type SendDocumentBody =
  paths['/documents/{id}/send/{type}']['post']['parameters']['body']['body'];
