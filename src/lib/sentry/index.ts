import * as _Sentry from '@sentry/bun';

import { ENV } from '@app/env';

_Sentry.init({
  dsn: ENV.SENTRY_DSN,
  enabled: false,
  environment: ENV.NODE_ENV,
  tracesSampleRate: 1.0,
});

export const Sentry = _Sentry;
