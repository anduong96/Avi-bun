import { Field, ObjectType, ID, Int } from 'type-graphql';
import { GQL_FlightVendor } from '../enums/FlightVendor';

@ObjectType('FlightPromptness')
export class GQL_FlightPromptness {
  @Field(() => ID)
  id: string;

  @Field()
  airlineIata: string;

  @Field()
  flightNumber: string;

  @Field()
  originIata: string;

  @Field()
  destinationIata: string;

  @Field(() => GQL_FlightVendor)
  vendor: GQL_FlightVendor;

  @Field(() => Int)
  rating: number;

  @Field(() => Int)
  onTimePercent: number;

  @Field(() => Int)
  averageDelayTimeMs: number;

  @Field(() => Int)
  daysObserved: number;

  @Field(() => Int)
  flightsObservered: number;

  @Field(() => Int)
  onTimeCount: number;

  @Field(() => Int)
  lateCount: number;

  @Field(() => Int)
  veryLateCount: number;

  @Field(() => Int)
  excessiveCount: number;

  @Field(() => Int)
  cancelledCount: number;

  @Field(() => Int)
  divertedCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  expiresAt: Date;

  // skip overwrite 👇
}
