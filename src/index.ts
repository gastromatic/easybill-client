import { CustomerAPI } from './customer/api';
import { CustomerGroupAPI } from './customerGroup/api';
import { DocumentAPI } from './document/api';
import { addRetryListener, RetryListener } from './base/retryListener';

export class EasybillClient {
  private static instanceMap: Map<string, EasybillClient> = new Map();

  public readonly customerAPI: CustomerAPI;

  public readonly customerGroupAPI: CustomerGroupAPI;

  public readonly documentAPI: DocumentAPI;

  private constructor(apiKey: string) {
    const baseURL = 'https://api.easybill.de/rest/v1';

    this.customerAPI = new CustomerAPI(baseURL, apiKey);
    this.customerGroupAPI = new CustomerGroupAPI(baseURL, apiKey);
    this.documentAPI = new DocumentAPI(baseURL, apiKey);
  }

  /**
   * Calls the listener whenever a request is retried after a 429 or 5xx response. The rate limit
   * and the retries are shared by all clients of the process, so the listener applies to all of
   * them. Returns a function that removes the listener again.
   */
  public static onRetry(listener: RetryListener): () => void {
    return addRetryListener(listener);
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
export { EasybillError } from './base/EasybillError';
export type { EasybillRetry, RetryListener } from './base/retryListener';
