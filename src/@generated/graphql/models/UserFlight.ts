import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_Flight } from './Flight';

@ObjectType()
export class GQL_UserFlight {
  @Field(() => ID)
  id: string;

  @Field()
  userID: string;

  @Field()
  flightID: string;

  @Field()
  shouldAlert: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇

  @Field(() => GQL_Flight)
  flight?: GQL_Flight;
}
