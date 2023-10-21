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

  @Field(() => Int, { nullable: true })
  rating?: number;

  @Field(() => Int, { nullable: true })
  onTimePercent?: number;

  @Field(() => Int, { nullable: true })
  averageDelayTimeMs?: number;

  @Field(() => Int, { nullable: true })
  daysObserved?: number;

  @Field(() => Int, { nullable: true })
  flightsObserved?: number;

  @Field(() => Int, { nullable: true })
  onTimeCount?: number;

  @Field(() => Int, { nullable: true })
  lateCount?: number;

  @Field(() => Int, { nullable: true })
  veryLateCount?: number;

  @Field(() => Int, { nullable: true })
  excessiveCount?: number;

  @Field(() => Int, { nullable: true })
  cancelledCount?: number;

  @Field(() => Int, { nullable: true })
  divertedCount?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  expiresAt: Date;

  // skip overwrite 👇
}
