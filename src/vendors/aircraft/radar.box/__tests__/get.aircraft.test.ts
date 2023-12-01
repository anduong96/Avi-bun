import moment from 'moment';
import { describe, expect, test } from 'bun:test';

import { FlightStats } from '@app/vendors/flights/flight.stats';

import { RadarBox } from '..';

describe('Vendor::RadarBox', () => {
  const now = moment();

  test('Get Aircraft', async () => {
    const aircraft = await RadarBox.getAircraft('N508JL');
    expect(aircraft).toBeTruthy();
  });

  test('Live Aircraft', async () => {
    const flight = await FlightStats.getRandomFlight();
    const position = await RadarBox.getAircraft(flight.tailNumber);
    expect(now.diff(position.flightDate, 'day')).toBeWithin(0, 1);
  });
});
