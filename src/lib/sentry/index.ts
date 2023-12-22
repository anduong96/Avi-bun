import { isEmpty } from 'lodash';
import * as _Sentry from '@sentry/bun';

import { ENV } from '@app/env';

import { Logger } from '../logger';

const isEnabled = !isEmpty(ENV.SENTRY_DSN);
if (isEnabled) {
  Logger.getSubLogger({ name: 'Sentry' }).info('Sentry is enabled');
}

_Sentry.init({
  dsn: ENV.SENTRY_DSN,
  enabled: isEnabled,
  environment: ENV.NODE_ENV,
  // @see https://github.com/oven-sh/bun/issues/7472
  integrations: int => int.filter(i => !['BunServer', 'Http'].includes(i.name)),
  release: process.env.COMMIT_SHA || ENV.NODE_ENV,
  tracesSampleRate: 1.0,
});

export const Sentry = _Sentry;
