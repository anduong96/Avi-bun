import { createParamDecorator } from 'type-graphql';
import { AuthCheckerContext } from '../_auth/auth.checker';

/**
 * The function `CurrentUserID` is a TypeScript decorator that extracts the current user's ID from the
 * `context` object in the `AuthCheckerContext` type.
 * @returns a decorator that extracts the current user ID from the context object.
 */
export function CurrentUserID() {
  return createParamDecorator<AuthCheckerContext>(
    ({ context }) => context.user!.uid,
  );
}
