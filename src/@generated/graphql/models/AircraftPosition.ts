import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class GQL_AircraftPosition {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  aircraftID: number;

  @Field(() => Int)
  latitude: number;

  @Field(() => Int)
  longitude: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇
}
