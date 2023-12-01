import { describe, expect, it } from 'bun:test';

import { WeatherAPI } from '..';

describe('Vendor::WeatherAPI', () => {
  it('should get all conditions', async () => {
    const result = await WeatherAPI.getAllConditions();
    expect(result).toBeDefined();
  });
});
