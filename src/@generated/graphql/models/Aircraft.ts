import { Field, ObjectType, Int } from 'type-graphql'
import { GQL_AircraftPosition } from './AircraftPosition'

@ObjectType()
export class GQL_Aircraft {
  @Field((_type) => Int)
  id: number

  @Field()
  iata: string

  @Field({ nullable: true })
  icao?: string

  @Field()
  name: string

  @Field()
  airlineIata: string

  @Field({ nullable: true })
  description?: string

  @Field()
  tailNumber: string

  @Field({ nullable: true })
  imageURL?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field((_type) => GQL_AircraftPosition, { nullable: true })
  AircraftPosition?: GQL_AircraftPosition

  // skip overwrite 👇
}