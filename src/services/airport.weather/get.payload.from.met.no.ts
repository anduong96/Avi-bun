import { format } from 'sys';
import moment from 'moment-timezone';
import { Airport, Prisma } from '@prisma/client';

import { MetNoApi } from '@app/vendors/weather/meteorologisk';

export async function getPayloadFromMetNo(
  airport: Pick<Airport, 'iata' | 'latitude' | 'longitude' | 'timezone'>,
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
