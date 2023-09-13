import { Field, ObjectType, Int } from 'type-graphql'
import { GQL_Flight } from './Flight'

@ObjectType()
export class GQL_FlightPlan {
  @Field((_type) => Int)
  id: number

  @Field()
  flightID: string

  @Field((_type) => Int)
  index: number

  @Field((_type) => Int)
  latitude: number

  @Field((_type) => Int)
  longitude: number

  @Field((_type) => GQL_Flight)
  Flight: GQL_Flight

  // skip overwrite 👇
}