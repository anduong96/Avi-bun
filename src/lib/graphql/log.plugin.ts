import { ApolloServerPlugin, BaseContext } from '@apollo/server';

import { Logger } from '@app/services/logger';
import { isDev } from '@app/services/env';
import moment from 'moment';

const logger = Logger.child({ name: 'Apollo Log' });

export const ApolloLogPlugin: ApolloServerPlugin<BaseContext> = {
  // eslint-disable-next-line @typescript-eslint/require-await
  async requestDidStart(requestContext) {
    const start = new Date();
    const request = requestContext.request;
    const query = request.query;
    const op = request.operationName;

    let shouldLog = false;

    if (op !== 'IntrospectionQuery' && !query?.includes('IntrospectionQuery')) {
      shouldLog = isDev;
    }

    return {
      // eslint-disable-next-line @typescript-eslint/require-await
      async willSendResponse() {
        if (!shouldLog) {
          return;
        }

        const duration = moment.duration(moment().diff(start)).asMilliseconds();

        console.log({
          query,
          duration: `${duration} ms`,
        });
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      async didEncounterErrors(requestContext) {
        logger.error(query);
        logger.error(requestContext.errors[0]);
      },
    };
  },
};
