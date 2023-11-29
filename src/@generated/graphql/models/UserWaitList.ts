import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType('UserWaitList')
export class GQL_UserWaitList {
  @Field(() => ID)
  id: string;

  @Field()
  userID: string;

  @Field()
  feature: string;

  @Field()
  createdAt: Date;

  // skip overwrite 👇
}
