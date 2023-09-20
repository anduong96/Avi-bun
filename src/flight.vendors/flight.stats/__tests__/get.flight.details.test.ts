import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';
import moment from 'moment';

describe('Flight Stats', () => {
  test('getFlightDetails', async () => {
    const randomFlight = await FlightStats.getRandomFlight();
    const flight = await FlightStats.getFlightDetails({
      airlineIata: randomFlight.carrierIata,
      flightNumber: randomFlight.flightNumber,
      flightID: randomFlight.flightId.toString(),
      date: moment(randomFlight.departureDateTime).toDate(),
    });

    expect(flight).toBeTruthy();
    expect(randomFlight.flightId).toBe(flight.flightId);
    expect(randomFlight.carrierIata).toBe(flight.carrier.iata);
    expect(randomFlight.flightNumber).toBe(flight.carrier.flightNumber);
  });
});
