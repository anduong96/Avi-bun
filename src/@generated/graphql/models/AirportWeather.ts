import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType('AirportWeather')
export class GQL_AirportWeather {
  @Field(() => ID)
  id: string;

  @Field()
  airportIata: string;

  @Field(() => Int)
  tempuratureC: number;

  // skip overwrite 👇
}
