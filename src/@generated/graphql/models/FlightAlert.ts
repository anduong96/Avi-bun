import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_AlertChannel } from '../enums/AlertChannel';

@ObjectType('FlightAlert')
export class GQL_FlightAlert {
  @Field(() => ID)
  id: string;

  @Field()
  flightID: string;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  createdAt: Date;

  // skip overwrite 👇
}
