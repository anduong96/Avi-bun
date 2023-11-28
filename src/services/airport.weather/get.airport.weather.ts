import { format } from 'sys';
import { omit } from 'lodash';
import moment from 'moment-timezone';
import { Prisma } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Sentry } from '@app/lib/sentry';
import { Logger } from '@app/lib/logger';
import { MetNoApi } from '@app/vendors/weather/meteorologisk';

export async function populateAirportWeather(airportIata: string) {
  Logger.debug('populating airport weather for airport=%s', airportIata);
  const airport = await prisma.airport.findFirstOrThrow({
    select: {
      latitude: true,
      longitude: true,
      timezone: true,
    },
    where: {
      iata: airportIata,
    },
  });

  if (!airport.latitude || !airport.longitude || !airport.timezone) {
    Sentry.captureException(new Error('Airport is missing location data'), {
      extra: {
        airport,
      },
    });

    throw new Error('Airport location not found');
  }

  const response = await MetNoApi.getWeatherForecast({
    latitude: airport.latitude,
    longitude: airport.longitude,
  });

  const populatedIDs: string[] = [];
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

    const payload: Prisma.AirportWeatherUncheckedCreateInput = {
      airTemperatureCelsius,
      airportIata,
      date,
      hour,
      iconURL,
      month,
      precipitationAmountMillimeter,
      status,
      updatedAt: new Date(),
      windFromDirectionDegrees,
      windSpeedMeterPerSecond,
      year,
    };

    const result = await prisma.airportWeather.upsert({
      create: payload,
      select: { id: true },
      update: omit(payload, ['airportIata', 'date', 'hour', 'month', 'year']),
      where: {
        airportIata_year_month_date_hour: {
          airportIata,
          date,
          hour,
          month,
          year,
        },
      },
    });

    populatedIDs.push(result.id);
  }

  Logger.debug(
    'Populated %s airport weather records for airport=%s ids=%o',
    populatedIDs.length,
    airportIata,
    populatedIDs,
  );

  return populatedIDs;
}

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
    select: {
      Airport: {
        select: {
          timezone: true,
        },
      },
      airportIata: true,
      date: true,
      hour: true,
      iconURL: true,
      month: true,
      precipitationAmountMillimeter: true,
      status: true,
      updatedAt: true,
      windFromDirectionDegrees: true,
      windSpeedMeterPerSecond: true,
      year: true,
    },
    where: {
      airportIata,
      date,
      hour,
      month,
    },
  });

  if (airportWeather) {
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

  const requestingDate = moment({ date, hour, month, year });
  const diffDate = requestingDate.diff(new Date(), 'days');

  if (diffDate < 0) {
    throw new Error('Airport weather not found. Date is in the past');
  } else if (diffDate > MetNoApi.MAX_FORECAST_DAYS) {
    throw new Error('Airport weather not found. Date is too far in the future');
  }

  await populateAirportWeather(airportIata);
  return getAirportWeather(params, true);
}