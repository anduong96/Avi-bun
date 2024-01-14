import { Field, ObjectType, ID } from 'type-graphql';

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
