import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_User } from './User';

@ObjectType('UserAuth')
export class GQL_UserAuth {
  @Field(() => ID)
  id: string;

  @Field()
  provider: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  userID: string;

  @Field(() => GQL_User)
  User: GQL_User;

  // skip overwrite 👇
}
