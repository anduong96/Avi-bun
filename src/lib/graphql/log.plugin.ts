import { ApolloServerPlugin, BaseContext } from '@apollo/server';

import { Logger } from '@app/services/logger';
import { isDev } from '@app/services/env';
import moment from 'moment';

const logger = Logger.child({ name: 'Apollo Log' });

export const ApolloLogPlugin: ApolloServerPlugin<BaseContext> = {
  async requestDidStart(context) {
    const start = new Date();
    const request = context.request;
    const query = request.query;
    const op = request.operationName;
    let shouldLog = isDev;

    if (op !== 'IntrospectionQuery' && !query?.includes('IntrospectionQuery')) {
      shouldLog = isDev;
    }

    return {
      async willSendResponse() {
        console.log(
          moment.duration(moment().diff(start)).asMilliseconds() + 'ms',
          query,
        );
      },
      async didEncounterErrors(context) {
        logger.error(query);
        logger.error(context.errors[0]);
      },
    };
  },
};
