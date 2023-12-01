import moment from 'moment';
import { describe, expect, it } from 'bun:test';

import { Coordinates } from '@app/types/coordinates';

import { WeatherAPI } from '..';

describe('Vendor::WeatherAPI', () => {
  const now = moment().subtract(1, 'day');
  const nyc: Coordinates = { latitude: 40.7128, longitude: -74.006 };
  const la: Coordinates = { latitude: 34.0522, longitude: -118.2437 };
  const hokaido: Coordinates = { latitude: 43.0646, longitude: 141.3464 };
  for (const [location, coordinates] of Object.entries({ hokaido, la, nyc })) {
    it(`should get historical weather: ${location.toUpperCase()}`, async () => {
      const response = await WeatherAPI.getHistoricalWeather(
        coordinates,
        now.toDate(),
      );

      expect(response).toBeDefined();
      expect(response.forecast.forecastday).toBeArrayOfSize(1);
      expect(response.forecast.forecastday[0].hour).toBeArray();
      expect(response.location.lat).toBeCloseTo(coordinates.latitude);
      expect(response.location.lon).toBeCloseTo(coordinates.longitude);
    });
  }
});
