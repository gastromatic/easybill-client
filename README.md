# easybill-client

![Library](https://github.com/gastromatic/repo-badges/raw/main/svg/repo-kind/library.svg)

The easybill-client library provides convenient access to the Easybill API from applications written in server-side JavaScript.

## Errors and retries

The client logs nothing itself. A failed request throws an `EasybillError`; log it where you catch it. Besides the message it carries `statusCode` (undefined when no response came back), axios' error `code` (e.g. `ECONNREFUSED`), the `method`, the `url` without its query string, and the `easybillMessage` from easybill's error response (e.g. "The number is already in use"). Its `axiosError` is still available but not enumerable, so printing or serializing the error leaves out the request config with the API key.

Requests that get a 429 or 5xx response are retried up to 10 times. To log the retries, register a listener. It applies to all clients of the process, and `onRetry` returns a function that removes it again:

```ts
import { EasybillClient } from 'easybill-client';

EasybillClient.onRetry(({ statusCode, attempt, delayMs, method, url }) => {
  logger.warn({ statusCode, attempt, delayMs, method, url }, 'Retrying easybill request');
});
```

A listener that throws or rejects does not stop the retry.
