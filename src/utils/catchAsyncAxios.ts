import { AxiosResponse } from 'axios';
import { EasybillError } from '../base/EasybillError';
import { log } from '../logger';

export async function catchAsyncAxios<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    let logMessage = error.message;
    // The request was made and the server responded with a status code
    if (error.response) {
      logMessage = JSON.stringify(
        {
          data: error.response.data,
          statusCode: error.response.status,
          headers: error.response.headers,
        },
        null,
        3,
      );
    } else if (error.request) {
      // The request was made but no response is received. Request is an instance of http.ClientRequest
      logMessage = JSON.stringify(
        {
          request: error.request,
        },
        null,
        3,
      );
    }

    log({ level: 'error', message: logMessage, label: 'EasybillAPI' });
    throw new EasybillError(
      error.message,
      error.response?.status,
      error.response?.statusText,
      error,
    );
  }
}
