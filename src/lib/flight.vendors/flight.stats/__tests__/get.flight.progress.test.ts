import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Flight Stats', () => {
  test('getFlightProgress', async () => {
    const airlineIata = 'AA';
    const flightNumber = '100';

    const [flight] = await FlightStats.searchFlights({
      flightNumber,
      airlineIata,
      departureDate: new Date(),
    });

    const progress = await FlightStats.getFlightProgress({
      flightID: flight.flightID.toString(),
      airlineIata,
      flightNumber,
    });

    expect(progress).toBeTruthy();
    expect(progress.positions).toBeArray();
  });
});
