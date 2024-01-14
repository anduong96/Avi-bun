import { describe, expect, test } from 'bun:test';

import { QSensor } from '..';

describe('Vendor::QSensor', () => {
  const airports = ['JFK', 'LAX'];

  for (const airport of airports) {
    test(`getTerminals: ${airport}`, async () => {
      const result = await QSensor.getCurrentSecurityMetadata(airport);
      expect(result.terminals).toBeArray();

      for (const terminal of result.terminals) {
        expect(terminal.name).toBeString();
        expect(terminal.estimatedWaitMinutes).toBeNumber();
      }
    });
  }
});
