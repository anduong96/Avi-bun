import assert from 'assert';
import { isEmpty } from 'lodash';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { removeNilProp } from '@app/lib/objects/remove.nil.props';
import { GQL_UserPreference } from '@app/@generated/graphql/models/UserPreference';

import { CurrentUserID } from '../_decorators/current.user.id.decorator';
import { UpdateUserPreferenceInput } from '../inputs/update.user.preference.input';

@Resolver(() => GQL_UserPreference)
export class UserPreferenceResolver {
  @Authorized()
  @Mutation(() => Boolean)
  async updateUserPreference(
    @CurrentUserID() userID: string,
    @Arg('data') args: UpdateUserPreferenceInput,
  ) {
    const data = removeNilProp(args);
    assert(!isEmpty(data), 'Update payload cannot be empty');
    await prisma.userPreference.update({
      data,
      where: {
        userID,
      },
    });

    return true;
  }

  @Authorized()
  @Query(() => GQL_UserPreference)
  async userPreference(@CurrentUserID() userID: string) {
    const result = await prisma.$transaction(async tx => {
      let preference = await tx.userPreference.findFirst({
        where: {
          userID,
        },
      });

      if (!preference) {
        preference = await tx.userPreference.create({
          data: {
            userID,
          },
        });
      }

      return preference;
    });

    return result;
  }
}
