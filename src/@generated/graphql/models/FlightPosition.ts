import { Field, ObjectType, Int } from 'type-graphql';
import { GQL_Flight } from './Flight';

@ObjectType()
export class GQL_FlightPosition {
  @Field(_type => Int)
  id: number;

  @Field()
  flightID: string;

  @Field(_type => Int)
  index: number;

  @Field(_type => Int)
  latitude: number;

  @Field(_type => Int)
  longitude: number;

  @Field(_type => Int)
  course: number;

  @Field(_type => Int)
  speedMph: number;

  @Field(_type => Int)
  vrateMps: number;

  @Field(_type => Int)
  altitudeFt: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(_type => GQL_Flight)
  Flight: GQL_Flight;

  // skip overwrite 👇
}
