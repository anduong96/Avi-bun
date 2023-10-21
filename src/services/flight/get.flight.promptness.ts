import moment from 'moment';
import { Flight, FlightPromptness, FlightVendor, Prisma } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { FlightStats } from '@app/flight.vendors/flight.stats';
import { fractionToPercent } from '@app/lib/fraction.to.percent';

/**
 * Upsert the flight promptness based on the provided flight information.
 *
 * @param {Flight} flight - The flight object containing the airline, flight number, origin, and destination.
 * @return {Promise<FlightPromptness>} A promise that resolves to the flight promptness object.
 */
export async function upsertFlightPromptness(
  flight: Pick<
    Flight,
    'airlineIata' | 'destinationIata' | 'flightNumber' | 'id' | 'originIata'
  >,
): Promise<FlightPromptness> {
  Logger.debug('Upsert flight promptness[%s] with Flight Stats', flight.id);
  const expiresAt = moment().add(30, 'days').toDate();
  const remotePromptness = await FlightStats.getFlightPromptness({
    airlineIata: flight.airlineIata,
    destinationIata: flight.destinationIata,
    flightNumber: flight.flightNumber,
    originIata: flight.originIata,
  });
  const where: Prisma.FlightPromptnessWhereUniqueInput = {
    airlineIata_flightNumber_originIata_destinationIata: {
      airlineIata: flight.airlineIata,
      destinationIata: flight.destinationIata,
      flightNumber: flight.flightNumber,
      originIata: flight.originIata,
    },
  };

  if (!remotePromptness) {
    Logger.warn('No promptness found! %o', { flight });
    const filler = await prisma.flightPromptness.upsert({
      create: {
        airlineIata: flight.airlineIata,
        destinationIata: flight.destinationIata,
        expiresAt,
        flightNumber: flight.flightNumber,
        originIata: flight.originIata,
        vendor: FlightVendor.FLIGHT_STATS,
      },
      update: {},
      where,
    });

    return filler;
  }

  const rating = fractionToPercent(remotePromptness.details.overall.stars, 5);
  const averageDelayTimeMs = moment
    .duration(remotePromptness.details.overall.delayMean, 'minutes')
    .as('milliseconds');

  const promptness = await prisma.flightPromptness.upsert({
    create: {
      airlineIata: flight.airlineIata,
      averageDelayTimeMs,
      cancelledCount: remotePromptness.chart.cancelled,
      daysObserved: 60,
      destinationIata: flight.destinationIata,
      divertedCount: remotePromptness.chart.diverted,

      excessiveCount: remotePromptness.chart.excessive,
      expiresAt,
      flightNumber: flight.flightNumber,
      flightsObserved: remotePromptness.statistics.totalObservations,
      lateCount: remotePromptness.chart.late,
      onTimeCount: remotePromptness.chart.onTime,
      onTimePercent: remotePromptness.details.overall.ontimePercent,
      originIata: flight.originIata,
      rating,
      vendor: FlightVendor.FLIGHT_STATS,
      veryLateCount: remotePromptness.chart.veryLate,
    },
    update: {
      averageDelayTimeMs,
      cancelledCount: remotePromptness.chart.cancelled,
      daysObserved: 60,
      divertedCount: remotePromptness.chart.diverted,
      excessiveCount: remotePromptness.chart.excessive,
      expiresAt,
      flightsObserved: remotePromptness.statistics.totalObservations,
      lateCount: remotePromptness.chart.late,
      onTimeCount: remotePromptness.chart.onTime,
      rating,
      veryLateCount: remotePromptness.chart.veryLate,
    },
    where,
  });

  return promptness;
}

/**
 * The function `getFlightPromptness` retrieves the promptness information for a given flight ID, and
 * if it doesn't exist, it creates and returns a new promptness entry for that flight.
 * @param flightID - The `flightID` parameter is the unique identifier of a flight. It is used to find
 * a flight in the database.
 * @returns a Promise that resolves to a FlightPromptness object.
 */
export async function getFlightPromptness(
  flightID: Flight['id'],
): Promise<FlightPromptness> {
  const flight = await prisma.flight.findFirstOrThrow({
    select: {
      airlineIata: true,
      destinationIata: true,
      flightNumber: true,
      id: true,
      originIata: true,
    },
    where: {
      id: flightID,
    },
  });

  const promptness = await prisma.flightPromptness.findFirst({
    where: {
      airlineIata: flight.airlineIata,
      destinationIata: flight.destinationIata,
      expiresAt: {
        gte: moment().toDate(),
      },
      flightNumber: flight.flightNumber,
      originIata: flight.originIata,
    },
  });

  return promptness ?? upsertFlightPromptness(flight);
}
