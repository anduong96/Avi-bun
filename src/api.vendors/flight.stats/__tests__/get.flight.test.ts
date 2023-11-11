import moment from 'moment';
import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';

describe('Flight Stats', () => {
  type Item = {
    airlineIata: string;
    date: Date;
    destinationIata: string;
    flightNumber: string;
    originIata: string;
  };

  const flightsToTest: Array<Item> = [];
  flightsToTest.push({
    airlineIata: 'AA',
    date: moment().toDate(),
    destinationIata: 'LHR',
    flightNumber: '100',
    originIata: 'JFK',
  });
  flightsToTest.push({
    airlineIata: 'NK',
    date: moment().subtract(1, 'day').toDate(),
    destinationIata: 'LAX',
    flightNumber: '706',
    originIata: 'DTW',
  });
  flightsToTest.push({
    airlineIata: 'B6',
    date: moment().subtract(1, 'day').toDate(),
    destinationIata: 'SMF',
    flightNumber: '161',
    originIata: 'JFK',
  });

  for (const item of flightsToTest) {
    test(`getFlightDetails: ${item.airlineIata}${item.flightNumber}`, async () => {
      const flight = await FlightStats.getFlightDetails({
        airlineIata: item.airlineIata,
        flightDate: item.date.getDate(),
        flightMonth: item.date.getMonth(),
        flightNumber: item.flightNumber,
        flightYear: item.date.getFullYear(),
      });

      const isSameDepartureDate = moment(item.date).isSame(
        flight.schedule.scheduledGateDeparture,
        'date',
      );

      expect(flight).toBeTruthy();
      expect(flight.flightId).toBeTypeOf('number');
      expect(flight.carrier.flightNumber).toBe(item.flightNumber);
      expect(flight.carrier.iata).toBe(item.airlineIata);
      expect(flight.departureAirport.iata).toBe(item.originIata);
      expect(flight.arrivalAirport.iata).toBe(item.destinationIata);
      expect(isSameDepartureDate).toBe(true);
    });
  }
});
