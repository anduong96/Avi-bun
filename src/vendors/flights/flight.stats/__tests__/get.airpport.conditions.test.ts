import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Vendor::Flight Stats', () => {
  test('getAirportConditions', async () => {
    const airportIata: string = 'JFK';
    const airport = await FlightStats.getAirportConditions(airportIata);
    expect(airport.detailsHeader.code).toBe(airportIata);
  });
});
