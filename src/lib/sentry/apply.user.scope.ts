import * as Sentry from '@sentry/bun';
import { DecodedIdToken } from 'firebase-admin/auth';

export function applyUserScopeToSentry(user?: DecodedIdToken | null) {
  if (!user) {
    return;
  }

  Sentry.configureScope(scope => {
    scope.setUser({
      id: user.uid,
      email: user.email,
      name: user.displayName,
    });
  });
}
