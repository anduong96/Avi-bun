import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType('City')
export class GQL_City {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  countryCode: string;

  @Field()
  code: string;

  @Field()
  timezone: string;

  @Field(() => Int)
  latitude: number;

  @Field(() => Int)
  longitude: number;

  // skip overwrite 👇
}
