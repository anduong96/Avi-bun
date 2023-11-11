import { describe, expect, test } from 'bun:test';

import { TSA } from '..';

describe('Vendor::TSA', () => {
  test('getAirportWaitTimes: USA Airports', async () => {
    const airports = [
      ['LAX', 'Los Angeles International'],
      ['JFK', 'John F. Kennedy International'],
      ['SFO', 'San Francisco International'],
    ];

    for await (const [iata, name] of airports) {
      const response = await TSA.getAirportWaitTimes(iata);
      expect(response.airportIata).toBe(iata);
      expect(response.airportName).toBe(name);
      expect(response.data).toBeArray();
      expect(response.data[0].dayOfWeek).toBeWithin(0, 6);
      expect(response.data[0].hour).toBeWithin(0, 23);
      expect(response.data[0].maxWaitMinute).toBeWithin(0, 60);
      expect(response.data[0].updatedAt).toBeInstanceOf(Date);
    }
  });

  test('getAirportWaitTimes: Non-USA Airports', async () => {
    const response = await TSA.getAirportWaitTimes('LHR');
    expect(response.airportIata).toBe('LHR');
    expect(response.airportName).toBe(null);
    expect(response.data).toBeArray();
    expect(response.data).toBeArrayOfSize(0);
  });
});
