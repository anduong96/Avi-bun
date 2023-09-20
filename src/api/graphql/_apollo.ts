//TODO: Fix shitty code pulled from https://github.com/elysiajs/elysia-apollo/blob/main/src/index.ts
import type { Context, Elysia } from 'elysia';
import { t } from 'elysia';

import {
  ApolloServer,
  BaseContext,
  type ApolloServerOptions,
} from '@apollo/server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { type StartStandaloneServerOptions } from '@apollo/server/standalone';

export interface ServerRegistration<Path extends string = '/graphql'>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends Omit<StartStandaloneServerOptions<any>, 'context'> {
  path?: Path;
  enablePlayground: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: (context: Context) => Promise<any>;
}

export type ElysiaApolloConfig<
  Path extends string = '/graphql',
  TContext extends BaseContext = BaseContext,
> = ApolloServerOptions<TContext> &
  Omit<ServerRegistration<Path>, 'enablePlayground'> &
  Partial<Pick<ServerRegistration, 'enablePlayground'>>;

const getQueryString = (url: string) => url.slice(url.indexOf('?', 11) + 1);

export class ElysiaApolloServer<
  Context extends BaseContext = BaseContext,
> extends ApolloServer<Context> {
  public async createHandler<Path extends string = '/graphql'>({
    path = '/graphql' as Path,
    enablePlayground,
    context = async () => {},
  }: ServerRegistration<Path>) {
    const landing = enablePlayground
      ? ApolloServerPluginLandingPageGraphQLPlayground({
          endpoint: path,
        })
      : process.env.ENV === 'production'
      ? ApolloServerPluginLandingPageProductionDefault({
          footer: false,
        })
      : ApolloServerPluginLandingPageLocalDefault({
          footer: false,
        });

    await this.start();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const landingPage = await landing.serverWillStart!({}).then(r =>
      r?.renderLandingPage ? r.renderLandingPage().then(r => r.html) : null,
    );

    return (app: Elysia) => {
      if (landingPage)
        app.get(path, () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          return new Response(landingPage, {
            headers: {
              'Content-Type': 'text/html',
            },
          });
        });

      return app.post(
        path,
        c =>
          this.executeHTTPGraphQLRequest({
            httpGraphQLRequest: {
              method: c.request.method,
              body: c.body,
              search: getQueryString(c.request.url),
              request: c.request,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              headers: c.request.headers,
            },

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            context: () => context(c),
          })
            .then(res => {
              if (res.body.kind === 'complete')
                return new Response(res.body.string, {
                  status: res.status ?? 200,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  headers: res.headers,
                });

              return new Response('');
            })
            .catch(error => {
              if (error instanceof Error) throw error;

              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
              return new Response(error.message, { status: error.statusCode });
            }),
        {
          body: t.Object(
            {
              operationName: t.Optional(t.Union([t.String(), t.Null()])),
              query: t.String(),
              variables: t.Optional(
                t.Object(
                  {},
                  {
                    additionalProperties: true,
                  },
                ),
              ),
            },
            {
              additionalProperties: true,
            },
          ),
        },
      );
    };
  }
}

export const apollo = async <Path extends string = '/graphql'>({
  path,
  enablePlayground = process.env.ENV !== 'production',
  context,
  ...config
}: ElysiaApolloConfig<Path>) =>
  new ElysiaApolloServer(config).createHandler<Path>({
    context,
    path,
    enablePlayground,
  });
