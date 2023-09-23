import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType('UserSchema')
export class GQL_UserSchema {
  @Field(() => ID)
  id: string;

  // skip overwrite 👇
}
