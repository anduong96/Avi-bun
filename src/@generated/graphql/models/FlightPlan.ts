import { Field, ObjectType, Int } from 'type-graphql';
import { GQL_Flight } from './Flight';

@ObjectType('FlightPlan')
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

  @Field(() => GQL_Flight, { nullable: true })
  Flight?: GQL_Flight;

  // skip overwrite 👇
}
