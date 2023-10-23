import { maxBy } from 'lodash';
import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Flight Stats', () => {
  test('getFlightDetails', async () => {
    const airlineIata = 'AA';
    const flightNumber = '100';

    const searchResult = await FlightStats.searchFlights({
      airlineIata,
      flightNumber,
    });

    const target = maxBy(searchResult, 'flightDate')!;
    const flight = await FlightStats.getFlightDetails({
      airlineIata,
      flightDate: target.flightDate,
      flightID: target.flightID.toString(),
      flightMonth: target.flightMonth,
      flightNumber,
      flightYear: target.flightYear,
    });

    expect(flight).toBeTruthy();
    expect(target.flightID).toBe(flight.flightId.toString());
    expect(airlineIata).toBe(flight.carrier.iata);
    expect(flightNumber).toBe(flight.carrier.flightNumber);
  });
});
