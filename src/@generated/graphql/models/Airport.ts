import { Field, ObjectType, ID, Int } from 'type-graphql'
import { GQL_Flight } from './Flight'

@ObjectType()
export class GQL_Airport {
  @Field((_type) => ID)
  id: string

  @Field()
  name: string

  @Field()
  iata: string

  @Field()
  timezone: string

  @Field()
  cityName: string

  @Field()
  cityCode: string

  @Field()
  countryCode: string

  @Field((_type) => Int, { nullable: true })
  elevation?: number

  @Field({ nullable: true })
  countyName?: string

  @Field({ nullable: true })
  state?: string

  @Field((_type) => Int)
  latitude: number

  @Field((_type) => Int)
  longitude: number

  @Field((_type) => [GQL_Flight])
  OriginFlights: GQL_Flight[]

  @Field((_type) => [GQL_Flight])
  DestinationFlights: GQL_Flight[]

  // skip overwrite 👇