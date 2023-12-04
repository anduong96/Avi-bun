import moment from 'moment-timezone';
import { Airport, Prisma } from '@prisma/client';

import { Logger } from '@app/lib/logger';
import { Coordinates } from '@app/types/coordinates';
import { WeatherAPI } from '@app/vendors/weather/weather.api';

export async function getPayloadFromWeatherApi(
  airport: Pick<Airport, 'iata' | 'latitude' | 'longitude' | 'timezone'>,
  date: Date,
) {
  const now = moment();
  const isPast = now.isSameOrAfter(date);
  const coordinates: Coordinates = {
    latitude: airport.latitude,
    longitude: airport.longitude,
  };

  Logger.debug(
    'Getting weather data for airport=%s coordinates=%o date=%s isPast=%s from WeatherAPI',
    airport.iata,
    coordinates,
    moment(date).format('YYYY-MM-DD'),
    isPast,
  );

  const result = isPast
    ? await WeatherAPI.getHistoricalWeather(coordinates, date)
    : await WeatherAPI.getFutureWeather(coordinates, date);

  const payload: Prisma.AirportWeatherUncheckedCreateInput[] = [];
  Logger.debug(
    'Got weather data for airport=%s coordinates=%o date=%s length=%s',
    airport.iata,
    coordinates,
    moment(date).format('YYYY-MM-DD'),
    result.forecast.forecastday.length,
  );

  for (const day of result.forecast.forecastday) {
    for (const entry of day.hour) {
      const iconURL = WeatherAPI.getIconUrl(entry.condition);
      const airTemperatureCelsius = entry.temp_c;
      const windFromDirectionDegrees = entry.wind_degree;
      const windSpeedMeterPerSecond = entry.wind_kph;
      const precipitationAmountMillimeter = entry.precip_mm;
      const ts = moment(entry.time).tz(airport.timezone);
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
