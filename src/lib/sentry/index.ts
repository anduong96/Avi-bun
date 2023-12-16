import { isEmpty } from 'lodash';
import * as _Sentry from '@sentry/bun';

import { ENV, isDev } from '@app/env';

_Sentry.init({
  dsn: ENV.SENTRY_DSN,
  enabled: !isDev && !isEmpty(ENV.SENTRY_DSN),
  environment: ENV.NODE_ENV,
  tracesSampleRate: 1.0,
});

export const Sentry = _Sentry;
