import { Context } from 'elysia';
import { getRequestIpAddress } from './get.req.ip';
import { getRequestUser } from './get.req.user';
import { ApolloServerContext } from './types';
import { Sentry } from '@app/lib/sentry';
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
    op: 'GraphQL',
    name: 'GraphQLTransaction',
    traceId: transactionID,
  });

  return {
    request,
    user,
    ipAddress,
    headers,
    sentryTransaction,
    transactionID,
  };
}
