import moment from 'moment';
import { DecodedIdToken } from 'firebase-admin/auth';

export function getDevUser(): DecodedIdToken {
  return {
    aud: '',
    auth_time: moment().valueOf(),
    exp: moment().add(10, 'minutes').valueOf(),
    firebase: {
      identities: {},
      sign_in_provider: 'custom',
    },
    iat: moment().valueOf(),
    iss: '',
    sub: 'dev',
    uid: 'dev',
  };
}
