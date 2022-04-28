import { CustomerAPI } from './customer/api';
import { CustomerGroupAPI } from './customerGroup/api';
import { DocumentAPI } from './document/api';
import { DocumentPaymentAPI } from './documentPayment/api';
import { PositionAPI } from './position/api';
import { PositionGroupAPI } from './positionGroup/api';
import { TaskAPI } from './task/api';

export class EasybillClient {
  private static instanceMap: Map<string, EasybillClient> = new Map();

  private apiKey: string;

  public readonly customerAPI: CustomerAPI;

  public readonly customerGroupAPI: CustomerGroupAPI;

  public readonly documentAPI: DocumentAPI;

  public readonly documentPaymentAPI: DocumentPaymentAPI;

  public readonly taskAPI: TaskAPI;

  public readonly positionAPI: PositionAPI;

  public readonly positionGroupAPI: PositionGroupAPI;

  private constructor(apiKey: string) {
    const baseURL = 'https://api.easybill.de/rest/v1';

    this.apiKey = apiKey;
    this.customerAPI = new CustomerAPI(baseURL, apiKey);
    this.customerGroupAPI = new CustomerGroupAPI(baseURL, apiKey);
    this.documentAPI = new DocumentAPI(baseURL, apiKey);
    this.documentPaymentAPI = new DocumentPaymentAPI(baseURL, apiKey);
    this.taskAPI = new TaskAPI(baseURL, apiKey);
    this.positionAPI = new PositionAPI(baseURL, apiKey);
    this.positionGroupAPI = new PositionGroupAPI(baseURL, apiKey);
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
