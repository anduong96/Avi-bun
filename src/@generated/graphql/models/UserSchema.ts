import { Field, ObjectType, ID } from 'type-graphql'

@ObjectType()
export class GQL_UserSchema {
  @Field((_type) => ID)
  id: string

  // skip overwrite 👇