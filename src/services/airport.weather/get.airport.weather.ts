import { isNil, pick } from 'lodash';
import moment from 'moment-timezone';

import { prisma } from '@app/prisma';
import { Sentry } from '@app/lib/sentry';
import { Logger } from '@app/lib/logger';
import { MetNoApi } from '@app/vendors/weather/meteorologisk';

import { getPayloadFromMetNo } from './get.payload.from.met.no';
import { getPayloadFromWeatherApi } from './get.payload.from.weather.api';

async function getAirport(airportIata: string) {
  const airport = await prisma.airport.findFirstOrThrow({
    select: {
      iata: true,
      latitude: true,
      longitude: true,
      timezone: true,
    },
    where: {
      iata: airportIata,
    },
  });

  if (
    isNil(airport.iata) ||
    isNil(airport.latitude) ||
    isNil(airport.longitude) ||
    isNil(airport.timezone)
  ) {
    Sentry.captureException(new Error('Airport is missing location data'), {
      contexts: {
        airport,
      },
    });

    throw new Error('Airport location not found');
  }

  return airport;
}

/**
 * The `getAirportWeather` function retrieves weather data for a specific airport at a given date and
 * time, either from a database or an external API, and handles cases where the data is not found or
 * needs to be updated.
 * @param params - The `params` parameter is an object that contains the following properties:
 * @param {boolean} [throwIfNotFound] - A boolean value indicating whether an error should be thrown if
 * the airport weather is not found. If set to true, an error will be thrown if the airport weather is
 * not found. If set to false or not provided, the function will return null if the airport weather is
 * not found.
 * @returns The function `getAirportWeather` returns the airport weather data for the specified
 * parameters.
 */
export async function getAirportWeather(
  params: {
    airportIata: string;
    date: number;
    hour: number;
    month: number;
    year: number;
  },
  throwIfNotFound?: boolean,
) {
  const { airportIata, date, hour, month, year } = params;

  const airportWeather = await prisma.airportWeather.findFirst({
    include: {
      Airport: {
        select: {
          timezone: true,
        },
      },
    },
    where: {
      airportIata,
      date,
      hour,
      month,
    },
  });

  const hasAirportWeather = !isNil(airportWeather);

  if (hasAirportWeather) {
    const now = moment();
    const timezone = airportWeather.Airport.timezone;
    const requestedTime = moment({ date, hour, month, year }).tz(timezone);
    const isBeforeInHour = requestedTime.isBefore(now, 'hour');
    const lastUpdatedAtDiffHour = now.diff(airportWeather.updatedAt, 'hour');

    Logger.debug(
      'Existing airportWeather=%o found isBeforeInHour=%s lastUpdatedAtDiffHour=%s airportWeather=%o',
      airportWeather.id,
      isBeforeInHour,
      lastUpdatedAtDiffHour,
      airportWeather,
    );

    if (isBeforeInHour || lastUpdatedAtDiffHour < 1) {
      return airportWeather;
    }
  } else if (throwIfNotFound) {
    Sentry.captureException(new Error('Airport weather not found'), {
      contexts: {
        query: {
          airportIata,
          date,
          hour,
          month,
          year,
        },
      },
    });
    Logger.error(
      'Airport weather not found airportIata=%s date=%s hour=%s month=%s year=%s',
      airportIata,
      date,
      hour,
      month,
      year,
    );

    throw new Error('Airport weather not found');
  }

  const airport = await getAirport(airportIata);
  const now = moment().tz(airport.timezone);
  const requestingDate = now.clone().set({ date, hour, month, year });
  const diffDate = requestingDate.diff(now, 'days');
  const diffHours = requestingDate.diff(now, 'hours');
  const isRequestingHistorical = diffHours < 0;
  const isOverMetNoMax = diffDate > MetNoApi.MAX_FORECAST_DAYS;

  Logger.debug(
    'isRequestingHistorical=%s isOverMetNoMax=%s now=%s requestingDate=%s diffDate=%s diffHours=%s airport=%o',
    isRequestingHistorical,
    isOverMetNoMax,
    now.format('LLLL'),
    requestingDate.format('LLLL'),
    diffDate,
    diffHours,
    airport,
  );

  const payload = isRequestingHistorical
    ? await getPayloadFromWeatherApi(airport, requestingDate.toDate())
    : await getPayloadFromMetNo(airport).catch((error: Error) => {
        Logger.debug('getAirportWeather:: error=%s', error.message);
        Logger.error(error);
        Sentry.captureException(error, {
          contexts: {
            query: {
              airport,
              requestingDate,
            },
          },
        });
        return getPayloadFromWeatherApi(airport, requestingDate.toDate());
      });

  Logger.debug(
    'Creating airport weather payload=%o',
    payload.map(entry => pick(entry, ['hour', 'date', 'year', 'month'])),
  );

  const [deletedResult, createdResult] = await prisma.$transaction([
    prisma.airportWeather.deleteMany({
      where: {
        OR: payload.map(item => ({
          airportIata: item.airportIata,
          date: item.date,
          hour: item.hour,
          month: item.month,
          year: item.year,
        })),
      },
    }),
    prisma.airportWeather.createMany({
      data: payload,
    }),
  ]);

  Logger.debug(
    'getAirportWeather:: deletedResult=%o createdResult=%o',
    deletedResult.count,
    createdResult.count,
  );

  return getAirportWeather(params, true);
}
