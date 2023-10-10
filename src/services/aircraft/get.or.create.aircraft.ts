import { AircraftCreatedTopic } from '@app/topics/defined.topics/aircraft.created.topic';
import { Flightera } from '@app/flight.vendors/flightera';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { prisma } from '@app/prisma';
import { Skybrary } from '@app/flight.vendors/skybrary';
import { Prisma } from '@prisma/client';

/**
 * Retrieves an existing aircraft from the database based on the tail number,
 * or creates a new aircraft if one does not exist.
 *
 * @param {string} tailNumber - The tail number of the aircraft.
 * @return {Promise<Aircraft>} A promise that resolves to the retrieved or created aircraft.
 */
export async function getOrCreateAircraft(tailNumber: string) {
  const [created, data] = await prisma.$transaction(
    async tx => {
      const aircraft = await tx.aircraft.findFirst({
        where: {
          tailNumber,
        },
      });

      if (aircraft) {
        return [false, aircraft];
      }

      const remoteAircraft = await Flightera.getAircraftFromCrawl(tailNumber);
      if (!remoteAircraft) {
        throw new Error('Aircraft not found!');
      }

      const skybraryImage = Skybrary.getPhotoURL(remoteAircraft.model);
      const imageURL = remoteAircraft.image || skybraryImage;
      const newAircraft = await tx.aircraft.create({
        data: {
          tailNumber,
          airlineIata: remoteAircraft.airlineIata,
          description: remoteAircraft.description,
          icao: remoteAircraft.icao,
          model: remoteAircraft.model,
          firstFlight: remoteAircraft.firstFlight,
          imageURL,
        },
      });

      return [true, newAircraft];
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );

  if (created) {
    TopicPublisher.broadcast(new AircraftCreatedTopic(data));
  }

  return data;
}