import path from 'path';
import Elysia from 'elysia';
import { buildSchema } from 'type-graphql';

import { ApolloLogPlugin } from '@app/api/graphql/_plugins/log.plugin';

import { isDev } from '../../env';
import { apollo } from './_apollo';
import { UserResolver } from './resolvers/user.resolver';
import { NoopResolver } from './resolvers/_noop.resolver';
import { validateApolloAuth } from './_auth/validate.auth';
import { DebugResolver } from './resolvers/_debug.resolver';
import { FlightResolver } from './resolvers/flight.resolver';
import { ApolloSentryPlugin } from './_plugins/sentry.plugin';
import { AirlineResolver } from './resolvers/airline.resolver';
import { AirportResolver } from './resolvers/airport.resolver';
import { createApolloContext } from './_context/create.context';
import { AircraftResolver } from './resolvers/aircraft.resolver';
import { UserFlightResolver } from './resolvers/user.flights.resolver';
import { FlightPromptnessResolver } from './resolvers/flight.promptness.resolver';
import { AircraftPositionResolver } from './resolvers/aircraft.position.resolver';

const emitSchemaFile = isDev
  ? path.resolve(import.meta.dir, '../../../', 'schema.graphql')
  : false;

const gqlSchema = await buildSchema({
  authChecker: validateApolloAuth,
  emitSchemaFile,
  resolvers: [
    isDev ? DebugResolver : NoopResolver,
    FlightResolver,
    FlightPromptnessResolver,
    AirportResolver,
    AirlineResolver,
    AircraftResolver,
    AircraftPositionResolver,
    UserFlightResolver,
    UserResolver,
  ],
});

export const GraphqlMiddleware = new Elysia().use(
  apollo({
    context: createApolloContext,
    path: '/graphql',
    plugins: [ApolloLogPlugin, ApolloSentryPlugin],
    schema: gqlSchema,
  }),
);
