import { Context } from 'elysia';
import { Transaction } from '@sentry/bun';
import { BaseContext } from '@apollo/server';
import { DecodedIdToken } from 'firebase-admin/auth';

export type ApolloServerContext = BaseContext & {
  headers: Context['headers'];
  ipAddress: string;
  request: Context['request'];
  sentryTransaction: Transaction;
  transactionID: string;
  user?: DecodedIdToken | null;
};
