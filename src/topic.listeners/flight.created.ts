import moment from 'moment';
import { Flight } from '@prisma/client';

import { prisma } from '@app/prisma';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { getOrCreateAircraft } from '@app/services/aircraft/get.or.create.aircraft';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';
import { updateAircraftPosition } from '@app/services/aircraft/update.aircraft.position';

async function handleAircraft(flightID: Flight['id']) {
  const flight = await prisma.flight.findFirstOrThrow({
    select: {
      aircraftTailNumber: true,
      estimatedGateDeparture: true,
    },
    where: {
      id: flightID,
    },
  });

  if (flight.aircraftTailNumber) {
    const aircraft = await getOrCreateAircraft(flight.aircraftTailNumber);
    const is12HoursUntilDeparture = moment()
      .add(12, 'hours')
      .isSameOrAfter(flight.estimatedGateDeparture);

    if (is12HoursUntilDeparture) {
      await updateAircraftPosition(aircraft);
    }
  }
}

TopicPublisher.subscribe(FlightCreatedTopic, async topic => {
  await handleAircraft(topic.flightID);
});
