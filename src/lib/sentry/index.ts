import { ENV, isProd, isStaging } from '@app/env';
import * as _Sentry from '@sentry/bun';
import { isEmpty } from 'lodash';

_Sentry.init({
  enabled: (isStaging || isProd) && !isEmpty(ENV.SENTRY_DSN),
  dsn: ENV.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

export const Sentry = _Sentry;
