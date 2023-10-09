import { FlightStats } from '@app/flight.vendors/flight.stats';
import { describe, expect, test } from 'bun:test';
import moment from 'moment';
import { RadarBox } from '..';

describe('RadarBox', () => {
  test('Get Aircraft', async () => {
    const position = await RadarBox.getAircraft('N508JL');
    expect(position).toBeTruthy();
  });

  test('Live Aircraft', async () => {
    const flight = await FlightStats.getRandomFlight();
    const position = await RadarBox.getAircraft(flight.tailNumber);
    expect(position).toBeTruthy();
    expect(moment().isSame(position!.flightDate, 'day')).toBe(true);
  });
});
