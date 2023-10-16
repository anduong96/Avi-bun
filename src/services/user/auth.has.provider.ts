import { isNil } from 'lodash';

import { prisma } from '@app/prisma';

/**
 * The function checks if a user has a specific authentication provider.
 * @param {string} userID - The `userID` parameter is a string that represents the ID of the user for
 * whom we want to check if they have a specific authentication provider.
 * @param {string} provider - The `provider` parameter is a string that represents the authentication
 * provider. It could be a value like "google", "facebook", "twitter", etc.
 * @returns a boolean value. It returns true if there is a user authentication record in the database
 * that matches the given userID and provider, and false otherwise.
 */
export async function hasAuthProvider(userID: string, provider: string) {
  const result = await prisma.userAuthentication.findFirst({
    select: { id: true },
    where: {
      provider,
      userID,
    },
  });

  return !isNil(result);
}
