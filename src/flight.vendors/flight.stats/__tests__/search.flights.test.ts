import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Flight Stats', () => {
  test('Search Flights', async () => {
    const date = new Date();
    const airlineIata = 'AA';
    const flightNumber = '1248';

    const result = await FlightStats.searchFlights({
      airlineIata,
      flightNumber,
      departureDate: date,
    });

    expect(result).toBeTruthy();
    expect(result).toBeArray();
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every(
        entry =>
          entry.carrier.iata === airlineIata &&
          entry.carrier.flightNumber === flightNumber,
      ),
    ).toBeTrue();
  });
});
