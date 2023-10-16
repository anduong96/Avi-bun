import { Context } from 'elysia';

import { Sentry } from '@app/lib/sentry';

import { ApolloServerContext } from './types';
import { getRequestUser } from './get.req.user';
import { getRequestIpAddress } from './get.req.ip';
import { getRequestTransactionID } from './get.req.transaction.id';

export async function createApolloContext(
  context: Context,
): Promise<ApolloServerContext> {
  const request = context.request;
  const headers = context.headers;
  const user = await getRequestUser(request);
  const transactionID = getRequestTransactionID(request);
  const ipAddress = getRequestIpAddress(request);
  const sentryTransaction = Sentry.startTransaction({
    name: 'GraphQLTransaction',
    op: 'GraphQL',
    traceId: transactionID,
  });

  return {
    headers,
    ipAddress,
    request,
    sentryTransaction,
    transactionID,
    user,
  };
}
