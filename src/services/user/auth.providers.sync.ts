import assert from 'assert';

import { prisma } from '@app/prisma';
import { firebase } from '@app/firebase';

/**
 * The `syncAuthProviderForUser` function synchronizes the authentication providers for a user by
 * fetching the user from Firebase, creating or updating corresponding entries in the Prisma database,
 * and associating them with the user.
 * @param {string} userID - The `userID` parameter is a string that represents the unique identifier of
 * a user. It is used to retrieve the user from the Firebase authentication system and to associate the
 * user with the authentication provider data in the Prisma database.
 */
export async function syncAuthProviderForUser(userID: string) {
  const firebaseUser = await firebase.auth().getUser(userID);
  assert(firebaseUser, 'User not found');
  await prisma.$transaction(
    firebaseUser.providerData.map(entry => {
      return prisma.userAuthentication.upsert({
        create: {
          email: entry.email,
          id: entry.uid,
          phone: entry.phoneNumber,
          provider: entry.providerId,
          userID,
        },
        update: {},
        where: {
          provider_userID: {
            provider: entry.providerId,
            userID,
          },
        },
      });
    }),
  );
}
