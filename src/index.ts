import { CustomerAPI } from './customer/api';
import { DocumentAPI } from './document/api';

export class EasybillClient {
  public readonly customerAPI: CustomerAPI;

  public readonly documentAPI: DocumentAPI;

  constructor(apiKey: string) {
    const baseURL = 'https://api.easybill.de/rest/v1';

    this.customerAPI = new CustomerAPI(baseURL, apiKey);
    this.documentAPI = new DocumentAPI(baseURL, apiKey);
  }
}

export * from './types';
