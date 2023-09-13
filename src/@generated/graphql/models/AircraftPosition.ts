import { Field, ObjectType, Int } from 'type-graphql'
import { GQL_Aircraft } from './Aircraft'

@ObjectType()
export class GQL_AircraftPosition {
  @Field((_type) => Int)
  id: number

  @Field((_type) => Int)
  aircraftID: number

  @Field((_type) => Int)
  latitude: number

  @Field((_type) => Int)
  longitude: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field((_type) => GQL_Aircraft)
  Aircraft: GQL_Aircraft

  // skip overwrite 👇
}