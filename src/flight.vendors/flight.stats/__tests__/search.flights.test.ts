import moment from 'moment';
import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Flight Stats', () => {
  test('Search Flights', async () => {
    const departureDate = new Date();
    const flight = await FlightStats.getRandomFlight();
    const result = await FlightStats.searchFlights({
      airlineIata: flight.carrierIata,
      flightNumber: flight.flightNumber,
    });

    expect(result).toBeArray();
    expect(result.length).toBeGreaterThan(0);
    const found = result.find(entry =>
      moment({
        date: entry.flightDate,
        month: entry.flightMonth,
        year: entry.flightYear,
      }).isSame(departureDate, 'date'),
    );

    if (!found) {
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

    const matches = result.filter(entry =>
      moment({
        date: entry.flightDate,
        month: entry.flightMonth,
        year: entry.flightYear,
      }).isSame(departureDate, 'date'),
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
