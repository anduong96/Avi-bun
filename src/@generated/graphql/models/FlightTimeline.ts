import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType('FlightTimeline')
export class GQL_FlightTimeline {
  @Field(() => ID)
  id: string;

  @Field()
  flightID: string;

  @Field()
  title: string;

  @Field()
  source: string;

  @Field()
  timestamp: Date;

  @Field()
  hasAlerted: boolean;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇
}
