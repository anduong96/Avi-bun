import type { Context, Elysia } from 'elysia';

import { t } from 'elysia';
import assert from 'assert';
import { type StartStandaloneServerOptions } from '@apollo/server/standalone';
import {
  ApolloServer,
  type ApolloServerOptions,
  BaseContext,
  GraphQLServerContext,
  HeaderMap,
} from '@apollo/server';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';

import { isDev } from '@app/env';

import { ApolloServerContext } from '../_context/types';

export interface ServerRegistration<Path extends string = '/graphql'>
  extends Omit<StartStandaloneServerOptions<BaseContext>, 'context'> {
  context?: (context: Context) => Promise<object> | object;
  enablePlayground: boolean;
  path?: Path;
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
  public async createHandler<Path extends string>({
    context = () => Promise.resolve({}),
    enablePlayground = isDev,
    path = '/graphql' as Path,
  }: ServerRegistration<Path>) {
    const landing = enablePlayground
      ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
      : ApolloServerPluginLandingPageProductionDefault({ footer: false });

    await this.start();

    assert(typeof landing.serverWillStart === 'function', 'No serverWillStart');
    const listenerCtx = {} as GraphQLServerContext;
    const listener = await landing.serverWillStart(listenerCtx);
    assert(typeof listener === 'object', 'No listener');
    assert(
      typeof listener.renderLandingPage === 'function',
      'No renderLandingPage',
    );

    const landingPage = await listener.renderLandingPage();
    const html =
      typeof landingPage.html === 'string'
        ? landingPage.html
        : await landingPage.html();

    return (app: Elysia) => {
      if (html)
        app.get(path, () => {
          return new Response(html, {
            headers: {
              'Content-Type': 'text/html',
            },
          });
        });

      return app.post(
        path,
        c => {
          return this.executeHTTPGraphQLRequest({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            context: () => context(c),
            httpGraphQLRequest: {
              body: c.body,
              headers: c.request.headers as unknown as HeaderMap,
              method: c.request.method,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              request: c.request,
              search: getQueryString(c.request.url),
            },
          })
            .then(res => {
              if (res.body.kind === 'complete')
                return new Response(res.body.string, {
                  headers: res.headers as unknown as HeadersInit,
                  status: res.status ?? 200,
                });

              return new Response('');
            })
            .catch(error => {
              if (error instanceof Error) {
                throw error;
              }
            });
        },
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
  context,
  enablePlayground = process.env.ENV !== 'production',
  path,
  ...config
}: ElysiaApolloConfig<Path, ApolloServerContext>) =>
  new ElysiaApolloServer(config).createHandler<Path>({
    context,
    enablePlayground,
    path,
  });
