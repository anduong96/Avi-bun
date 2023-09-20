import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';
import moment from 'moment';

describe('Flight Stats', () => {
  test('getFlightDetails', async () => {
    const airlineIata = 'AA';
    const flightNumber = '100';

    const [target] = await FlightStats.searchFlights({
      airlineIata,
      flightNumber,
      departureDate: moment().toDate(),
    });

    const flight = await FlightStats.getFlightDetails({
      flightID: target.flightId.toString(),
      airlineIata,
      flightNumber,
      date: moment().toDate(),
    });

    expect(flight).toBeTruthy();
    expect(target.flightId).toBe(flight.flightId);
    expect(airlineIata).toBe(flight.carrier.iata);
    expect(flightNumber).toBe(flight.carrier.flightNumber);
  });
});
