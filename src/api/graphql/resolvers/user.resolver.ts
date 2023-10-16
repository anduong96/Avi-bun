import { Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { GQL_User } from '@app/@generated/graphql/models/User';
import { hasAuthProvider } from '@app/services/user/auth.has.provider';
import { getOrCreateUser } from '@app/services/user/get.or.create.user';
import { syncAuthProviderForUser } from '@app/services/user/auth.providers.sync';

import { ApolloServerContext } from '../_context/types';
import {
  CurrentUser,
  CurrentUserID,
} from '../_decorators/current.user.id.decorator';

@Resolver(() => GQL_User)
export class UserResolver {
  @Authorized()
  @Query(() => GQL_User)
  async user(@CurrentUserID() userID: string) {
    const user = await getOrCreateUser(userID);
    return user;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async userSignIn(
    @CurrentUser() user: NonNullable<ApolloServerContext['user']>,
  ) {
    const hasProvider = await hasAuthProvider(
      user.uid,
      user.firebase.sign_in_provider,
    );

    if (!hasProvider) {
      await syncAuthProviderForUser(user.uid);
    }

    return true;
  }
}
