import moment from 'moment';
import { Kind } from 'graphql/language/kinds';
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
} from '@apollo/server';

import { isDev } from '@app/env';
import { Logger } from '@app/lib/logger';

import { ApolloServerContext } from '../_context/types';

const logger = Logger.getSubLogger({ name: 'Apollo Log' });

function getOps(context: GraphQLRequestContext<BaseContext>) {
  if (!context.document) {
    return null;
  }

  const operations: string[] = [];
  for (const def of context.document.definitions) {
    if (def.kind === Kind.OPERATION_DEFINITION) {
      for (const selection of def.selectionSet.selections) {
        if (selection.kind === Kind.FIELD) {
          operations.push(selection.name.value);
        }
      }
    }
  }

  return operations;
}

export const ApolloLogPlugin: ApolloServerPlugin<ApolloServerContext> = {
  async requestDidStart(requestContext) {
    const start = new Date();
    const request = requestContext.request;
    const query = request.query;
    const op = request.operationName;

    let shouldLog = false;

    if (op !== 'IntrospectionQuery' && !query?.includes('IntrospectionQuery')) {
      shouldLog = isDev;
    }

    return Promise.resolve({
      didEncounterErrors(requestContext) {
        const gqlError = requestContext.errors[0];
        const error = new Error(gqlError.message);
        error.stack = gqlError.stack;
        error.name = gqlError.name;
        error.cause = gqlError.cause;
        requestContext.document;
        logger.error(
          'GQL Error => User[%s] Transaction[%s] Op[%s]',
          requestContext.contextValue.user?.uid ?? 'UNKNOWN',
          requestContext.contextValue.transactionID,
          getOps(requestContext),
          error,
        );

        return Promise.resolve();
      },
      willSendResponse(context) {
        if (!shouldLog) {
          return Promise.resolve();
        } else if (context.errors) {
          return Promise.resolve();
        }

        const duration = moment.duration(moment().diff(start));

        logger.debug(
          'GQL Request => User[%s] Op[%s] Duration[%s ms]',
          requestContext.contextValue.user?.uid ?? 'UNKNOWN',
          getOps(requestContext),
          duration.asMilliseconds(),
        );

        return Promise.resolve();
      },
    });
  },
};
