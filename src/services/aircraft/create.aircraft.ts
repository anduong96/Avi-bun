import { AircraftCreatedTopic } from '@app/topics/defined.topics/aircraft.created.topic';
import { Flightera } from '@app/flight.vendors/flightera';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { prisma } from '@app/prisma';
import { Skybrary } from '@app/flight.vendors/skybrary';

/**
 * The function creates an aircraft record in a database using information obtained from a remote
 * source and broadcasts a message about the creation of the aircraft.
 * @param {string} tailNumber - The `tailNumber` parameter is a string that represents the unique
 * identifier of an aircraft. It is typically a combination of letters and numbers that is displayed on
 * the tail of the aircraft.
 */
export async function createAircraft(tailNumber: string) {
  let aircraft = await prisma.aircraft.findFirst({
    where: {
      tailNumber,
    },
  });

  if (!aircraft) {
    const remoteAircraft = await Flightera.getAircraftFromCrawl(tailNumber);
    aircraft = await prisma.aircraft.create({
      data: {
        tailNumber,
        airlineIata: remoteAircraft.airlineIata,
        description: remoteAircraft.description,
        icao: remoteAircraft.icao,
        model: remoteAircraft.model,
        imageURL:
          remoteAircraft.image || Skybrary.getPhotoURL(remoteAircraft.model),
      },
    });

    TopicPublisher.broadcast(new AircraftCreatedTopic(aircraft));
  }
}
