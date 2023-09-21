import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Flight Stats', () => {
  test('getFlightPromptness', async () => {
    const airlineIata = 'AA';
    const flightNumber = '100';
    const originIata = 'JFK';
    const destinationIata = 'LHR';
    const result = await FlightStats.getFlightPromptness({
      airlineIata,
      flightNumber,
      originIata,
      destinationIata,
    });

    expect(result.airline.iata).toBe(airlineIata);
    expect(result.arrivalAirport.iata).toBe(destinationIata);
    expect(result.departureAirport.iata).toBe(originIata);
  });
});
