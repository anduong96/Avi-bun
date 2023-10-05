import { ApolloLogPlugin } from '@app/api/graphql/_plugins/log.plugin';
import Elysia from 'elysia';
import path from 'path';
import { buildSchema } from 'type-graphql';
import { isDev } from '../../env';
import { apollo } from './_apollo';
import { validateApolloAuth } from './_auth/validate.auth';
import { createApolloContext } from './_context/create.context';
import { ApolloSentryPlugin } from './_plugins/sentry.plugin';
import { DebugResolver } from './resolvers/_debug.resolver';
import { NoopResolver } from './resolvers/_noop.resolver';
import { AirlineResolver } from './resolvers/airline.resolver';
import { AirportResolver } from './resolvers/airport.resolver';
import { FlightPromptnessResolver } from './resolvers/flight.promptness.resolver';
import { FlightResolver } from './resolvers/flight.resolver';
import { UserFlightResolver } from './resolvers/user.flights.resolver';
import { AircraftResolver } from './resolvers/aircraft.resolver';
import { AircraftPositionResolver } from './resolvers/aircraft.position.resolver';

const emitSchemaFile = isDev
  ? path.resolve(import.meta.dir, '../../../', 'schema.graphql')
  : false;

const gqlSchema = await buildSchema({
  emitSchemaFile,
  authChecker: validateApolloAuth,
  resolvers: [
    isDev ? DebugResolver : NoopResolver,
    FlightResolver,
    FlightPromptnessResolver,
    AirportResolver,
    AirlineResolver,
    AircraftResolver,
    AircraftPositionResolver,
    UserFlightResolver,
  ],
});

export const GraphqlMiddleware = new Elysia().use(
  apollo({
    path: '/graphql',
    schema: gqlSchema,
    plugins: [ApolloLogPlugin, ApolloSentryPlugin],
    context: createApolloContext,
  }),
);
