import axios, { AxiosResponse, ResponseType } from 'axios';
import Bottleneck from 'bottleneck';
import { log } from '../logger';
import { EasybillError } from './EasybillError';

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
  const { statusCode } = error;
  const isTooMuchRequestOrServerError = statusCode === 429 || String(statusCode).startsWith('5');
  if (isTooMuchRequestOrServerError && jobInfo.retryCount < maxNumberOfRetries) {
    log({
      level: 'warn',
      message: `Reason: "${error.message}". Retrying job ${jobInfo.options.id}`,
      label: 'requestable',
    });
    // retry maximal 10 times. The delay between each retry is set to double (starting at 10s) with each attempt, but not exceed 60 seconds.
    return Math.min(5000 * 2 ** (jobInfo.retryCount + 1), 60000);
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
    this.axiosInstance.defaults.headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${apiKey}`,
      'X-Easybill-Escape': true,
    };
  }

  protected request<T>(config: {
    method: HTTP_METHODS;
    url: string;
    params?: Record<string, unknown>;
    data?: Record<string, unknown>;
    headers?: Record<string, unknown>;
    responseType?: ResponseType;
  }): Promise<T> {
    const { method, url, params, data, headers, responseType } = config;

    return limiter.schedule(async () => {
      try {
        const res = await this.axiosInstance.request<T, AxiosResponse<T>>({
          method,
          url,
          data,
          params,
          headers,
          cancelToken: this.axiosCancelTokenSource.token,
          responseType,
        });
        return res.data;
      } catch (error: any) {
        // The request was made and the server responded with a status code
        if (error.response) {
          log({
            level: 'error',
            message: JSON.stringify(
              {
                data: error.response.data,
                statusCode: error.response.status,
                headers: error.response.headers,
              },
              null,
              3,
            ),
            label: 'EasybillAPI',
          });
        } else if (error.request) {
          // The request was made but no response is received. Request is an instance of http.ClientRequest
          log({
            level: 'error',
            message: JSON.stringify(
              {
                request: error.request,
              },
              null,
              3,
            ),
            label: 'EasybillAPI',
          });
        }

        throw new EasybillError(
          error.message,
          error.response?.status,
          error.response?.statusText,
          error,
        );
      }
    });
  }

  /**
   *  Cancel the request
   */
  cancel(message: string): void {
    this.axiosCancelTokenSource.cancel(message);
  }
}
