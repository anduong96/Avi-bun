import { FlightStats } from '@app/flight.vendors/flight.stats';
import { Logger } from '@app/lib/logger';
import { prisma } from '@app/prisma';
import { Flight } from '@prisma/client';
import { flightStatFlightToFlightPayload } from './flights.payload.from.flights.stat';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';
import { TopicPublisher } from '@app/topics/topic.publisher';

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
      flightNumber: randFlight.flightNumber,
      airlineIata: randFlight.carrierIata,
      flightYear: randFlight.flightYear,
      flightMonth: randFlight.flightMonth,
      flightDate: randFlight.flightDate,
    },
  });

  if (exists) {
    return exists;
  }

  const remoteFlight = await FlightStats.getFlightDetails({
    flightID: randFlight.flightId.toString(),
    flightNumber: randFlight.flightNumber,
    airlineIata: randFlight.carrierIata,
    flightYear: randFlight.flightYear,
    flightMonth: randFlight.flightMonth,
    flightDate: randFlight.flightDate,
  });

  try {
    const data = flightStatFlightToFlightPayload(remoteFlight);
    Logger.debug('Creating flight', data);
    const flight = await prisma.flight.create({ data });
    TopicPublisher.broadcast(new FlightCreatedTopic(flight));
    return flight;
  } catch (error) {
    Logger.error('Unable to create flight', error);
    throw new Error('Unable to create flight');
  }
}
