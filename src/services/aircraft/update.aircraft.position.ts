import { Aircraft } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { RadarBox } from '@app/vendors/aircraft/radar.box';

export async function updateAircraftPosition(
  aircraft: Pick<Aircraft, 'airlineIata' | 'id' | 'tailNumber'>,
) {
  const position = await RadarBox.getAircraft(aircraft.tailNumber);

  Logger.debug('Plane position', position);

  if (!position || !position?.destinationIata || !position.originIata) {
    Logger.debug(
      'Position not found for tailNumber[%s] airlineIata[%s]',
      aircraft.tailNumber,
      aircraft.airlineIata,
      position,
    );

    return;
  }

  await prisma.aircraftPosition.upsert({
    create: {
      aircraftID: aircraft.id,
      airlineIata: aircraft.airlineIata,
      altitude: position.altitude,
      destinationIata: position.destinationIata,
      flightDate: position.flightDate.getDate(),
      flightMonth: position.flightDate.getMonth(),
      flightNumber: position.flightNumber,
      flightYear: position.flightDate.getFullYear(),
      latitude: position.latitude,
      longitude: position.longitude,
      originIata: position.originIata,
      updatedAt: position.updatedAt,
    },
    select: {
      id: true,
    },
    update: {},
    where: {
      aircraftID: aircraft.id,
      airlineIata: aircraft.airlineIata,
      updatedAt: position.updatedAt,
    },
  });

  Logger.debug('Updated aircraft[%s] position', aircraft.id);
}
