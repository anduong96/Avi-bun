import * as ElysiaApollo from '@elysiajs/apollo';

import { HealthResolver } from './health/health.resolver';
import { buildSchema } from 'type-graphql';
import { isDev } from '../../services/env';
import path from 'path';

const gqlSchema = await buildSchema({
  resolvers: [HealthResolver],
  emitSchemaFile: isDev
    ? path.resolve(import.meta.dir, '../../../', 'schema.graphql')
    : undefined,
});

export const GraphqlMiddleware = ElysiaApollo.apollo({
  schema: gqlSchema,
  enablePlayground: false,
  // plugins: compact([isDev && ApolloLogPlugin]),
});
