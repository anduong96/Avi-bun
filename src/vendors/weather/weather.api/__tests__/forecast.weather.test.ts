import moment from 'moment';
import { describe, expect, it } from 'bun:test';

import { Coordinates } from '@app/types/coordinates';

import { WeatherAPI } from '..';

describe('Vendor::WeatherAPI', () => {
  const now = moment().startOf('date');
  const nyc: Coordinates = { latitude: 40.7128, longitude: -74.006 };
  const la: Coordinates = { latitude: 34.0522, longitude: -118.2437 };
  const hokaido: Coordinates = { latitude: 43.0646, longitude: 141.3464 };

  for (const [location, coordinates] of Object.entries({ hokaido, la, nyc })) {
    it(`should get forecasted weather: ${location.toUpperCase()}`, async () => {
      const response = await WeatherAPI.getForecastWeather(coordinates);
      expect(response).toBeDefined();
      expect(response.forecast.forecastday).toBeArrayOfSize(10);
      expect(response.forecast.forecastday[0].hour).toBeArray();
      expect(response.location.lat).toBeCloseTo(coordinates.latitude);
      expect(response.location.lon).toBeCloseTo(coordinates.longitude);

      for (const day of response.forecast.forecastday) {
        const dayTs = moment(day.date_epoch * 1000);
        const index = response.forecast.forecastday.indexOf(day);

        if (index > 0) {
          expect(dayTs.isSameOrAfter(now, 'day')).toBeTrue();

          for (const hour of day.hour) {
            const hourTs = moment(hour.time_epoch * 1000);
            expect(hourTs.isSameOrAfter(now, 'hour')).toBeTrue();
          }
        }
      }
    });
  }
});
