import { Requestable } from '../base/Requestable';
import { ResultList } from '../base/ResultList';
import {
  CreateDocumentPaymentParams,
  DocumentPayment,
  GetDocumentPaymentListParams,
} from '../types';

export class DocumentPaymentAPI extends Requestable {
  getDocumentPaymentList(
    params: GetDocumentPaymentListParams = { limit: 100, page: 1 },
  ): Promise<ResultList<DocumentPayment>> {
    return this.request<ResultList<DocumentPayment>>({
      method: 'GET',
      url: '/document-payments',
      params,
    });
  }

  getDocumentPayment(documentPaymentId: number): Promise<DocumentPayment> {
    return this.request<DocumentPayment>({
      method: 'GET',
      url: `/document-payments/${documentPaymentId}`,
    });
  }

  createDocumentPayment(data: CreateDocumentPaymentParams): Promise<DocumentPayment> {
    return this.request<DocumentPayment>({
      method: 'POST',
      url: '/document-payments',
      data,
    });
  }

  deleteDocumentPayment(documentPaymentId: number): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/document-payments/${documentPaymentId}`,
    });
  }
}
