import { CustomerAPI } from './customer/api';
import { DocumentAPI } from './document/api';

export class EasybillClient {
  private static instance: EasybillClient;

  private apiKey: string;

  public readonly customerAPI: CustomerAPI;

  public readonly documentAPI: DocumentAPI;

  private constructor(apiKey: string) {
    const baseURL = 'https://api.easybill.de/rest/v1';

    this.apiKey = apiKey;
    this.customerAPI = new CustomerAPI(baseURL, apiKey);
    this.documentAPI = new DocumentAPI(baseURL, apiKey);
  }

  public static getInstance(apiKey: string): EasybillClient {
    if (!EasybillClient.instance) {
      EasybillClient.instance = new EasybillClient(apiKey);
    }
    if (EasybillClient.instance.apiKey !== apiKey) {
      throw new Error('Easybill client cannot have different api keys');
    }
    return EasybillClient.instance;
  }
}

export * from './types';
