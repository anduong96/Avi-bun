import { Field, Int, ObjectType } from 'type-graphql';
import { GQL_AircraftPosition } from './AircraftPosition';

@ObjectType('Aircraft')
export class GQL_Aircraft {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  iata?: string;

  @Field()
  icao: string;

  @Field()
  model: string;

  @Field()
  airlineIata: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  tailNumber: string;

  @Field({ nullable: true })
  imageURL?: string;

  @Field({ nullable: true })
  firstFlight?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [GQL_AircraftPosition])
  AircraftPositions: GQL_AircraftPosition[];

  // skip overwrite 👇
}
