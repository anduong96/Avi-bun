import * as Sentry from '@sentry/bun';

export function applyIpScopeToSentry(ipAddress?: string | null) {
  Sentry.configureScope(scope => {
    scope.setUser({
      ipAddress,
    });
  });
}
