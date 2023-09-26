import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType('AircraftPosition')
export class GQL_AircraftPosition {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  aircraftID: number;

  @Field(() => Int)
  latitude: number;

  @Field(() => Int)
  longitude: number;

  @Field(() => Int)
  altitude: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇
}
