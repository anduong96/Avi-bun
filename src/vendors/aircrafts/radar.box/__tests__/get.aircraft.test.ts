import moment from 'moment';
import { describe, expect, test } from 'bun:test';

import { FlightStats } from '@app/vendors/flights/flight.stats';

import { RadarBox } from '..';

describe('Vendor::RadarBox', () => {
  test('Get Aircraft', async () => {
    await RadarBox.getAircraft('N508JL');
    expect(true).toBe(true);
  });

  test('Live Aircraft', async () => {
    const flight = await FlightStats.getRandomFlight();
    const position = await RadarBox.getAircraft(flight.tailNumber);
    expect(moment().isSame(position.flightDate, 'day')).toBe(true);
  });
});
