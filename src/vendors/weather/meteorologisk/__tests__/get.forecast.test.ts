import moment from 'moment';
import { last } from 'lodash';
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
      const lastSeriesTime = last(response.properties.timeseries)?.time;
      const daysDiff = moment(firstSeriesTime).diff(lastSeriesTime, 'days');
      expect(now.diff(updatedAt, 'hours')).toBeWithin(0, 24);
      expect(now.diff(firstSeriesTime, 'hours')).toBeWithin(0, 24);
      expect(Math.floor(daysDiff)).toBeLessThan(MetNoApi.MAX_FORECAST_DAYS);

      for (const entry of response.properties.timeseries) {
        const time = moment(entry.time);
        const date = time.date();
        const hour = time.hour();
        const month = time.month();
        const year = time.year();

        expect(date).toBeWithin(1, 32);
        expect(hour).toBeWithin(0, 24);
        expect(month).toBeWithin(0, 12);
        expect(year).toBeWithin(now.year(), now.year() + 2);
        const summary = entry.data.next_1_hours;
        expect(summary).toBeTruthy();
        expect(summary?.summary?.symbol_code).toBeTypeOf('string');
      }
    });
  }
});
