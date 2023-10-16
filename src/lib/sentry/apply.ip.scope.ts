import * as Sentry from '@sentry/bun';

export function applyIpScopeToSentry(ipAddress?: null | string) {
  Sentry.configureScope(scope => {
    scope.setUser({
      ipAddress,
    });
  });
}
