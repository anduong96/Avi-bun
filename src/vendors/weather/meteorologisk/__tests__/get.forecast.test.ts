import moment from 'moment';
import { describe, expect, it } from 'bun:test';

import { Coordinates } from '@app/types/coordinates';

import { MetNoApi } from '..';

describe('Vendor::Weather::Meteorologisk', () => {
  const now = moment();
  const nyc: Coordinates = { latitude: 40.7128, longitude: -74.006 };
  const la: Coordinates = { latitude: 34.0522, longitude: -118.2437 };
  const hokaido = { latitude: 43.0646, longitude: 141.3464 };
  const locations = { hokaido, la, nyc };

  for (const [name, location] of Object.entries(locations)) {
    it(`should get weather forecast: ${name}`, async () => {
      const response = await MetNoApi.getWeatherForecast(location);
      const [longitude, latitude] = response.geometry.coordinates;
      expect(response).toBeTruthy();
      expect(longitude).toBe(location.longitude);
      expect(latitude).toBe(location.latitude);
      const updatedAt = response.properties.meta.updated_at;
      const firstSeriesTime = response.properties.timeseries[0].time;
      expect(now.diff(updatedAt, 'hours')).toBeWithin(0, 24);
      expect(now.diff(firstSeriesTime, 'hours')).toBeWithin(0, 24);
    });
  }
});
