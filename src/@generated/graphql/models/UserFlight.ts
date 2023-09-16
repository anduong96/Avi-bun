import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_Flight } from './Flight';

@ObjectType()
export class GQL_UserFlight {
  @Field(_type => ID)
  id: string;

  @Field()
  userID: string;

  @Field()
  flightID: string;

  @Field(_type => GQL_Flight)
  flight: GQL_Flight;

  @Field()
  shouldAlert: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇
}
