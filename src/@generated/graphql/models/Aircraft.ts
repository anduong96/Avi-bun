import { Field, Int, ObjectType } from 'type-graphql';
import { Field, ObjectType, Int } from 'type-graphql';
import { GQL_AircraftPosition } from './AircraftPosition';
import { GQL_Flight } from './Flight';

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [GQL_AircraftPosition])
  AircraftPositions: GQL_AircraftPosition[];

  @Field(() => [GQL_Flight])
  Flights: GQL_Flight[];

  // skip overwrite 👇
}
