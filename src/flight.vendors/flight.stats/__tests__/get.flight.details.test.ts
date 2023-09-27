import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Flight Stats', () => {
  test('getFlightDetails', async () => {
    const airlineIata = 'AA';
    const flightNumber = '100';

    const [target] = await FlightStats.searchFlights({
      airlineIata,
      flightNumber,
    });

    const flight = await FlightStats.getFlightDetails({
      departureDate: target.departureDate,
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
