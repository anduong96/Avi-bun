import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType('FlightPosition')
export class GQL_FlightPosition {
  @Field(() => Int)
  id: number;

  @Field()
  flightID: string;

  @Field(() => Int)
  index: number;

  @Field(() => Int)
  latitude: number;

  @Field(() => Int)
  longitude: number;

  @Field(() => Int)
  course: number;

  @Field(() => Int)
  speedMph: number;

  @Field(() => Int)
  vrateMps: number;

  @Field(() => Int)
  altitudeFt: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇
}
