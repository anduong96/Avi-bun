import { ApolloServerPlugin } from '@apollo/server';
import { Sentry } from '@app/lib/sentry';
import { applyIpScopeToSentry } from '@app/lib/sentry/apply.ip.scope';
import { applyUserScopeToSentry } from '@app/lib/sentry/apply.user.scope';
import assert from 'assert';
import { ApolloServerContext } from '../_context/types';

export const ApolloSentryPlugin: ApolloServerPlugin<ApolloServerContext> = {
  async requestDidStart(context) {
    assert(
      context.contextValue.sentryTransaction,
      'Context has no sentryTransaction',
    );

    applyIpScopeToSentry(context.contextValue.ipAddress);
    applyUserScopeToSentry(context.contextValue.user);

    if (context.operationName) {
      context.contextValue.sentryTransaction.setName(context.operationName);
    }

    return Promise.resolve({
      async executionDidStart() {
        return Promise.resolve({
          willResolveField({ info, contextValue }) {
            const span = contextValue.sentryTransaction.startChild({
              op: 'resolver',
              description: `${info.parentType.name}.${info.fieldName}`,
            });

            return () => {
              span.finish();
            };
          },
        });
      },
      async willSendResponse() {
        context.contextValue.sentryTransaction.finish();
        return Promise.resolve();
      },
      async didEncounterErrors({ operation, errors, request }) {
        if (!operation) {
          for (const error of errors) {
            Sentry.withScope(scope => {
              scope.setExtra('query', request.query);
              Sentry.captureException(error);
            });
          }

          return Promise.resolve();
        }

        for (const error of errors) {
          Sentry.withScope(scope => {
            scope.setTransactionName(context.contextValue.transactionID);

            scope.setTag('kind', operation.operation);
            scope.setExtra('query', request.query);
            scope.setExtra('variables', request.variables);

            if (error.path) {
              scope.addBreadcrumb({
                level: 'debug',
                category: 'query-path',
                message: error.path.join(' > '),
              });
            }

            Sentry.captureException(error);
          });
        }

        return Promise.resolve();
      },
    });
  },
};
