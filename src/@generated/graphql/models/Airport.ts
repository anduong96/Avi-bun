import { Field, ObjectType, ID, Int, Float } from 'type-graphql';
import { GQL_City } from './City';
import { GQL_Country } from './Country';

@ObjectType('Airport')
export class GQL_Airport {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  iata: string;

  @Field()
  timezone: string;

  @Field()
  cityName: string;

  @Field()
  cityCode: string;

  @Field()
  countryCode: string;

  @Field(() => Int, { nullable: true })
  elevation?: number;

  @Field({ nullable: true })
  countyName?: string;

  @Field({ nullable: true })
  state?: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field(() => GQL_Country)
  Country: GQL_Country;

  // skip overwrite 👇
}
