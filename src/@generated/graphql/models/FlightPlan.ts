import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class GQL_FlightPlan {
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

  // skip overwrite 👇
}
