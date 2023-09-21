import 'reflect-metadata';
import '@app/scheduler';
import '@app/topic.listeners';

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

app.use(GraphqlMiddleware);
app.use(RestMiddleware);

app.listen(ENV.PORT, server => {
  if (isDev) {
    Logger.info(`Server listening on http://localhost:${server.port}/graphql`);
  }
});
