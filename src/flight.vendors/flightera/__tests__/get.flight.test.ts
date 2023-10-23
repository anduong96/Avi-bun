import { describe, expect, test } from 'bun:test';

import { Flightera } from '..';

describe('Vendor::Flightera', () => {
  test('getFlightFromHtml', async () => {
    const flight = await Flightera.getFlightFromCrawl({
      airlineIata: 'AA',
      flightNumber: '100',
    });

    expect(flight).toBeTruthy();
    expect(flight.distanceKm).toBe(5545);
    expect(flight.arrivalTimezone).toBe('BST');
    expect(flight.departureTimezone).toBe('EDT');
    expect(flight.co2EmissionKg).toMatchObject({
      Business: 2707,
      'Eco+': 1170,
      Economy: 932,
      First: 2948,
    });
  });
});
