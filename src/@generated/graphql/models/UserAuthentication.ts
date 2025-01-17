import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType('UserAuthentication')
export class GQL_UserAuthentication {
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

  @Field({ nullable: true })
  avatarURL?: string;

  @Field()
  createdAt: Date;

  // skip overwrite 👇
}
