import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Flight Stats', () => {
  test('getFlightDetails', async () => {
    const airlineIata = 'AA';
    const flightNumber = '100';
    const date = new Date();

    const [target] = await FlightStats.searchFlights({
      airlineIata,
      flightNumber,
      departureDate: date,
    });

    const flight = await FlightStats.getFlightDetails({
      departureDate: target.date,
      flightID: target.flightID.toString(),
      airlineIata,
      flightNumber,
    });

    expect(flight).toBeTruthy();
    expect(target.flightID).toBe(flight.flightId.toString());
    expect(airlineIata).toBe(flight.carrier.iata);
    expect(flightNumber).toBe(flight.carrier.flightNumber);
  });
});
