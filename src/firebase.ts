import firebaseAdmin from 'firebase-admin';

import { ENV } from '@app/env';

import { Logger } from './lib/logger';

const logger = Logger.getSubLogger({ name: 'Firebase' });
const credential = firebaseAdmin.credential.cert({
  clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
  privateKey: ENV.FIREBASE_PRIVATE_KEY,
  projectId: ENV.FIREBASE_PROJECT_ID,
});

export const firebase = firebaseAdmin.initializeApp({
  credential,
});

logger.debug(
  'initialized projectID=%s clientEmail=%s',
  ENV.FIREBASE_PROJECT_ID,
  ENV.FIREBASE_CLIENT_EMAIL,
);
