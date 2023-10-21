import { Field, ObjectType, ID, Int } from 'type-graphql';
import { Field, ObjectType, ID, Int, Float } from 'type-graphql';

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

  // skip overwrite 👇
}
