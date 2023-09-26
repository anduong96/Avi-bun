import { FlightStats } from '@app/lib/flight.vendors/flight.stats';
import { fractionToPercent } from '@app/lib/fraction.to.percent';
import { prisma } from '@app/prisma';
import { Flight, FlightPromptness, FlightVendor } from '@prisma/client';
import moment from 'moment';

/**
 * Upserts the flight promptness based on the provided flight information.
 *
 * @param {Flight} flight - The flight object containing the airline, flight number, origin, and destination.
 * @return {Promise<FlightPromptness>} A promise that resolves to the flight promptness object.
 */
export async function upsertFlightPromptness(
  flight: Pick<
    Flight,
    'airlineIata' | 'flightNumber' | 'originIata' | 'destinationIata'
  >,
): Promise<FlightPromptness> {
  const remotePromptness = await FlightStats.getFlightPromptness({
    airlineIata: flight.airlineIata,
    flightNumber: flight.flightNumber,
    originIata: flight.originIata,
    destinationIata: flight.destinationIata,
  });

  const rating = fractionToPercent(remotePromptness.details.overall.stars, 5);
  const expiresAt = moment().add(30, 'days').toDate();
  const averageDelayTimeMs = moment
    .duration(remotePromptness.details.overall.delayMean, 'minutes')
    .as('milliseconds');

  const promptness = await prisma.flightPromptness.upsert({
    where: {
      airlineIata_flightNumber_originIata_destinationIata: {
        airlineIata: remotePromptness.airline.iata,
        flightNumber: remotePromptness.airline.flightNumber,
        originIata: remotePromptness.departureAirport.iata,
        destinationIata: remotePromptness.arrivalAirport.iata,
      },
    },
    create: {
      vendor: FlightVendor.FLIGHT_STATS,
      airlineIata: flight.airlineIata,
      flightNumber: flight.flightNumber,
      originIata: flight.originIata,
      destinationIata: flight.destinationIata,
      onTimePercent: remotePromptness.details.overall.ontimePercent,

      onTimeCount: remotePromptness.chart.onTime,
      cancelledCount: remotePromptness.chart.cancelled,
      lateCount: remotePromptness.chart.late,
      veryLateCount: remotePromptness.chart.veryLate,
      excessiveCount: remotePromptness.chart.excessive,
      divertedCount: remotePromptness.chart.diverted,
      flightsObservered: remotePromptness.statistics.totalObservations,
      daysObserved: 60,
      expiresAt,
      rating,
      averageDelayTimeMs,
    },
    update: {
      onTimeCount: remotePromptness.chart.onTime,
      cancelledCount: remotePromptness.chart.cancelled,
      lateCount: remotePromptness.chart.late,
      veryLateCount: remotePromptness.chart.veryLate,
      excessiveCount: remotePromptness.chart.excessive,
      divertedCount: remotePromptness.chart.diverted,
      flightsObservered: remotePromptness.statistics.totalObservations,
      daysObserved: 60,
      expiresAt,
      rating,
      averageDelayTimeMs,
    },
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
    where: {
      id: flightID,
    },
    select: {
      airlineIata: true,
      flightNumber: true,
      originIata: true,
      destinationIata: true,
    },
  });

  const promptness = await prisma.flightPromptness.findFirst({
    where: {
      airlineIata: flight.airlineIata,
      flightNumber: flight.flightNumber,
      originIata: flight.originIata,
      destinationIata: flight.destinationIata,
    },
  });

  if (
    !promptness ||
    moment().subtract(7, 'days').isBefore(promptness.updatedAt)
  ) {
    return upsertFlightPromptness(flight);
  }

  return promptness;
}
