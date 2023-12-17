import assert from 'assert';
import moment from 'moment';
import { isEmpty, omit } from 'lodash';

import { prisma } from '@app/prisma';
import { firebase } from '@app/firebase';
import { Logger } from '@app/lib/logger';
import { createID } from '@app/lib/create.id';
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
  Logger.debug('Syncing user=%s', userID);
  const firebaseUser = await firebase.auth().getUser(userID);
  assert(firebaseUser, 'User not found');
  const isAnonymous = isEmpty(firebaseUser.providerData);
  const authPayload = firebaseUser.providerData.map(entry => ({
    avatarURL: entry.photoURL,
    email: entry.email,
    id: createID(),
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
      displayName: firebaseUser.displayName?.trim(),
      id: userID,
      isAnonymous,
    },
    update: {
      Authentications: {
        upsert: authPayload.map(entry => ({
          create: entry,
          update: omit(entry, 'id'),
          where: {
            provider_userID: {
              provider: entry.provider,
              userID,
            },
          },
        })),
      },
      isAnonymous,
      lastSignInAt: firebaseUser.metadata.lastSignInTime
        ? moment(firebaseUser.metadata.lastSignInTime).toDate()
        : new Date(),
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
