import axios, { AxiosResponse } from 'axios';
import Bottleneck from 'bottleneck';
import { log } from '../logger';
import { catchAsyncAxios } from '../utils/catchAsyncAxios';
import { EasybillError } from './EasybillError';

const limiter = new Bottleneck({
  reservoir: 50,
  reservoirRefreshAmount: 50,
  reservoirRefreshInterval: 60 * 1000,
  minTime: 500,
  maxConcurrent: 1,
});

const maxNumberOfRetries = 6;

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
    // retry maximal 6 times. The delay between each retry is set to double (starting at 2000ms) with each attempt, but not exceed 30 seconds.
    return Math.min(1000 * 2 ** (jobInfo.retryCount + 1), 30000);
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
  }): Promise<T> {
    const { method, url, params, data, headers } = config;

    const promise = catchAsyncAxios<T>(
      this.axiosInstance.request<T, AxiosResponse<T>>({
        method,
        url,
        data,
        params,
        headers,
        cancelToken: this.axiosCancelTokenSource.token,
      }),
    );

    return limiter.schedule(() => promise);
  }

  /**
   *  Cancel the request
   */
  cancel(message: string): void {
    this.axiosCancelTokenSource.cancel(message);
  }
}
