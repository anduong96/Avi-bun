import 'reflect-metadata';
import '@app/lib/sentry';
import '@app/scheduler';
import '@app/topic.listeners';
import '@app/firebase';

import { ENV, isDev } from './env';

import { Elysia } from 'elysia';
import { GraphqlMiddleware } from './api/graphql';
import { Logger } from './lib/logger';
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
    Logger.getSubLogger({ name: 'App' }).info(
      `Server listening on http://localhost:${server.port}/graphql`,
    );
  }
});

app.on('stop', async () => {
  await prisma.$disconnect();
});
