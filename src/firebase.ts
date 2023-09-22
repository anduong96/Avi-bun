import * as firebaseAdmin from 'firebase-admin';

import { ENV } from '@app/env';
import { Logger } from './services/logger';

const credential = firebaseAdmin.credential.cert({
  projectId: ENV.FIREBASE_PROJECT_ID,
  clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
  privateKey: ENV.FIREBASE_PRIVATE_KEY,
});

export const firebase = firebaseAdmin.initializeApp({
  credential,
});

Logger.debug('Firebase initialized', firebase.name);
