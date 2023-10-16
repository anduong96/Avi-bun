import { Resolver } from 'type-graphql';

import { GQL_User } from '@app/@generated/graphql/models/User';

@Resolver(() => GQL_User)
export class UserResolver {
  async user() {}
}
