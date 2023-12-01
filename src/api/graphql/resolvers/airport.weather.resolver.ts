import moment from 'moment';
import { Arg, Authorized, Int, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { GQL_AirportWeather } from '@app/@generated/graphql/models/AirportWeather';
import { getAirportWeather } from '@app/services/airport.weather/get.airport.weather';

@Resolver(() => GQL_AirportWeather)
export class AirportWeatherResolver {
  @Authorized()
  @Query(() => GQL_AirportWeather)
  async airportWeather(
    @Arg('airportIata') airportIata: string,
    @Arg('year', () => Int) year: number,
    @Arg('month', () => Int) month: number,
    @Arg('date', () => Int) date: number,
    @Arg('hour', () => Int) hour: number,
  ) {
    const result = await getAirportWeather({
      airportIata,
      date,
      hour,
      month,
      year,
    });

    return result;
  }

  @Authorized()
  @Query(() => [GQL_AirportWeather])
  async airportWeatherDay(
    @Arg('airportIata') airportIata: string,
    @Arg('year', () => Int) year: number,
    @Arg('month', () => Int) month: number,
    @Arg('date', () => Int) date: number,
  ) {
    const daysCount = 7;
    const start = moment({ date, month, year });
    const result = await prisma.airportWeather.findMany({
      where: {
        OR: Array.from({ length: daysCount }, (_, i) => ({
          airportIata,
          date: start.add(i, 'day').date(),
          month: start.add(i, 'day').month(),
          year: start.add(i, 'day').year(),
        })),
      },
    });

    return result;
  }
}
