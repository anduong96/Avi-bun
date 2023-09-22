import * as firebaseAdmin from 'firebase-admin';

import { ENV } from '@app/env';
import { Logger } from './services/logger';
import { get } from 'lodash';

const credential = firebaseAdmin.credential.cert({
  projectId: ENV.FIREBASE_PROJECT_ID,
  clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
  privateKey: ENV.FIREBASE_PRIVATE_KEY,
});

const admin = get(firebaseAdmin, 'default') as unknown as typeof firebaseAdmin;
export const firebase = admin.initializeApp({
  credential,
});

Logger.debug('Firebase initialized', firebase.name);
