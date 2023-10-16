import { Context } from 'elysia';
import { tryNice } from 'try-nice';
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

  let [user] = await tryNice(() =>
    token ? firebase.auth().verifyIdToken(token, true) : Promise.resolve(null),
  );

  if (!user && isDev) {
    user = getDevUser();
  }

  return user;
}
