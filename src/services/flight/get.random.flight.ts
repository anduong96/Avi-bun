import { Flight, Prisma } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { FlightStats } from '@app/vendors/flights/flight.stats';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';

import { getFlightEmissions } from './get.flight.emissions';
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

  const [remoteFlight, emission] = await Promise.all([
    FlightStats.getFlightDetails({
      airlineIata: randFlight.carrierIata,
      flightDate: randFlight.flightDate,
      flightID: randFlight.flightId.toString(),
      flightMonth: randFlight.flightMonth,
      flightNumber: randFlight.flightNumber,
      flightYear: randFlight.flightYear,
    }),
    getFlightEmissions({
      airlineIata: randFlight.carrierIata,
      flightNumber: randFlight.flightNumber,
    }),
  ]);

  try {
    const data = flightStatFlightToFlightPayload(remoteFlight);
    const payload: Prisma.FlightUncheckedCreateInput = Object.assign(
      data,
      emission,
    );

    const flight = await prisma.flight.upsert({
      create: payload,
      update: {},
      where: {
        airlineIata_flightNumber_originIata_destinationIata_flightYear_flightMonth_flightDate:
          {
            airlineIata: payload.airlineIata,
            destinationIata: payload.destinationIata,
            flightDate: payload.flightDate,
            flightMonth: payload.flightMonth,
            flightNumber: payload.flightNumber,
            flightYear: payload.flightYear,
            originIata: payload.originIata,
          },
      },
    });

    TopicPublisher.broadcastAll([new FlightCreatedTopic(flight.id)]);
    return flight;
  } catch (error) {
    Logger.error('Unable to create flight in getRandomFlight', error);
    throw new Error('Unable to create flight');
  }
}
