import { ApolloLogPlugin } from '@app/api/graphql/_plugins/log.plugin';
import Elysia from 'elysia';
import path from 'path';
import { buildSchema } from 'type-graphql';
import { isDev } from '../../env';
import { apollo } from './_apollo';
import { AuthChecker, AuthCheckerContext } from './_auth/auth.checker';
import { AirportResolver } from './resolvers/airport.resolver';
import { FlightResolver } from './resolvers/flight.resolver';
import { UserFlightResolver } from './resolvers/user.flights.resolver';
import { AirlineResolver } from './resolvers/airline.resolver';
import { DebugResolver } from './resolvers/_debug.resolver';
import { NoopResolver } from './resolvers/_noop.resolver';
import { FlightPromptnessResolver } from './resolvers/flight.promptness.resolver';

const emitSchemaFile = isDev
  ? path.resolve(import.meta.dir, '../../../', 'schema.graphql')
  : false;

const gqlSchema = await buildSchema({
  authChecker: AuthChecker,
  emitSchemaFile,
  resolvers: [
    isDev ? DebugResolver : NoopResolver,
    FlightResolver,
    FlightPromptnessResolver,
    AirportResolver,
    AirlineResolver,
    UserFlightResolver,
  ],
});

export const GraphqlMiddleware = new Elysia();

GraphqlMiddleware.use(
  apollo({
    path: '/graphql',
    schema: gqlSchema,
    plugins: [ApolloLogPlugin],
    context: ({ request }): AuthCheckerContext => {
      const authorization = request.headers.get('Authorization');
      return {
        authorization,
      };
    },
  }),
);
