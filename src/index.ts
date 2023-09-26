import '@app/firebase';
import '@app/prisma';
import '@app/lib/sentry';
import '@app/scheduler';
import '@app/topic.listeners';
import 'reflect-metadata';

import { ENV, isDev } from './env';

import { RestMiddleware } from '@app/api/rest';
import { Scheduler } from '@app/scheduler';
import { Elysia } from 'elysia';
import { GraphqlMiddleware } from './api/graphql';
import { Logger } from './lib/logger';

await Scheduler.instance.start();

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
