import { describe, expect, it } from 'bun:test';

import { FlightStats } from '..';

describe('Vendor::Flight Stats', () => {
  it('Search Flights', async () => {
    const departureDate = new Date();
    const result = await FlightStats.searchFlightsWithAirports({
      airlineIata: 'AA',
      destinationIata: 'LAX',
      flightDate: departureDate.getDate(),
      flightMonth: departureDate.getMonth(),
      flightYear: departureDate.getFullYear(),
      originIata: 'JFK',
    });

    expect(result).toBeArray();
    expect(result.length).toBeGreaterThan(0);
    for (const entry of result) {
      expect(entry.carrier.fs).toBe('AA');
    }
  });
});
