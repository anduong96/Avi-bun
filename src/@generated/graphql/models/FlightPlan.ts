import { Field, ObjectType, Int, Float } from 'type-graphql';

@ObjectType('FlightPlan')
export class GQL_FlightPlan {
  @Field(() => Int)
  id: number;

  @Field()
  flightID: string;

  @Field(() => Int)
  index: number;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  // skip overwrite 👇
}
