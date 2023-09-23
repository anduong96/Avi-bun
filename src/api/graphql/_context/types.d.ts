import { BaseContext } from '@apollo/server';
import { Transaction } from '@sentry/bun';
import { Context } from 'elysia';
import { DecodedIdToken } from 'firebase-admin/auth';

export type ApolloServerContext = BaseContext & {
  request: Context['request'];
  headers: Context['headers'];
  ipAddress: string;
  user?: DecodedIdToken | null;
  transactionID: string;
  sentryTransaction: Transaction;
};
