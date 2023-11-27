import { Arg, Int, Query, Resolver } from 'type-graphql';

import { GQL_AirportWeather } from '@app/@generated/graphql/models/AirportWeather';
import { getAirportWeather } from '@app/services/airport.weather/get.airport.weather';

@Resolver(() => GQL_AirportWeather)
export class AirportWeatherResolver {
  @Query(() => GQL_AirportWeather, { nullable: true })
  async airportWeather(
    @Arg('airportIata') iata: string,
    @Arg('year', () => Int) year: number,
    @Arg('month', () => Int) month: number,
    @Arg('date', () => Int) date: number,
    @Arg('hour', () => Int) hour: number,
  ) {
    const result = await getAirportWeather({
      airportIata: iata,
      date,
      hour,
      month,
      year,
    });

    return result;
  }
}
