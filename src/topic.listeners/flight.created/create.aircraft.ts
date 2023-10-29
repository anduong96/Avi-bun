import { prisma } from '@app/prisma';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { getOrCreateAircraft } from '@app/services/aircraft/get.or.create.aircraft';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';

TopicPublisher.subscribe(FlightCreatedTopic, async topic => {
  const flight = await prisma.flight.findFirstOrThrow({
    select: { aircraftTailNumber: true },
    where: { id: topic.flightID },
  });

  if (flight.aircraftTailNumber) {
    await getOrCreateAircraft(flight.aircraftTailNumber);
  }
});
