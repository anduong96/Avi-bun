import { Field, ObjectType, Int } from 'type-graphql';
import { GQL_Flight } from './Flight';
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

  @Field(() => GQL_Flight, { nullable: true })
  Flight?: GQL_Flight;

  // skip overwrite 👇
}
