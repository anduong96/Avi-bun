import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType()
export class GQL_FlightTimeline {
  @Field(_type => ID)
  id: string;

  @Field()
  flightID: string;

  @Field()
  title: string;

  @Field(_type => Int)
  index: number;

  @Field()
  source: string;

  @Field()
  timestamp: Date;

  @Field()
  hasAlerted: boolean;

  // skip overwrite 👇
}
