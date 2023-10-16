import * as Sentry from '@sentry/bun';
import { DecodedIdToken } from 'firebase-admin/auth';

export function applyUserScopeToSentry(user?: DecodedIdToken | null) {
  if (!user) {
    return;
  }

  Sentry.configureScope(scope => {
    scope.setUser({
      email: user.email,
      id: user.uid,
      name: user.displayName,
    });
  });
}
