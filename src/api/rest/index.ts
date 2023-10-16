import Elysia from 'elysia';

import health from './health';

export const RestMiddleware = new Elysia();

RestMiddleware.use(health);
