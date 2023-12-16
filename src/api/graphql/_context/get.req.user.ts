import { Context } from 'elysia';
import { DecodedIdToken } from 'firebase-admin/auth';

import { isDev } from '@app/env';
import { firebase } from '@app/firebase';

import { getDevUser } from './get.dev.user';

export async function getRequestUser(
  request: Context['request'],
): Promise<DecodedIdToken | null | undefined> {
  const headers = request.headers;
  const authorization = headers.get('Authorization') || '';
  const token = authorization.replace('Bearer', '').trim();

  try {
    const user = await firebase.auth().verifyIdToken(token);
    return user;
  } catch (error) {
    if (isDev) {
      return getDevUser();
    }
  }

  return null;
}
