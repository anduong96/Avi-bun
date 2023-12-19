import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_UserFlight } from './UserFlight';
import { GQL_UserPreference } from './UserPreference';
import { GQL_UserWaitList } from './UserWaitList';
import { GQL_Feedback } from './Feedback';

@ObjectType('User')
export class GQL_User {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field()
  isAnonymous: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  avatarURL?: string;

  @Field()
  lastSignInAt: Date;

  @Field(() => [GQL_UserFlight])
  UserFlight: GQL_UserFlight[];

  @Field(() => GQL_UserPreference, { nullable: true })
  UserPreference?: GQL_UserPreference;

  @Field(() => [GQL_UserWaitList])
  UserWaitList: GQL_UserWaitList[];

  @Field(() => [GQL_Feedback])
  Feedback: GQL_Feedback[];

  // skip overwrite 👇
}
