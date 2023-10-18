import assert from 'assert';
import moment from 'moment';

import { prisma } from '@app/prisma';
import { firebase } from '@app/firebase';
import { Logger } from '@app/lib/logger';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { UserCreatedTopic } from '@app/topics/defined.topics/user.created.topic';

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
  const authPayload = firebaseUser.providerData.map(entry => ({
    avatarURL: entry.photoURL,
    email: entry.email,
    id: entry.uid,
    phone: entry.phoneNumber,
    provider: entry.providerId,
  }));

  const createdAt = moment();
  const user = await prisma.user.upsert({
    create: {
      Authentications: {
        createMany: {
          data: authPayload,
        },
      },
      avatarURL: firebaseUser.photoURL,
      createdAt: createdAt.toDate(),
      displayName: firebaseUser.displayName,
      id: userID,
    },
    update: {
      Authentications: {
        connectOrCreate: authPayload.map(entry => ({
          create: entry,
          where: {
            id: entry.id,
          },
        })),
      },
      lastSignInAt: moment(firebaseUser.metadata.lastSignInTime).toDate(),
    },
    where: {
      id: userID,
    },
  });

  if (createdAt.isSame(user.createdAt)) {
    Logger.debug('User[%s] created', user.id);
    TopicPublisher.broadcast(new UserCreatedTopic(user.id));
  }

  return user;
}
