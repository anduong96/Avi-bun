import moment from 'moment';
import { describe, expect, test } from 'bun:test';

import { SeatGuru } from '..';

describe('Vendor::SeatGuru', () => {
  test('Get Aircraft Metadata', async () => {
    const metadata = await SeatGuru.getAircraftMetadata({
      airlineIata: 'AA',
      date: moment().add(10, 'days').toDate(),
      flightNumber: '100',
    });

    expect(metadata).toBeTruthy();
    expect(metadata.seatingsMap.length).toBeGreaterThan(0);

    for (const seat of metadata.seatingsMap) {
      expect(seat.name).toBeTruthy();
      expect(seat.pitchInches).toBeNumber();
      expect(seat.widthInches).toBeNumber();
    }

    expect(metadata.amenitiesMap).toBeTruthy();
    expect(metadata.amenitiesMap['AC Power']).toBeString();
    expect(metadata.amenitiesMap['Audio']).toBeString();
    expect(metadata.amenitiesMap['Food']).toBeString();
    expect(metadata.amenitiesMap['Internet']).toBeString();
    expect(metadata.amenitiesMap['Video']).toBeString();
  });
});
