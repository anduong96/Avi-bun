import * as ElysiaApollo from '@elysiajs/apollo';

import { ApolloLogPlugin } from '@app/lib/graphql/log.plugin';
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  plugins: [ApolloLogPlugin] as any,
});
