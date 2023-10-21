import 'reflect-metadata';

import '@app/prisma';
import '@app/firebase';
import '@app/scheduler';
import '@app/lib/sentry';
import '@app/topic.listeners';

import { Elysia } from 'elysia';

import { RestMiddleware } from '@app/api/rest';

import { ENV, isDev } from './env';
import { Logger } from './lib/logger';
import { GraphqlMiddleware } from './api/graphql';

const app = new Elysia();

app.use(GraphqlMiddleware);
app.use(RestMiddleware);

app.listen(ENV.PORT, server => {
  if (isDev) {
    Logger.info(`Server listening on http://localhost:${server.port}/graphql`);
  }
});

app.on('error', event => {
  Logger.error('Encountered an error %s \n', event.code, event.error);
});
