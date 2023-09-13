import { Field, ObjectType, ID, Int } from 'type-graphql'
import { GQL_FlightVendor } from '../enums/FlightVendor'

@ObjectType()
export class GQL_FlightPromptness {
  @Field((_type) => ID)
  id: string

  @Field()
  airlineIata: string

  @Field()
  flightNumber: string

  @Field()
  originIata: string

  @Field()
  destinationIata: string

  @Field((_type) => GQL_FlightVendor)
  vendor: GQL_FlightVendor

  @Field((_type) => Int)
  rating: number

  @Field((_type) => Int)
  onTimePercent: number

  @Field((_type) => Int)
  averageDelayTimeMs: number

  @Field((_type) => Int)
  daysObserved: number

  @Field((_type) => Int)
  flightsObservered: number

  @Field((_type) => Int)
  onTimeCount: number

  @Field((_type) => Int)
  lateCount: number

  @Field((_type) => Int)
  veryLateCount: number

  @Field((_type) => Int)
  excessiveCount: number

  @Field((_type) => Int)
  cancelledCount: number

  @Field((_type) => Int)
  divertedCount: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  expiresAt: Date

  // skip overwrite 👇
}