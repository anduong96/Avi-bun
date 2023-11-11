import { Field, ObjectType, ID, Int, Float } from 'type-graphql';
import { GQL_Country } from './Country';
import { GQL_Flight } from './Flight';

@ObjectType('Airport')
export class GQL_Airport {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  iata?: string;

  @Field({ nullable: true })
  icao?: string;

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

  @Field(() => [GQL_Flight])
  DepartureFlights: GQL_Flight[];

  @Field(() => [GQL_Flight])
  ArrivalFlights: GQL_Flight[];

  // skip overwrite 👇
}
