import { Field, ObjectType, ID, Float } from 'type-graphql';
import { GQL_Country } from './Country';

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

  @Field(() => GQL_Country, { nullable: true })
  Country?: GQL_Country;

  // skip overwrite 👇
}
