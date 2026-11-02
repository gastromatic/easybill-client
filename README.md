# easybill-client

![Library](https://github.com/gastromatic/repo-badges/raw/main/svg/repo-kind/library.svg)

The easybill-client library provides convenient access to the Easybill API from applications written in server-side JavaScript.

## Errors and retries

The client logs nothing itself. A failed request throws an `EasybillError` with the `statusCode`; log it where you catch it. Its `axiosError` is still available but not enumerable, so printing or serializing the error leaves out the request config with the API key.

Requests that get a 429 or 5xx response are retried up to 10 times. To log the retries, register a listener once per process:

```ts
import { EasybillClient } from 'easybill-client';

EasybillClient.onRetry(({ statusCode, attempt, delayMs }) => {
  logger.warn({ statusCode, attempt, delayMs }, 'Retrying easybill request');
});
```
