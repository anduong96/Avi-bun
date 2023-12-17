import { Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { firebase } from '@app/firebase';
import { GQL_User } from '@app/@generated/graphql/models/User';
import { syncAuthProviderForUser } from '@app/services/user/sync.user';

import { CurrentUserID } from '../_decorators/current.user.id.decorator';

@Resolver(() => GQL_User)
export class UserResolver {
  @Authorized()
  @Mutation(() => Boolean)
  async deleteUser(@CurrentUserID() userID: string) {
    await firebase.auth().deleteUser(userID);
    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async syncUser(@CurrentUserID() userID: string) {
    await syncAuthProviderForUser(userID);
    return true;
  }

  @Authorized()
  @Query(() => GQL_User)
  async user(@CurrentUserID() userID: string) {
    const user = prisma.user.findFirstOrThrow({
      where: {
        id: userID,
      },
    });

    return user;
  }
}
