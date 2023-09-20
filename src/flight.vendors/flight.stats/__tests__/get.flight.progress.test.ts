import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Flight Stats', () => {
  test('getFlightProgress', async () => {
    const flight = await FlightStats.getRandomFlight();
    const progress = await FlightStats.getFlightProgress({
      flightID: flight.flightId.toString(),
      airlineIata: flight.carrierIata,
      flightNumber: flight.flightNumber,
    });

    expect(progress).toBeTruthy();
    expect(progress.positions).toBeArray();
  });
});
