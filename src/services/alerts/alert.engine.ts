import { format } from 'sys';
import { startCase } from 'lodash';
import moment, { isDate } from 'moment';
import { Flight } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { createID } from '@app/lib/create.id';
import { Optional } from '@app/types/optional';
import { DiffEntry } from '@app/lib/objects/object.difference/types';
import { getObjectDifference } from '@app/lib/objects/object.difference/get.object.difference';

import { sendFlightAlert } from './flight.alert';

type AlertableFlight = {
  ArrivalGate: Optional<string>;
  ArrivalTerminal: Optional<string>;
  ArrivalTime: Date;
  DepartureGate: Optional<string>;
  DepartureTerminal: Optional<string>;
  DepartureTime: Date;
};

/**
 * The function `findAlertableFlightDiff` compares the scheduled and estimated flight details and
 * returns the differences between them.
 * @param {Flight} current - The `current` parameter represents the current flight information,
 * including the estimated gate arrival and departure times, as well as the gate and terminal
 * information for both the origin and destination airports.
 * @param {Flight} previous - The `previous` parameter is an object representing the previous flight.
 * It contains the following properties:
 * @returns the difference between the scheduled flight details and the estimated flight details.
 */
function findAlertableFlightDiff(current: Flight, previous: Flight) {
  const scheduled: AlertableFlight = {
    ArrivalGate: previous.destinationGate,
    ArrivalTerminal: previous.destinationTerminal,
    ArrivalTime: previous.scheduledGateArrival,
    DepartureGate: previous.originGate,
    DepartureTerminal: previous.originTerminal,
    DepartureTime: previous.scheduledGateDeparture,
  };
  const estimated: AlertableFlight = {
    ArrivalGate: current.destinationGate,
    ArrivalTerminal: current.destinationTerminal,
    ArrivalTime: current.estimatedGateArrival,
    DepartureGate: current.originGate,
    DepartureTerminal: current.originTerminal,
    DepartureTime: current.estimatedGateDeparture,
  };

  return getObjectDifference(scheduled, estimated);
}

/**
 * The function creates and sends a flight alert with information about changes made to a flight.
 * @param {Flight} flight - The `flight` parameter is an object that represents a flight. It contains
 * properties such as `airlineIata` (the airline's IATA code) and `flightNumber` (the flight number).
 * @param {DiffEntry[]} changes - An array of DiffEntry objects representing the changes made to the
 * flight. Each DiffEntry object has a key property representing the changed attribute.
 * @returns the result of calling the `sendFlightAlert` function with the `flight.id` and an object
 * containing the `body` and `title` properties.
 */
function createAndSendFlightAlert(flight: Flight, changes: DiffEntry[]) {
  const maxDisplay = 3;
  const hasOverMax = changes.length > maxDisplay;
  const title = format('⚠️ %s%s', flight.airlineIata, flight.flightNumber);
  Logger.debug('Flight[%s] alert created changes=%o', flight.id, changes);

  const body =
    changes.length === 1
      ? format(
          '%s was changed to %s',
          startCase(changes[0].key),
          isDate(changes[0].currentValue)
            ? moment(changes[0].currentValue)
                .utcOffset(
                  changes[0].key === 'ArrivalTime'
                    ? flight.destinationUtcHourOffset
                    : flight.originUtcHourOffset,
                )
                .format('HH:mm A')
            : changes[0].currentValue,
        )
      : format(
          hasOverMax ? '%s and %d more were changed' : '%s were changed',
          changes
            .slice(0, maxDisplay)
            .map(entry => startCase(entry.key))
            .join(', '),
        );

  return sendFlightAlert(flight.id, {
    body,
    title,
  });
}

/**
 * The function creates a flight timeline with specified changes for a given flight.
 * @param {Flight} flight - The `flight` parameter is an object that represents a flight. It likely has
 * properties such as `id`, `origin`, `destination`, `departureTime`, etc. This object is used to
 * identify the flight for which the timeline is being created.
 * @param {DiffEntry[]} changes - The `changes` parameter is an array of `DiffEntry` objects. Each
 * `DiffEntry` object represents a change made to the flight. It has the following properties:
 */
async function createFlightChangeTimeline(
  flight: Flight,
  changes: DiffEntry[],
) {
  const flightID = flight.id;
  Logger.debug('Creating flight timeline for flight[%s]', flightID);
  const title = format(
    '%s was changed',
    changes.map(entry => entry.key).join(', '),
  );

  const timeline = await prisma.flightTimeline.create({
    data: {
      FlightEvents: {
        createMany: {
          data: changes.map(entry => ({
            changeType: entry.changeType,
            currentValue: entry.currentValue ?? undefined,
            description: entry.description,
            flightID,
            id: createID(),
            previousValue: entry.previousValue ?? undefined,
            requireAlert: true,
            timestamp: new Date(),
            valueType: entry.valueType,
          })),
        },
      },
      flightID,
      id: createID(),
      source: 'Avi',
      timestamp: new Date(),
      title: title,
    },
    select: {
      id: true,
    },
  });

  Logger.debug(
    'Flight timeline[%s] created for flight[%s]',
    timeline.id,
    flightID,
  );
}

/**
 * The function `handleFlightChangesForAlert` handles flight changes by creating a timeline of the
 * changes and sending alerts if there are any differences between the current and previous flight.
 * @param {Flight} current - The `current` parameter represents the current state of a flight. It is an
 * object that contains information about the flight, such as its ID, departure time, arrival time, and
 * any other relevant details.
 * @param {Flight} previous - The `previous` parameter is the previous state of the flight, which
 * represents the flight information before any changes occurred.
 */
export async function handleFlightChangesForAlert(
  current: Flight,
  previous: Flight,
) {
  const flightID = current.id;
  Logger.debug('Handling Flight[%s] changes for alert', flightID);
  const difference = findAlertableFlightDiff(current, previous);
  Logger.debug('%s changes for Flight[%s]', difference.length, flightID);

  const [createdTimeline, sentAlerts] = await Promise.allSettled([
    createFlightChangeTimeline(current, difference),
    difference.length > 0
      ? createAndSendFlightAlert(current, difference)
      : null,
  ]);

  Logger.debug(
    'Flight[%s] changes handled createdTimeline=%s sentAlerts=%s',
    flightID,
    createdTimeline.status,
    sentAlerts.status,
  );
}
