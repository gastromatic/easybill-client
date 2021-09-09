import { Requestable } from '../base/Requestable';
import { ResultList } from '../base/ResultList';
import { CreateDocumentParams, Document, GetDocumentsListParams, SendDocumentBody } from '../types';

export class DocumentAPI extends Requestable {
  getDocumentsList(
    params: GetDocumentsListParams = { limit: 100, page: 1 },
  ): Promise<ResultList<Document>> {
    return this.request<ResultList<Document>>({
      method: 'GET',
      url: '/documents',
      params,
    });
  }

  getDocument(documentId: number): Promise<Document> {
    return this.request<Document>({
      method: 'GET',
      url: `/documents/${documentId}`,
    });
  }

  createDocument(data: CreateDocumentParams): Promise<Document> {
    return this.request<Document>({
      method: 'POST',
      url: '/documents',
      data,
    });
  }

  updateDocument(documentId: number, data: CreateDocumentParams): Promise<Document> {
    return this.request<Document>({
      method: 'PUT',
      url: `/documents/${documentId}`,
      data,
    });
  }

  deleteDocument(documentId: number): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/documents/${documentId}`,
    });
  }

  completeDocument(documentId: number): Promise<Document> {
    return this.request<Document>({
      method: 'PUT',
      url: `/documents/${documentId}/done`,
    });
  }

  cancelDocument(documentId: number): Promise<Document> {
    return this.request<Document>({
      method: 'POST',
      url: `/documents/${documentId}/cancel`,
    });
  }

  sendDocument(
    documentId: number,
    config: {
      type: 'email' | 'fax' | 'post';
      body: SendDocumentBody;
    },
  ): Promise<void> {
    const { type, body } = config;

    return this.request<void>({
      method: 'POST',
      url: `/documents/${documentId}/send/${type}`,
      data: body,
    });
  }

  /**
   *
   * @returns the file's content as binary string
   */
  getDocumentPdf(documentId: number): Promise<string> {
    return this.request<string>({
      method: 'GET',
      url: `/documents/${documentId}/pdf`,
      headers: {
        accept: 'application/pdf',
      },
      responseType: 'arraybuffer',
    });
  }
}
