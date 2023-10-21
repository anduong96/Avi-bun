import moment from 'moment';
import { describe, expect, test } from 'bun:test';

import { Flightera } from '..';

describe('Flightera', () => {
  test('getAircraftFromHtml', async () => {
    const aircraftTailNumber = 'N725AN';
    const flighteraStaticUrl = 'https://www.flightera.net/staticfiles/';
    const aircraft = await Flightera.getAircraftFromCrawl(aircraftTailNumber);
    const hasAircraftImage = aircraft.image?.startsWith(flighteraStaticUrl);

    expect(aircraft.airlineIata).toBe('AA');
    expect(aircraft.model).toBe('B77W');
    expect(aircraft.icao).toBe('A9B62C');
    expect(aircraft.description).toBeString();
    expect(hasAircraftImage).toBeTrue();
    expect(aircraft.seatsConfiguration.economy).toBe(216);
    expect(aircraft.seatsConfiguration.business).toBe(52);
    expect(aircraft.seatsConfiguration.first).toBe(8);
    expect(aircraft.firstFlight).toBeTruthy();
    expect(moment({ month: 6, year: 2013 }).format('MMM YYYY')).toBe(
      moment(aircraft.firstFlight).format('MMM YYYY'),
    );
  });
});
