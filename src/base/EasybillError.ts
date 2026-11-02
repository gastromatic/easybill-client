import { AxiosError } from 'axios';

export class EasybillError extends Error {
  statusCode: number;

  displayName: string;

  /**
   * Not enumerable: its request config holds the Authorization header with the API key, which
   * would otherwise end up wherever the error is printed or serialized.
   */
  declare readonly axiosError: AxiosError;

  constructor(message: string, statusCode: number, displayName: string, axiosError: AxiosError) {
    super(message);
    this.name = 'EasybillError';
    this.statusCode = statusCode;
    this.displayName = displayName;
    Object.defineProperty(this, 'axiosError', { value: axiosError, enumerable: false });

    Error.captureStackTrace(this);
  }
}
