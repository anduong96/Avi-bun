import assert from 'assert';
import moment from 'moment';

import { prisma } from '@app/prisma';
import { firebase } from '@app/firebase';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { UserCreatedTopic } from '@app/topics/defined.topics/user.created.topic';

async function createUser(userID: string) {
  const firebaseUser = await firebase.auth().getUser(userID);
  assert(firebaseUser, 'User not found');
  const user = await prisma.user.create({
    data: {
      Authentications: {
        create: firebaseUser.providerData.map(entry => ({
          email: entry.email,
          id: entry.uid,
          phone: entry.phoneNumber,
          provider: entry.providerId,
        })),
      },
      avatarURL: firebaseUser.photoURL,
      createdAt: moment(firebaseUser.metadata.creationTime).toDate(),
      displayName: firebaseUser.displayName,
      id: userID,
    },
  });

  TopicPublisher.broadcast(new UserCreatedTopic(userID));

  return user;
}

export async function getOrCreateUser(userID: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userID,
    },
  });

  return user ?? createUser(userID);
}
