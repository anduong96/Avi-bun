import { env } from 'bun';

import { isEmpty } from 'lodash';
import * as _Sentry from '@sentry/bun';

import { ENV, isProd, isStaging } from '@app/env';

_Sentry.init({
  dsn: ENV.SENTRY_DSN,
  enabled: (isStaging || isProd) && !isEmpty(ENV.SENTRY_DSN),
  environment: env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export const Sentry = _Sentry;
