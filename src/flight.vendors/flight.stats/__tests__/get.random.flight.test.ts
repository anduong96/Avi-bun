import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';
import { Logger } from '@app/lib/logger';

describe('Flight Stats', () => {
  test('getRandomFlight', async () => {
    const flight = await FlightStats.getRandomFlight();
    Logger.info(flight);
    expect(flight).toBeTruthy();
    expect(flight.flightId).toBeNumber();
  });
});
