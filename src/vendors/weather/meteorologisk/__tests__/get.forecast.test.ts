import { describe, expect, it } from 'bun:test';
import { compact, flatten, uniq } from 'lodash';

import { Logger } from '@app/lib/logger';
import { Coordinates } from '@app/types/coordinates';

import { MetNoApi } from '..';

describe('Vendor::Weather::Meteorologisk', () => {
  it('should get weather forecast: NYC', async () => {
    const nyc: Coordinates = {
      latitude: 40.7128,
      longitude: -74.006,
    };

    const response = await MetNoApi.getWeatherForecast(nyc);
    const [longitude, latitude] = response.geometry.coordinates;
    expect(response).toBeTruthy();
    expect(longitude).toBe(nyc.longitude);
    expect(latitude).toBe(nyc.latitude);
  });

  it('should get weather forecast: LA', async () => {
    const la: Coordinates = {
      latitude: 34.0522,
      longitude: -118.2437,
    };

    const response = await MetNoApi.getWeatherForecast(la);
    const [longitude, latitude] = response.geometry.coordinates;
    expect(response).toBeTruthy();
    expect(longitude).toBe(la.longitude);
    expect(latitude).toBe(la.latitude);
  });

  it('should get weather forecast: Hokaido', async () => {
    const Hokaido = {
      latitude: 43.0646,
      longitude: 141.3464,
    };

    const response = await MetNoApi.getWeatherForecast(Hokaido);
    const [longitude, latitude] = response.geometry.coordinates;
    expect(response).toBeTruthy();
    expect(longitude).toBe(Hokaido.longitude);
    expect(latitude).toBe(Hokaido.latitude);

    const all_symbols = uniq(
      flatten(
        response.properties.timeseries.map(item => [
          item.data.next_1_hours?.summary.symbol_code,
          item.data.next_6_hours?.summary.symbol_code,
          item.data.next_12_hours?.summary.symbol_code,
        ]),
      ),
    );

    Logger.info(
      'geometry=%o symbols=%s',
      response.geometry,
      compact(all_symbols)
        .map(item => `"${item}"`)
        .join('|'),
    );
  });
});
