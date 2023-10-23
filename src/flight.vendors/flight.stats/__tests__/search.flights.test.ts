import { describe, expect, test } from 'bun:test';

import { Logger } from '@app/lib/logger';

import { FlightStats } from '..';

describe('Vendor::Flight Stats', () => {
  test('Search Flights', async () => {
    const departureDate = new Date();
    const flight = await FlightStats.getRandomFlight();
    const result = await FlightStats.searchFlights({
      airlineIata: flight.carrierIata,
      flightNumber: flight.flightNumber,
    });

    expect(result).toBeArray();
    expect(result.length).toBeGreaterThan(0);
    const found = result.find(
      entry =>
        entry.flightDate === departureDate.getDate() &&
        entry.flightMonth === departureDate.getMonth() &&
        entry.flightYear === departureDate.getFullYear(),
    );

    if (!found) {
      Logger.error(`Flight not found`, { departureDate, flight, result });
      expect().fail();
      return;
    }

    expect(found.flightID).toBe(flight.flightId.toString());
  });

  test('Search Flights::2 flights', async () => {
    const departureDate = new Date();
    const airlineIata = 'DL';
    const flightNumber = '2477';

    const result = await FlightStats.searchFlights({
      airlineIata,
      flightNumber,
    });

    expect(result).toBeArray();
    expect(result.length).toBeGreaterThan(0);

    const matches = result.filter(
      entry =>
        entry.flightDate === departureDate.getDate() &&
        entry.flightMonth === departureDate.getMonth() &&
        entry.flightYear === departureDate.getFullYear(),
    );

    expect(matches.length).toBe(2);

    for (const entry of result) {
      if (entry.departureAirport.iata === 'SLC') {
        expect(entry.arrivalAirport.iata).toBe('SNA');
      } else if (entry.departureAirport.iata === 'SNA') {
        expect(entry.arrivalAirport.iata).toBe('SLC');
      } else {
        expect().fail('Invalid departure');
      }
    }
  });
});
