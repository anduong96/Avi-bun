import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';
import moment from 'moment';

describe('Flight Stats', () => {
  test('Search Flights', async () => {
    const departureDate = new Date();
    const airlineIata = 'AA';
    const flightNumber = '1248';

    const result = await FlightStats.searchFlights({
      airlineIata,
      flightNumber,
    });

    expect(result).toBeArray();
    expect(result.length).toBeGreaterThan(0);

    const found = result.find(entry =>
      moment(entry.date).isSame(departureDate, 'date'),
    );

    expect(found).toBeTruthy();

    result.forEach(entry => {
      expect(entry.departureAirport.iata).toBe('SNA');
      expect(entry.arrivalAirport.iata).toBe('DFW');
      expect(entry.flightID).toBeTypeOf('string');
    });
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
      moment(entry.date).isSame(departureDate, 'date'),
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
