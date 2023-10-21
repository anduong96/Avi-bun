import { Field, ObjectType, Int } from 'type-graphql';
import { Field, ObjectType, Int, Float } from 'type-graphql';

@ObjectType('AircraftPosition')
export class GQL_AircraftPosition {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  aircraftID: number;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field(() => Float, { nullable: true })
  altitude?: number;

  @Field(() => Int)
  flightYear: number;

  @Field(() => Int)
  flightMonth: number;

  @Field(() => Int)
  flightDate: number;

  @Field()
  flightNumber: string;

  @Field()
  airlineIata: string;

  @Field()
  originIata: string;

  @Field()
  destinationIata: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇
}
