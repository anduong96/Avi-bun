import moment from 'moment';
import { isNil } from 'lodash';
import html2md from 'html-to-md';
import { AircraftAmenityType, Flight } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { SeatGuru } from '@app/vendors/aircraft/seat.guru';
import { SeatGuruAmenityTypes } from '@app/vendors/aircraft/seat.guru/types';

function transformAmenityType(type: SeatGuruAmenityTypes) {
  switch (type) {
    case 'AC Power':
      return AircraftAmenityType.AC_POWER;
    case 'Audio':
      return AircraftAmenityType.AUDIO;
    case 'Food':
      return AircraftAmenityType.FOOD;
    case 'Internet':
      return AircraftAmenityType.INTERNET;
    case 'Video':
      return AircraftAmenityType.VIDEO;
  }
}

export async function createAircraftMeta(
  flight: Pick<
    Flight,
    | 'aircraftTailNumber'
    | 'airlineIata'
    | 'flightDate'
    | 'flightMonth'
    | 'flightNumber'
    | 'flightYear'
  >,
) {
  const flightDate = new Date(
    flight.flightYear,
    flight.flightMonth,
    flight.flightDate,
  );

  const daysUntilFlight = moment(flightDate).diff(moment(), 'days');

  if (daysUntilFlight >= SeatGuru.MAX_FUTURE_DAYS) {
    throw new Error('Flight date is too far in the future!');
  } else if (isNil(flight.aircraftTailNumber)) {
    throw new Error('Aircraft tail number is required!');
  }

  const data = await SeatGuru.getAircraftMetadata({
    airlineIata: flight.airlineIata,
    date: flightDate,
    flightNumber: flight.flightNumber,
  });

  Logger.debug(
    'Creating aircraft meta for aircraft=%s',
    flight.aircraftTailNumber,
    data,
  );

  const results = await Promise.all([
    prisma.aircraftSeatMeta.createMany({
      data: data.seatingsMap.map(seat => ({
        aircraftTailNumber: flight.aircraftTailNumber!,
        name: seat.name,
        pitchInches: seat.pitchInches,
        widthInches: seat.widthInches,
      })),
    }),
    prisma.aircraftAmenity.createMany({
      data: Object.entries(data.amenitiesMap)
        .filter(([, value]) => !isNil(value))
        .map(([key, value]) => ({
          aircraftTailNumber: flight.aircraftTailNumber!,
          descriptionMarkdown: html2md(String(value)),
          type: transformAmenityType(key as SeatGuruAmenityTypes),
        })),
    }),
  ]);

  Logger.debug(
    'Created aircraft meta for aircraft=%s',
    flight.aircraftTailNumber,
    results,
  );
}
