import { Field, ObjectType, ID, Int } from 'type-graphql'

@ObjectType()
export class GQL_City {
  @Field((_type) => ID)
  id: string

  @Field()
  name: string

  @Field()
  countryCode: string

  @Field()
  code: string

  @Field()
  timezone: string

  @Field((_type) => Int)
  latitude: number

  @Field((_type) => Int)
  longitude: number

  // skip overwrite 👇
}