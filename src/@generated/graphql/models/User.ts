import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType('User')
export class GQL_User {
  @Field(() => ID)
  id: string;

  // skip overwrite 👇
}
