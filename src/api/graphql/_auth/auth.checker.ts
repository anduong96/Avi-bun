import { AuthCheckerInterface, ResolverData } from 'type-graphql';

import { isDev } from '@app/env';

export class AuthChecker implements AuthCheckerInterface {
  check({
    root,
    args,
    context,
    info,
  }: ResolverData<{}>): boolean | Promise<boolean> {
    console.info({ root, args, context, info });

    if (isDev) {
      return true;
    }

    return false;
  }
}
