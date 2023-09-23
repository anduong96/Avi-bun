import { isDev } from '@app/env';
import { firebase } from '@app/firebase';
import { DecodedIdToken } from 'firebase-admin/auth';
import { isNil } from 'lodash';
import { tryNice } from 'try-nice';
import * as TypeGql from 'type-graphql';
import { getDevUser } from './get.dev.user';

export type AuthCheckerContext = {
  authorization: string | null;
  user?: DecodedIdToken | null;
};

export const AuthChecker: TypeGql.AuthChecker<AuthCheckerContext> = async ({
  context,
}) => {
  const authorization = context.authorization || '';
  const token = authorization.replace('Bearer', '').trim();

  let [user] = await tryNice(() =>
    token ? firebase.auth().verifyIdToken(token, true) : Promise.resolve(null),
  );

  if (!user && isDev) {
    user = getDevUser();
  }

  context.user = user;

  return !isNil(user);
};
