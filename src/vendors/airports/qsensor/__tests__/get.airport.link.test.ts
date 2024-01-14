import { describe, expect, test } from 'bun:test';

import { QSensor } from '..';

describe('Vendor::QSensor', () => {
  test('getAirportLink: LAX', async () => {
    const result = await QSensor.getAirportLink('LAX');
    expect(result).toBeString();
  });
});
