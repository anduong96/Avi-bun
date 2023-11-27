import path from 'path';
import Elysia from 'elysia';
import { buildSchema } from 'type-graphql';
import { ApolloServer, HeaderMap } from '@apollo/server';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';

import { ApolloLogPlugin } from '@app/api/graphql/_plugins/log.plugin';

import { isDev } from '../../env';
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
import { UserPreferenceResolver } from './resolvers/user.preference.resolver';
import { AirportWeatherResolver } from './resolvers/airport.weather.resolver';
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
    AirportWeatherResolver,
    AirlineResolver,
    AircraftResolver,
    AircraftPositionResolver,
    UserFlightResolver,
    UserPreferenceResolver,
    UserResolver,
  ],
});

const apollo = new ApolloServer({
  plugins: [
    ApolloLogPlugin,
    ApolloSentryPlugin,
    isDev
      ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
      : ApolloServerPluginLandingPageProductionDefault({ footer: false }),
  ],
  schema: gqlSchema,
});

// server
function getQueryString(url: string) {
  return url.slice(url.indexOf('?', 11) + 1);
}

export const GraphqlMiddleware = new Elysia()
  .on('start', () => apollo.start())
  .all('/graphql', async context => {
    const method = context.request.method;
    const search = getQueryString(context.request.url);
    const body = context.body;
    const headers = context.request.headers as unknown as HeaderMap;
    const result = await apollo.executeHTTPGraphQLRequest({
      context: () => createApolloContext(context),
      httpGraphQLRequest: {
        body,
        headers,
        method,
        search,
      },
    });

    if (result.body.kind === 'complete') {
      if (method === 'GET') {
        return new Response(result.body.string, {
          headers: {
            'Content-Type': 'text/html',
          },
        });
      }

      return new Response(result.body.string, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        headers: result.headers as unknown as HeadersInit,
        status: result.status ?? 200,
      });
    }
  });
