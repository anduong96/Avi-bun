import { describe, expect, test } from 'bun:test';

import { Logger } from '@app/lib/logger';

import { FlightStats } from '..';

describe('Flight Stats', () => {
  test('getRandomFlight', async () => {
    const flight = await FlightStats.getRandomFlight();
    Logger.info(flight);
    expect(flight).toBeTruthy();
    expect(flight.flightId).toBeNumber();
  });
});
