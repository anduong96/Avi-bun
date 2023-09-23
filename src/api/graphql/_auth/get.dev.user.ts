import { DecodedIdToken } from 'firebase-admin/auth';
import moment from 'moment';

export function getDevUser(): DecodedIdToken {
  return {
    uid: 'dev',
    sub: 'dev',
    aud: '',
    iat: moment().valueOf(),
    auth_time: moment().valueOf(),
    exp: moment().add(10, 'minutes').valueOf(),
    iss: '',
    firebase: {
      sign_in_provider: 'custom',
      identities: {},
    },
  };
}
