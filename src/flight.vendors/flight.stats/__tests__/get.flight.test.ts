import { describe, expect, test } from 'bun:test';

import { FlightStats } from '..';
import moment from 'moment';

describe('Flight Stats', () => {
  type Item = {
    airlineIata: string;
    flightNumber: string;
    date: Date;
    originIata: string;
    destinationIata: string;
  };

  const flightsToTest: Array<Item> = [];
  flightsToTest.push({
    airlineIata: 'AA',
    flightNumber: '100',
    date: moment().toDate(),
    originIata: 'JFK',
    destinationIata: 'LHR',
  });
  flightsToTest.push({
    airlineIata: 'NK',
    flightNumber: '706',
    date: moment().subtract(1, 'day').toDate(),
    originIata: 'DTW',
    destinationIata: 'LAX',
  });
  flightsToTest.push({
    airlineIata: 'B6',
    flightNumber: '161',
    date: moment().subtract(1, 'day').toDate(),
    originIata: 'JFK',
    destinationIata: 'SMF',
  });

  for (const item of flightsToTest) {
    test(`getFlightDetails: ${item.airlineIata}${item.flightNumber}`, async () => {
      const flight = await FlightStats.getFlightDetails({
        airlineIata: item.airlineIata,
        flightNumber: item.flightNumber,
        flightYear: item.date.getFullYear(),
        flightMonth: item.date.getMonth(),
        flightDate: item.date.getDate(),
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
