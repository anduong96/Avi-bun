import { Field, ObjectType, ID, Int } from 'type-graphql';
import { Field, ObjectType, ID, Float } from 'type-graphql';

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

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  // skip overwrite 👇
}
