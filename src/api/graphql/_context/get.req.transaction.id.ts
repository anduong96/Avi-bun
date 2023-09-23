import { Context } from 'elysia';
import * as uuid from 'uuid';

export function getRequestTransactionID(request: Context['request']): string {
  return request.headers.get('x-transaction-id') || uuid.v4();
}
