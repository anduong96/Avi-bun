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
      flightID: target.flightID.toString(),
      airlineIata,
      flightNumber,
      flightYear: target.flightYear,
      flightMonth: target.flightMonth,
      flightDate: target.flightDate,
    });

    expect(flight).toBeTruthy();
    expect(target.flightID).toBe(flight.flightId.toString());
    expect(airlineIata).toBe(flight.carrier.iata);
    expect(flightNumber).toBe(flight.carrier.flightNumber);
  });
});
