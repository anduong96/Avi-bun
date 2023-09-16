import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_Flight } from './Flight';
import { GQL_AlertChannel } from '../enums/AlertChannel';

@ObjectType()
export class GQL_FlightAlert {
  @Field(_type => ID)
  id: string;

  @Field()
  flightID: string;

  @Field(_type => GQL_Flight)
  flight: GQL_Flight;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field(_type => [GQL_AlertChannel])
  channel: GQL_AlertChannel[];

  @Field()
  receiptID: string;

  @Field()
  createdAt: Date;

  // skip overwrite 👇
}
