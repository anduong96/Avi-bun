import { describe, expect, test } from 'bun:test';

import { Flightera } from '..';

describe('Flightera', () => {
  test('Aircraft: N725AN', async () => {
    const aircraftTailNumber = 'N725AN';
    const aircraft = await Flightera.getAircraftFromCrawl(aircraftTailNumber);
    expect(aircraft).toMatchSnapshot();
  });
});
