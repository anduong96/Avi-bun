import { Flight } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { FlightStats } from '@app/flight.vendors/flight.stats';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';
import { FlightStatsFlightDetailTopic } from '@app/topics/defined.topics/flight.stats.flight.detail.topic';

import { patchFlightPayloadWithFlightera } from './patch.payload.from.flightera';
import { flightStatFlightToFlightPayload } from './flights.payload.from.flights.stat';

/**
 * The function `getRandomFlight` retrieves a random flight from FlightStats API, checks if it already
 * exists in the database, and if not, saves it to the database.
 * @returns The function `getRandomFlight` returns either an existing flight from the database if it
 * exists, or a newly created flight if it doesn't exist.
 */
export async function getRandomFlight(): Promise<Flight> {
  const randFlight = await FlightStats.getRandomFlight();
  const exists = await prisma.flight.findFirst({
    where: {
      airlineIata: randFlight.carrierIata,
      flightDate: randFlight.flightDate,
      flightMonth: randFlight.flightMonth,
      flightNumber: randFlight.flightNumber,
      flightYear: randFlight.flightYear,
    },
  });

  if (exists) {
    return exists;
  }

  const remoteFlight = await FlightStats.getFlightDetails({
    airlineIata: randFlight.carrierIata,
    flightDate: randFlight.flightDate,
    flightID: randFlight.flightId.toString(),
    flightMonth: randFlight.flightMonth,
    flightNumber: randFlight.flightNumber,
    flightYear: randFlight.flightYear,
  });

  try {
    const data = flightStatFlightToFlightPayload(remoteFlight);
    const patchedData = await patchFlightPayloadWithFlightera(data, {
      airlineIata: randFlight.carrierIata,
      flightNumber: randFlight.flightNumber,
    });

    Logger.debug('Creating flight', patchedData);
    const flight = await prisma.flight.create({ data: patchedData });
    TopicPublisher.broadcastAll([
      new FlightCreatedTopic(flight.id),
      new FlightStatsFlightDetailTopic(flight.id, remoteFlight),
    ]);
    return flight;
  } catch (error) {
    Logger.error('Unable to create flight in getRandomFlight', error);
    throw new Error('Unable to create flight');
  }
}
