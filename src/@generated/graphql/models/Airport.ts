import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType()
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

  @Field(() => Int)
  latitude: number;

  @Field(() => Int)
  longitude: number;

  // skip overwrite 👇
}
