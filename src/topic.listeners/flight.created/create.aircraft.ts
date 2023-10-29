import moment from 'moment';

import { prisma } from '@app/prisma';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { getOrCreateAircraft } from '@app/services/aircraft/get.or.create.aircraft';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';
import { updateAircraftPosition } from '@app/services/aircraft/update.aircraft.position';

TopicPublisher.subscribe(FlightCreatedTopic, async topic => {
  const flight = await prisma.flight.findFirstOrThrow({
    select: { aircraftTailNumber: true, estimatedGateDeparture: true },
    where: { id: topic.flightID },
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
});
