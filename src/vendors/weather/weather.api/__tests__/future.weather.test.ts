import moment from 'moment';
import { describe, expect, it } from 'bun:test';

import { WeatherAPI } from '..';

describe('Vendor::WeatherAPI', () => {
  const NYC = { latitude: 40.7128, longitude: -74.006 };
  const DATE = moment().add(30, 'day');

  it('should get forecasted weather', async () => {
    const result = await WeatherAPI.getFutureWeather(NYC, DATE.toDate());
    expect(result).toBeDefined();
    expect(result.forecast.forecastday).toBeArrayOfSize(1);
    expect(result.forecast.forecastday[0].hour).toBeArray();
    expect(result.location.lat).toBeCloseTo(NYC.latitude);
    expect(result.location.lon).toBeCloseTo(NYC.longitude);
    expect(result.forecast.forecastday[0].date).toBe(DATE.format('YYYY-MM-DD'));
  });
});
