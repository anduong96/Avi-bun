import * as uuid from 'uuid';
import { Context } from 'elysia';

export function getRequestTransactionID(request: Context['request']): string {
  return request.headers.get('x-transaction-id') || uuid.v4();
}
