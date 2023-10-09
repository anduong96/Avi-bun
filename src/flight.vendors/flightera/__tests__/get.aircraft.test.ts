import { describe, expect, test } from 'bun:test';

import { Flightera } from '..';

// Disable this for now: It does not work on github actions
describe('Flightera', () => {
  test('getAircraftFromHtml', async () => {
    const aircraftTailNumber = 'N725AN';
    const aircraft = await Flightera.getAircraftFromCrawl(aircraftTailNumber);

    expect(aircraft.airlineIata).toBe('AA');
    expect(aircraft.model).toBe('B77W');
    expect(aircraft.icao).toBe('A9B62C');
    expect(aircraft.description).toBeString();
    expect(
      aircraft.image?.startsWith('www.flightera.net/staticfiles/'),
    ).toBeTrue();

    expect(aircraft.seatsConfiguration.economy).toBe(216);
    expect(aircraft.seatsConfiguration.business).toBe(52);
    expect(aircraft.seatsConfiguration.first).toBe(8);
  });
});
