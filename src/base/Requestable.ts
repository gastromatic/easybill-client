import axios, { AxiosError, AxiosResponse, RawAxiosRequestHeaders, ResponseType } from 'axios';
import Bottleneck from 'bottleneck';
import { EasybillError } from './EasybillError';
import { notifyRetry } from './retryListener';

const limiter = new Bottleneck({
  reservoir: 50,
  reservoirRefreshAmount: 50,
  reservoirRefreshInterval: 60 * 1000,
  minTime: 500,
  maxConcurrent: 1,
});

const maxNumberOfRetries = 10;

function handleOnLimiterFailed(
  error: EasybillError,
  jobInfo: Bottleneck.EventInfoRetryable,
): number | null {
  const { statusCode, method, url } = error;
  const isTooMuchRequestOrServerError =
    statusCode !== undefined && (statusCode === 429 || (statusCode >= 500 && statusCode < 600));
  if (isTooMuchRequestOrServerError && jobInfo.retryCount < maxNumberOfRetries) {
    // retry maximal 10 times. The delay between each retry is set to double (starting at 10s) with each attempt, but not exceed 60 seconds.
    const delayMs = Math.min(5000 * 2 ** (jobInfo.retryCount + 1), 60000);
    notifyRetry({ statusCode, attempt: jobInfo.retryCount + 1, delayMs, method, url });
    return delayMs;
  }
  return null;
}

limiter.on('failed', handleOnLimiterFailed);

export type HTTP_METHODS = 'GET' | 'POST' | 'DELETE' | 'PUT';

export class Requestable {
  private axiosInstance = axios.create();

  private axiosCancelTokenSource = axios.CancelToken.source();

  constructor(baseURL: string, apiKey: string) {
    this.axiosInstance.defaults.baseURL = baseURL;
    this.axiosInstance.defaults.headers.common['Content-type'] = 'application/json;charset=UTF-8';
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
    this.axiosInstance.defaults.headers.common['X-Easybill-Escape'] = 'true';
  }

  protected request<T>(config: {
    method: HTTP_METHODS;
    url: string;
    params?: Record<string, unknown>;
    data?: Record<string, unknown>;
    headers?: RawAxiosRequestHeaders;
    responseType?: ResponseType;
  }): Promise<T> {
    const { method, url, params, data, headers, responseType } = config;

    return limiter.schedule(async () => {
      const res = await this.axiosInstance
        .request<T, AxiosResponse<T>>({
          method,
          url,
          data,
          params,
          headers,
          cancelToken: this.axiosCancelTokenSource.token,
          responseType,
        })
        .catch((error: AxiosError) => {
          // The request was made and the server responded with a status code
          if (error.response) {
            throw new EasybillError(
              error.message,
              error.response.status,
              error.response.statusText,
              error,
            );
          }
          // No response came back, or the request was never sent (e.g. cancelled). Without a
          // status code the limiter does not retry it.
          throw new EasybillError(error.message, undefined, undefined, error);
        });
      return res.data;
    });
  }

  /**
   *  Cancel the request
   */
  cancel(message: string): void {
    this.axiosCancelTokenSource.cancel(message);
  }
}
