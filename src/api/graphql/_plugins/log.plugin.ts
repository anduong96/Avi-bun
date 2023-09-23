import { ApolloServerPlugin } from '@apollo/server';

import { isDev } from '@app/env';
import { Logger } from '@app/lib/logger';
import moment from 'moment';
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
      willSendResponse() {
        if (!shouldLog) {
          return Promise.resolve();
        }

        const duration = moment.duration(moment().diff(start)).asMilliseconds();
        logger.debug('Duration %s ms %s', duration, query);

        return Promise.resolve();
      },
      didEncounterErrors(requestContext) {
        logger.error(requestContext.errors[0], query);
        return Promise.resolve();
      },
    });
  },
};
