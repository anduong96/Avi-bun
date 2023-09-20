import { ApolloLogPlugin } from '@app/api/graphql/_plugins/log.plugin';
import { AuthChecker } from './_auth/auth.checker';
import { HealthResolver } from './health/health.resolver';
import { apollo } from './_apollo';
import { buildSchema } from 'type-graphql';
import { isDev } from '../../env';
import path from 'path';

const gqlSchema = await buildSchema({
  resolvers: [HealthResolver],
  authChecker: AuthChecker,
  emitSchemaFile: isDev
    ? path.resolve(import.meta.dir, '../../../', 'schema.graphql')
    : undefined,
});

export const GraphqlMiddleware = apollo({
  schema: gqlSchema,
  enablePlayground: false,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  plugins: [ApolloLogPlugin] as any,
});
