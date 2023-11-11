import { describe, expect, test } from 'bun:test';

import { TSA } from '..';

describe('Vendor::TSA', () => {
  test('getAirportCheckpointsStatus', async () => {
    const airports = [
      ['LAX', 'Los Angeles International'],
      ['JFK', 'John F Kennedy International'],
    ];

    for await (const [iata, airportName] of airports) {
      const result = await TSA.getAirportCheckpointsStatus(iata, 0);
      expect(result.airportIata).toBe(iata);
      expect(result.airportName).toBe(airportName);
      expect(result.terminals).toBeArray();
      expect(result.terminals[0].terminalName).toBeString();
      expect(result.terminals[0].checkpoints).toBeArray();
      expect(result.terminals[0].checkpoints[0].checkPointName).toBeString();
      expect(result.terminals[0].checkpoints[0].hours).toBeArray();
      expect(result.terminals[0].checkpoints[0].hours[0].hour).toBeWithin(
        0,
        23,
      );
    }
  });
});
