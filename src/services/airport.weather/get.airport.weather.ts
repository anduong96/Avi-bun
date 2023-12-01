import { format } from 'sys';
import { isNil } from 'lodash';
import moment from 'moment-timezone';
import { Prisma } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Sentry } from '@app/lib/sentry';
import { Logger } from '@app/lib/logger';
import { MetNoApi } from '@app/vendors/weather/meteorologisk';
import { WeatherAPI } from '@app/vendors/weather/weather.api';

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
      extra: {
        airport,
      },
    });

    throw new Error('Airport location not found');
  }

  return airport;
}

async function getPayloadFromMetNo(
  airport: Awaited<ReturnType<typeof getAirport>>,
) {
  const response = await MetNoApi.getWeatherForecast({
    latitude: airport.latitude,
    longitude: airport.longitude,
  });

  const payload: Prisma.AirportWeatherUncheckedCreateInput[] = [];

  for await (const entry of response.properties.timeseries) {
    const time = moment(entry.time).tz(airport.timezone);
    const date = time.date();
    const hour = time.hour();
    const month = time.month();
    const year = time.year();
    const current = entry.data.instant;
    const nextHour = entry.data.next_1_hours!;
    const status = nextHour.summary.symbol_code;
    const iconURL = format(
      'https://raw.githubusercontent.com/anduong96/weathericons/main/weather/png/%s.png',
      status,
    );

    const airTemperatureCelsius = current.details.air_temperature;
    const windFromDirectionDegrees = current.details.wind_from_direction;
    const windSpeedMeterPerSecond = current.details.wind_speed;
    const precipitationAmountMillimeter =
      nextHour?.details.precipitation_amount ?? 0;

    payload.push({
      airTemperatureCelsius,
      airportIata: airport.iata!,
      date,
      hour,
      iconURL,
      month,
      precipitationAmountMillimeter,
      status,
      updatedAt: new Date(),
      vendor: 'MetNo',
      windFromDirectionDegrees,
      windSpeedMeterPerSecond,
      year,
    });
  }

  return payload;
}

async function getPayloadFromWeatherApi(
  airport: Awaited<ReturnType<typeof getAirport>>,
  date: Date,
) {
  const now = moment();
  const isPast = now.isSameOrBefore(date);
  const result = isPast
    ? await WeatherAPI.getHistoricalWeather(airport, date)
    : await WeatherAPI.getFutureWeather(airport, date);

  const payload: Prisma.AirportWeatherUncheckedCreateInput[] = [];
  for (const day of result.forecast.forecastday) {
    for (const entry of day.hour) {
      const iconURL = WeatherAPI.getIconUrl(entry.condition);
      const airTemperatureCelsius = entry.temp_c;
      const windFromDirectionDegrees = entry.wind_degree;
      const windSpeedMeterPerSecond = entry.wind_kph;
      const precipitationAmountMillimeter = entry.precip_mm;
      const ts = moment(day.date).tz(airport.timezone);
      const hour = ts.hour();
      const month = ts.month();
      const year = ts.year();
      const date = ts.date();
      const status = entry.condition.text;
      payload.push({
        airTemperatureCelsius,
        airportIata: airport.iata!,
        date,
        hour,
        iconURL,
        month,
        precipitationAmountMillimeter,
        status,
        updatedAt: new Date(),
        vendor: 'WeatherApi',
        windFromDirectionDegrees,
        windSpeedMeterPerSecond,
        year,
      });
    }
  }

  return payload;
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
  const now = moment();
  const requestingDate = moment({ date, hour, month, year });
  const diffDate = requestingDate.diff(now, 'days');
  const diffHours = requestingDate.diff(now, 'hours');
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
  const isRequestingHistorical = diffHours < 0;

  if (hasAirportWeather) {
    const now = moment();
    const timezone = airportWeather.Airport.timezone;
    const requestedTime = moment({ date, hour, month, year }).tz(timezone);
    const isBeforeInHour = requestedTime.isBefore(now, 'hour');
    const lastUpdatedAtDiffHour = now.diff(airportWeather.updatedAt, 'hour');

    Logger.debug(
      'airportWeather=%o isBeforeInHour=%s lastUpdatedAtDiffHour=%s',
      airportWeather,
      isBeforeInHour,
      lastUpdatedAtDiffHour,
    );

    if (isBeforeInHour || lastUpdatedAtDiffHour < 1) {
      return airportWeather;
    }
  } else if (throwIfNotFound) {
    throw new Error('Airport weather not found');
  }

  const airport = await getAirport(airportIata);
  const payload =
    isRequestingHistorical || diffDate > MetNoApi.MAX_FORECAST_DAYS
      ? await getPayloadFromWeatherApi(airport, requestingDate.toDate())
      : await getPayloadFromMetNo(airport).catch((error: Error) => {
          Logger.debug('getAirportWeather:: error=%s', error.message);
          Logger.error(error);
          Sentry.captureException(error);
          return getPayloadFromWeatherApi(airport, requestingDate.toDate());
        });

  const [deletedResult, createdResult] = await prisma.$transaction([
    prisma.airportWeather.deleteMany({
      where: {
        OR: payload.map(item => ({
          airportIata: item.airportIata,
          date: item.date,
          hour: item.hour,
          month: item.month,
        })),
      },
    }),
    prisma.airportWeather.createMany({
      data: payload,
    }),
  ]);

  Logger.debug(
    'getAirportWeather:: deletedResult=%o createdResult=%o',
    deletedResult,
    createdResult,
  );

  return getAirportWeather(params, true);
}
