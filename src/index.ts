import { CustomerAPI } from './customer/api';
import { CustomerGroupAPI } from './customerGroup/api';
import { DocumentAPI } from './document/api';

export class EasybillClient {
  private static instanceMap: Map<string, EasybillClient> = new Map();

  private apiKey: string;

  public readonly customerAPI: CustomerAPI;

  public readonly customerGroupApi: CustomerGroupAPI;

  public readonly documentAPI: DocumentAPI;

  private constructor(apiKey: string) {
    const baseURL = 'https://api.easybill.de/rest/v1';

    this.apiKey = apiKey;
    this.customerAPI = new CustomerAPI(baseURL, apiKey);
    this.customerGroupApi = new CustomerGroupAPI(baseURL, apiKey);
    this.documentAPI = new DocumentAPI(baseURL, apiKey);
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
