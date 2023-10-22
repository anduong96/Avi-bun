import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Flight Stats', () => {
  test('getRandomFlight', async () => {
    const flight = await FlightStats.getRandomFlight();
    expect(flight).toBeTruthy();
    expect(flight.flightId).toBeNumber();
  });
});
