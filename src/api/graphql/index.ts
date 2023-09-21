import { AirportResolver } from './resolvers/airport.resolver';
import { ApolloLogPlugin } from '@app/api/graphql/_plugins/log.plugin';
import { AuthChecker } from './_auth/auth.checker';
import { FlightResolver } from './resolvers/flight.resolver';
import { HealthResolver } from './health/health.resolver';
import { UserFlightResolver } from './resolvers/user.flights.resolver';
import { apollo } from './_apollo';
import { buildSchema } from 'type-graphql';
import { isDev } from '../../env';
import path from 'path';

const emitSchemaFile = isDev
  ? path.resolve(import.meta.dir, '../../../', 'schema.graphql')
  : undefined;

const gqlSchema = await buildSchema({
  authChecker: AuthChecker,
  emitSchemaFile,
  resolvers: [
    HealthResolver,
    FlightResolver,
    AirportResolver,
    UserFlightResolver,
  ],
});

export const GraphqlMiddleware = apollo({
  schema: gqlSchema,
  plugins: [ApolloLogPlugin],
});
