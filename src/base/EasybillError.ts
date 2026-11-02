import { AxiosError } from 'axios';

/** Origin and path of the request; the query string is left out, it can hold customer numbers. */
function requestUrl({ baseURL = '', url = '' }: { baseURL?: string; url?: string }): string {
  const fullUrl = /^[a-z][\w+.-]*:/i.test(url)
    ? url
    : `${baseURL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
  return fullUrl.split(/[?#]/)[0];
}

const maxEasybillMessageLength = 500;

/**
 * The message of easybill's error body, e.g. "The number is already in use". Bodies of binary
 * requests such as PDF downloads come as a buffer.
 */
function getEasybillMessage(data: unknown): string | undefined {
  let body = data;
  if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
    try {
      body = JSON.parse(Buffer.from(body as ArrayBuffer).toString('utf8'));
    } catch {
      return undefined;
    }
  }
  if (typeof body !== 'object' || body === null) {
    return undefined;
  }
  const { message } = body as { message?: unknown };
  return typeof message === 'string' ? message.slice(0, maxEasybillMessageLength) : undefined;
}

export class EasybillError extends Error {
  /** The HTTP status, undefined when no response came back. */
  statusCode: number | undefined;

  displayName: string | undefined;

  /** axios' error code, e.g. ECONNREFUSED or ERR_BAD_REQUEST. */
  code: string | undefined;

  method: string | undefined;

  url: string | undefined;

  /** The message of easybill's error response, if it sent one. */
  easybillMessage: string | undefined;

  /**
   * Not enumerable: its request config holds the Authorization header with the API key, which
   * would otherwise end up wherever the error is printed or serialized.
   */
  declare readonly axiosError: AxiosError;

  constructor(
    message: string,
    statusCode: number | undefined,
    displayName: string | undefined,
    axiosError: AxiosError,
  ) {
    super(message);
    this.name = 'EasybillError';
    this.statusCode = statusCode;
    this.displayName = displayName;
    this.code = axiosError.code;
    this.method = axiosError.config?.method?.toUpperCase();
    this.url = axiosError.config ? requestUrl(axiosError.config) : undefined;
    this.easybillMessage = getEasybillMessage(axiosError.response?.data);
    Object.defineProperty(this, 'axiosError', { value: axiosError, enumerable: false });

    Error.captureStackTrace(this);
  }
}
