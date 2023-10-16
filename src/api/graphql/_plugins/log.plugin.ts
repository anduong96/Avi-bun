import moment from 'moment';
import { ApolloServerPlugin } from '@apollo/server';

import { isDev } from '@app/env';
import { Logger } from '@app/lib/logger';

import { ApolloServerContext } from '../_context/types';

const logger = Logger.getSubLogger({ name: 'Apollo Log' });

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
        logger.error(
          'GQL Error => User[%s] Op[%s]',
          requestContext.contextValue.user?.uid ?? 'UNKNOWN',
          op,
          requestContext.errors[0],
          query,
        );

        return Promise.resolve();
      },
      willSendResponse() {
        if (!shouldLog) {
          return Promise.resolve();
        }

        logger.debug(
          'GQL Reqest => User[%s] Op[%s] Duration[%s ms]',
          requestContext.contextValue.user?.uid ?? 'UNKNOWN',
          op,
          moment.duration(moment().diff(start)).asMilliseconds(),
        );

        return Promise.resolve();
      },
    });
  },
};
