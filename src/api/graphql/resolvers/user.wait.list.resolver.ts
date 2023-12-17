import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { GQL_UserWaitList } from '@app/@generated/graphql/models/UserWaitList';

import { CurrentUserID } from '../_decorators/current.user.id.decorator';

@Resolver(() => GQL_UserWaitList)
export class UserWaitListResolver {
  @Mutation(() => String, {
    description: 'Add user to wait list',
  })
  async subscribeToWaitList(
    @CurrentUserID() userID: string,
    @Arg('feature', { description: 'Wait list feature' }) feature: string,
  ) {
    const entry = await prisma.userWaitList.upsert({
      create: {
        feature,
        userID,
      },
      select: {
        id: true,
      },
      update: {},
      where: {
        userID_feature: {
          feature,
          userID,
        },
      },
    });

    return entry.id;
  }

  @Query(() => [String], {
    description: 'Get user wait list features',
  })
  async userWaitList(
    @CurrentUserID() userID: string,
    @Arg('features', () => [String], {
      description: 'Wait list features',
    })
    features: string[],
  ) {
    const entries = await prisma.userWaitList.findMany({
      select: {
        feature: true,
      },
      where: {
        feature: {
          in: features,
        },
        userID,
      },
    });

    return entries.map(entry => entry.feature);
  }
}
