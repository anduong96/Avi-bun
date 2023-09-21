import { AircraftCreatedTopic } from '@app/topics/defined.topics/aircraft.created.topic';
import { Flightera } from '@app/lib/flight.vendors/flightera';
import { Skybrary } from '@app/lib/flight.vendors/skybrary';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { prisma } from '@app/prisma';

/**
 * The function creates an aircraft record in a database using information obtained from a remote
 * source and broadcasts a message about the creation of the aircraft.
 * @param {string} tailNumber - The `tailNumber` parameter is a string that represents the unique
 * identifier of an aircraft. It is typically a combination of letters and numbers that is displayed on
 * the tail of the aircraft.
 */
export async function createAircraft(tailNumber: string) {
  const remoteAircraft = await Flightera.getAircraftFromCrawl(tailNumber);
  const aircraft = await prisma.aircraft.upsert({
    where: {
      tailNumber,
    },
    update: {},
    create: {
      tailNumber,
      airlineIata: remoteAircraft.airlineIata,
      description: remoteAircraft.description,
      icao: remoteAircraft.icao,
      model: remoteAircraft.model,
      imageURL: Skybrary.getPhotoURL(remoteAircraft.icao),
    },
  });

  TopicPublisher.broadcast(new AircraftCreatedTopic(aircraft));
}
