import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Vendor::Flight Stats', () => {
  test('getFlightProgress', async () => {
    const airlineIata = 'AA';
    const flightNumber = '100';

    const [flight] = await FlightStats.searchFlights({
      airlineIata,
      flightNumber,
    });

    const progress = await FlightStats.getFlightProgress({
      airlineIata,
      flightID: flight.flightID.toString(),
      flightNumber,
    });

    expect(progress).toBeTruthy();
    expect(progress.positions).toBeArray();
  });
});
