import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_UserAuthentication } from './UserAuthentication';
import { GQL_UserPreference } from './UserPreference';

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

  @Field(() => [GQL_UserAuthentication])
  Authentications: GQL_UserAuthentication[];

  // skip overwrite 👇
}
