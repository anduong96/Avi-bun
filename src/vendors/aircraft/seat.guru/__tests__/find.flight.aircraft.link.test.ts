import moment from 'moment';
import { describe, expect, test } from 'bun:test';

import { SeatGuru } from '..';

describe('Vendor::SeatGuru', () => {
  test('Find Flight Aircraft Link', async () => {
    const flightLink = await SeatGuru.findFlightAircraftLink({
      airlineIata: 'AA',
      date: moment().add(10, 'days').toDate(),
      flightNumber: '100',
    });

    expect(flightLink).toBeString();
    expect(flightLink).toContain(
      'https://www.seatguru.com/airlines/American_Airlines',
    );
  });
});
