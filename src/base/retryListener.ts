export interface EasybillRetry {
  /** The status code of the failed attempt: 429 or a 5xx. */
  statusCode: number;
  /** The number of the attempt that failed, starting at 1. */
  attempt: number;
  /** The delay until the next attempt. */
  delayMs: number;
  method: string | undefined;
  /** Origin and path of the request, without the query string. */
  url: string | undefined;
}

export type RetryListener = (retry: EasybillRetry) => void | Promise<void>;

let retryListener: RetryListener | undefined;

export function setRetryListener(listener: RetryListener | undefined): void {
  retryListener = listener;
}

/** A failing listener, sync or async, must not stop the retry or crash the process. */
export function notifyRetry(retry: EasybillRetry): void {
  try {
    const result = retryListener?.(retry);
    if (result && typeof result.then === 'function') {
      result.then(undefined, () => undefined);
    }
  } catch {
    // ignored, see above
  }
}
