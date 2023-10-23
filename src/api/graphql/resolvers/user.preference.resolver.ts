import { Authorized, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { GQL_UserPreference } from '@app/@generated/graphql/models/UserPreference';

import { CurrentUserID } from '../_decorators/current.user.id.decorator';

@Resolver(() => GQL_UserPreference)
export class UserPreferenceResolver {
  @Authorized()
  @Query(() => GQL_UserPreference)
  async userPreference(@CurrentUserID() userID: string) {
    const preference = await prisma.userPreference.findFirstOrThrow({
      where: {
        userID,
      },
    });

    return preference;
  }
}
