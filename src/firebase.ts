import firebaseAdmin from 'firebase-admin';

import { ENV } from '@app/env';

import { Logger } from './lib/logger';

const credential = firebaseAdmin.credential.cert({
  clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
  privateKey: ENV.FIREBASE_PRIVATE_KEY,
  projectId: ENV.FIREBASE_PROJECT_ID,
});

export const firebase = firebaseAdmin.initializeApp({
  credential,
});

Logger.getSubLogger({ name: 'Firebase' }).debug('initialized');
