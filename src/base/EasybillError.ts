import { AxiosError } from 'axios';

export class EasybillError extends Error {
  statusCode: number;

  displayName: string;

  axiosError: AxiosError;

  constructor(message: string, statusCode: number, displayName: string, axiosError: AxiosError) {
    super(message);
    this.statusCode = statusCode;
    this.displayName = displayName;
    this.axiosError = axiosError;

    Error.captureStackTrace(this);
  }
}
