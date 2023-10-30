import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType('AirportCondition')
export class GQL_AirportCondition {
  @Field(() => ID)
  id: string;

  @Field()
  airportIata: string;

  @Field(() => Int)
  departureDelayPercent: number;

  @Field(() => Int)
  departureCanceledPercent: number;

  @Field(() => Int)
  departureAverageDelayMs: number;

  @Field(() => Int)
  arrivalDelayPercent: number;

  @Field(() => Int)
  arrivalCanceledPercent: number;

  @Field(() => Int)
  arrivalAverageDelayMs: number;

  // skip overwrite 👇
}
