import { describe, expect, test } from 'bun:test';
import { RadarBox } from '..';
import { FlightStats } from '@app/flight.vendors/flight.stats';
import moment from 'moment';

describe('RadarBox', () => {
  test('Get Aircraft', async () => {
    const position = await RadarBox.getAircraft('N508JL');
    expect(position).toBeTruthy();
    expect(position.latitude).toBeTypeOf('number');
    expect(position.longitude).toBeTypeOf('number');
  });

  test('Live Aircraft', async () => {
    const flight = await FlightStats.getRandomFlight();
    const position = await RadarBox.getAircraft(flight.tailNumber);
    expect(position).toBeTruthy();
    expect(moment().isSame(position.timestamp, 'day')).toBe(true);
  });
});
