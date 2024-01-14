import { Field, ObjectType } from 'type-graphql';

@ObjectType('AirportTsaEstimatedWaitTime')
export class GQL_AirportTsaEstimatedWaitTime {
  @Field()
  airportIata: string;

  @Field()
  estimatedWaitMinutes: number;

  @Field()
  terminal: string;
}
