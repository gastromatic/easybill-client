export interface EasybillRetry {
  /** The status code of the failed attempt: 429 or a 5xx. */
  statusCode: number;
  /** The number of the attempt that failed, starting at 1. */
  attempt: number;
  /** The delay until the next attempt. */
  delayMs: number;
}

let retryListener: ((retry: EasybillRetry) => void) | undefined;

export function setRetryListener(listener: ((retry: EasybillRetry) => void) | undefined): void {
  retryListener = listener;
}

export function notifyRetry(retry: EasybillRetry): void {
  try {
    retryListener?.(retry);
  } catch {
    // A failing listener must not stop the retry.
  }
}
