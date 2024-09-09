import { CustomerAPI } from './customer/api';
import { CustomerGroupAPI } from './customerGroup/api';
import { DocumentAPI } from './document/api';
import { DocumentPaymentAPI } from './documentPayment/api';

export class EasybillClient {
  private static instanceMap: Map<string, EasybillClient> = new Map();

  private apiKey: string;

  public readonly customerAPI: CustomerAPI;

  public readonly customerGroupAPI: CustomerGroupAPI;

  public readonly documentAPI: DocumentAPI;

  public readonly documentPaymentAPI: DocumentPaymentAPI;

  private constructor(apiKey: string) {
    const baseURL = 'https://api.easybill.de/rest/v1';

    this.apiKey = apiKey;
    this.customerAPI = new CustomerAPI(baseURL, apiKey);
    this.customerGroupAPI = new CustomerGroupAPI(baseURL, apiKey);
    this.documentAPI = new DocumentAPI(baseURL, apiKey);
    this.documentPaymentAPI = new DocumentPaymentAPI(baseURL, apiKey);
  }

  public static getInstance(apiKey: string): EasybillClient {
    let instance = EasybillClient.instanceMap.get(apiKey);
    if (!instance) {
      instance = new EasybillClient(apiKey);
      EasybillClient.instanceMap.set(apiKey, instance);
    }
    return instance;
  }
}

export * from './types';
