import { Arg, Query, Resolver } from 'type-graphql';

import { GQL_AirportWeather } from '@app/@generated/graphql/models/AirportWeather';
import { getAirportWeather } from '@app/services/airport.weather/get.airport.weather';

@Resolver(() => GQL_AirportWeather)
export class AirportWeatherResolver {
  @Query(() => GQL_AirportWeather, { nullable: true })
  async airportWeather(
    @Arg('airportIata') iata: string,
    @Arg('year') year: number,
    @Arg('month') month: number,
    @Arg('date') date: number,
    @Arg('hour') hour: number,
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
