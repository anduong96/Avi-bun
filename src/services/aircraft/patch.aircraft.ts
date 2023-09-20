import { AircraftCreatedTopic } from '@app/topics/defined.topics/aircraft.created.topic';
import { Flightera } from '@app/flight.vendors/flightera';
import { Skybrary } from '@app/flight.vendors/skybrary';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { prisma } from '@app/prisma';

/**
 * The function `patchAircraft` creates a new aircraft record in the database using information
 * obtained from a remote source and broadcasts a topic indicating that a new aircraft has been
 * created.
 * @param {string} tailNumber - The `tailNumber` parameter is a string that represents the unique
 * identifier of an aircraft. It is used to retrieve information about the aircraft from external
 * sources and to create a new entry in the database for the aircraft.
 */
export async function patchAircraft(tailNumber: string) {
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
