import { format } from 'sys';
import moment from 'moment-timezone';
import { Airport, Prisma } from '@prisma/client';

import { Logger } from '@app/lib/logger';
import { MetNoApi } from '@app/vendors/weather/meteorologisk';

export async function getPayloadFromMetNo(
  airport: Pick<Airport, 'iata' | 'latitude' | 'longitude' | 'timezone'>,
) {
  const response = await MetNoApi.getWeatherForecast({
    latitude: airport.latitude,
    longitude: airport.longitude,
  });

  const payload: Prisma.AirportWeatherUncheckedCreateInput[] = [];
  Logger.debug(
    'MetNo weather count: %s',
    response.properties.timeseries.length,
  );

  for await (const entry of response.properties.timeseries) {
    const time = moment(entry.time).tz(airport.timezone);
    const date = time.date();
    const hour = time.hour();
    const month = time.month();
    const year = time.year();
    const current = entry.data.instant.details;
    const nextHour = entry.data.next_1_hours || entry.data.next_6_hours;

    if (!nextHour) {
      Logger.debug(
        'Next hour not found for date=%s hour=%s entry=%o',
        date,
        hour,
        entry,
      );

      continue;
    }

    const status = nextHour.summary.symbol_code;
    const iconURL = format(
      'https://raw.githubusercontent.com/anduong96/weathericons/main/weather/png/%s.png',
      status,
    );

    const upcoming = nextHour.details;
    const airTemperatureCelsius = current.air_temperature;
    const windFromDirectionDegrees = current.wind_from_direction;
    const windSpeedMeterPerSecond = current.wind_speed;
    const precipitationAmountMillimeter = upcoming.precipitation_amount ?? 0;

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
