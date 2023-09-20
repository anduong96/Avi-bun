import { AuthCheckerInterface } from 'type-graphql';
import { isDev } from '@app/env';

export class AuthChecker implements AuthCheckerInterface {
  check() // resolverData: ResolverData<object>,
  // _roles: string[],
  : boolean | Promise<boolean> {
    if (isDev) {
      return true;
    }

    // const context = resolverData.context;
    return false;
  }
}
