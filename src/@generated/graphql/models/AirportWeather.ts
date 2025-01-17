import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType('AirportWeather')
export class GQL_AirportWeather {
  @Field(() => ID)
  id: string;

  @Field()
  airportIata: string;

  @Field(() => Int)
  airTemperatureCelsius: number;

  @Field(() => Int)
  precipitationAmountMillimeter: number;

  @Field(() => Int)
  windSpeedMeterPerSecond: number;

  @Field(() => Int)
  windFromDirectionDegrees: number;

  @Field()
  status: string;

  @Field()
  iconURL: string;

  @Field()
  vendor: string;

  @Field(() => Int)
  year: number;

  @Field(() => Int)
  month: number;

  @Field(() => Int)
  date: number;

  @Field(() => Int)
  hour: number;

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;

  // skip overwrite 👇
}
