import moment from 'moment';
import { describe, expect, it } from 'bun:test';

import { Logger } from '@app/lib/logger';
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

        const summary =
          entry.data.next_1_hours ??
          entry.data.next_6_hours ??
          entry.data.next_12_hours;

        if (!summary) {
          Logger.error(
            'Missing weather data for location=%s date=%s hour=%s month=%s year=%s entry=%o previous=%o',
            name,
            date,
            hour,
            month,
            year,
            entry,
            response.properties.timeseries[
              response.properties.timeseries.indexOf(entry)
            ].data,
          );
        }

        expect(summary?.summary.symbol_code).toBeTruthy();
      }
    });
  }
});
