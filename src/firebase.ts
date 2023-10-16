import { get } from 'lodash';
import * as firebaseAdmin from 'firebase-admin';

import { ENV } from '@app/env';

import { Logger } from './lib/logger';

const credential = firebaseAdmin.credential.cert({
  clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
  privateKey: ENV.FIREBASE_PRIVATE_KEY,
  projectId: ENV.FIREBASE_PROJECT_ID,
});

const admin = get(firebaseAdmin, 'default') as unknown as typeof firebaseAdmin;
export const firebase = admin.initializeApp({
  credential,
});

Logger.getSubLogger({ name: 'Firebase' }).debug('initialized');
