import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_AlertChannel } from '../enums/AlertChannel';

@ObjectType()
export class GQL_FlightAlert {
  @Field(() => ID)
  id: string;

  @Field()
  flightID: string;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field(() => [GQL_AlertChannel])
  channel: GQL_AlertChannel[];

  @Field()
  receiptID: string;

  @Field()
  createdAt: Date;

  // skip overwrite 👇
}
