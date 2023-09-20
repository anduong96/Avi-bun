import '@app/api/rest';
import '@app/scheduler';
import 'reflect-metadata';

import { ENV, isDev } from './env';

import { Elysia } from 'elysia';
import { GraphqlMiddleware } from './api/graphql';
import { Logger } from './services/logger';
import { RestMiddleware } from '@app/api/rest';
import { Scheduler } from '@app/scheduler';
import { prisma } from './prisma';

await prisma.$connect();
await Scheduler.instance.start();

const app = new Elysia();

app.use(RestMiddleware);
app.use(GraphqlMiddleware);

app.listen(ENV.PORT, server => {
  if (isDev) {
    Logger.info(`Server listening on http://localhost:${server.port}/graphql`);
  }
});
