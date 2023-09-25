import { toDateOrNull } from '@app/lib/date.or.null';
import { FlightStats } from '@app/lib/flight.vendors/flight.stats';
import { toFlightStatus } from '@app/lib/flight.vendors/flight.stats/utils';
import { Logger } from '@app/lib/logger';
import { prisma } from '@app/prisma';
import { FlightCreatedTopic } from '@app/topics/defined.topics/flight.created.topic';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { FlightQueryParam } from '@app/types/flight';
import { Flight, FlightVendor, Prisma } from '@prisma/client';
import { isEmpty } from 'lodash';
import * as uuid from 'uuid';

/**
 * The function `createFlightFromFlightStats` creates flights from flight data obtained from
 * FlightStats API.
 * @param {FlightQueryParam} param - The `param` parameter is an object that contains the following
 * properties:
 * @returns The function `createFlightFromFlightStats` returns a Promise that resolves to an array of
 * `Flight` objects.
 */
export async function createFlightFromFlightStats(param: FlightQueryParam) {
  const remoteFlights = await FlightStats.searchFlights({
    airlineIata: param.airlineIata,
    flightNumber: param.flightNumber,
  });

  Logger.debug(
    'Flight Stats search result for param[%o]\n %o\n',
    param,
    remoteFlights,
  );

  if (isEmpty(remoteFlights)) {
    throw new Error('No flight(s) found');
  }

  const detailedFlights = await Promise.allSettled(
    remoteFlights.map(entry =>
      FlightStats.getFlightDetails({
        flightID: entry.flightID,
        flightNumber: param.flightNumber,
        airlineIata: param.airlineIata,
        flightYear: entry.year,
        flightMonth: entry.month,
        flightDate: entry.date,
      }),
    ),
  );

  const payload: Prisma.FlightUncheckedCreateInput[] = [];

  for (const item of detailedFlights) {
    if (item.status !== 'fulfilled') {
      Logger.debug('Unable to get flight details', item.reason);
      continue;
    }

    const entry = item.value;
    const info = entry.additionalFlightInfo;
    const schedule = entry.schedule;
    const aircraftTailnumber = info.equipment?.tailNumber;
    const {
      scheduledGateDepartureUTC,
      scheduledGateArrivalUTC,
      estimatedGateArrivalUTC,
      estimatedGateDepartureUTC,
      actualGateArrivalUTC,
      actualGateDepartureUTC,
    } = schedule;

    const scheduledGateDeparture = toDateOrNull(
      scheduledGateDepartureUTC || estimatedGateDepartureUTC,
    );
    const scheduledGateArrival = toDateOrNull(
      scheduledGateArrivalUTC || estimatedGateArrivalUTC,
    );
    const estimatedGateArrival = toDateOrNull(
      estimatedGateArrivalUTC || scheduledGateArrivalUTC,
    );
    const estimatedGateDeparture = toDateOrNull(
      estimatedGateDepartureUTC || scheduledGateDepartureUTC,
    );

    payload.push({
      id: uuid.v4(),
      FlightVendorConnection: {
        create: {
          vendor: FlightVendor.FLIGHT_STATS,
          vendorResourceID: entry.flightId.toString(),
        },
      },
      flightYear: entry.flightYear,
      flightMonth: entry.flightMonth,
      flightDate: entry.flightDate,
      flightNumber: param.flightNumber,
      airlineIata: param.airlineIata,
      aircraftTailnumber: aircraftTailnumber,
      originIata: entry.departureAirport.iata,
      originTerminal: entry.departureAirport.terminal,
      originGate: entry.departureAirport.gate,
      destinationIata: entry.arrivalAirport.iata,
      destinationTerminal: entry.arrivalAirport.terminal,
      destinationGate: entry.arrivalAirport.gate,
      status: toFlightStatus(entry.status),
      scheduledGateDeparture: scheduledGateDeparture!,
      scheduledGateArrival: scheduledGateArrival!,
      estimatedGateArrival: estimatedGateArrival!,
      estimatedGateDeparture: estimatedGateDeparture!,
      actualGateArrival: toDateOrNull(actualGateArrivalUTC),
      actualGateDeparture: toDateOrNull(actualGateDepartureUTC),
    });
  }

  Logger.debug('here2');

  try {
    Logger.debug('Creating flights for param[%o]', param);
    const result = await prisma.$transaction(
      payload.map(entry =>
        prisma.flight.create({
          data: entry,
          select: {
            id: true,
          },
        }),
      ),
    );

    Logger.warn(
      'Created %d for Flight[%s%s] on %s/%s/%s',
      result.length,
      param.airlineIata,
      param.flightNumber,
      param.flightYear,
      param.flightMonth,
      param.flightDate,
    );

    TopicPublisher.broadcastAll(
      payload.map(entry => new FlightCreatedTopic(entry as Flight)),
    );

    return payload;
  } catch (error) {
    Logger.error('Unable to create flight(s)', error);
    throw new Error('Unable to create flight(s)');
  }
}
