import { createParamDecorator } from 'type-graphql';
import { AuthCheckerContext } from '../_auth/auth.checker';

export function CurrentUserID() {
  return createParamDecorator<AuthCheckerContext>(
    ({ context }) => context.user!.uid,
  );
}
