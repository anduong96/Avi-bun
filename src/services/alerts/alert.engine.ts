import { format } from 'sys';
import { Flight } from '@prisma/client';
import moment, { isDate } from 'moment';
import { isEmpty, startCase } from 'lodash';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { Sentry } from '@app/lib/sentry';
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
  Status: string;
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
export function findAlertableFlightDiff(current: Flight, previous: Flight) {
  const scheduled: AlertableFlight = {
    ArrivalGate: previous.destinationGate,
    ArrivalTerminal: previous.destinationTerminal,
    ArrivalTime: moment(
      previous.scheduledGateArrival || previous.estimatedGateArrival,
    )
      .utcOffset(previous.destinationUtcHourOffset)
      .toDate(),
    DepartureGate: previous.originGate,
    DepartureTerminal: previous.originTerminal,
    DepartureTime: moment(
      previous.scheduledGateDeparture || previous.estimatedGateDeparture,
    )
      .utcOffset(previous.originUtcHourOffset)
      .toDate(),
    Status: previous.status,
  };

  const estimated: AlertableFlight = {
    ArrivalGate: current.destinationGate,
    ArrivalTerminal: current.destinationTerminal,
    ArrivalTime: moment(current.estimatedGateArrival)
      .utcOffset(current.destinationUtcHourOffset)
      .toDate(),
    DepartureGate: current.originGate,
    DepartureTerminal: current.originTerminal,
    DepartureTime: moment(current.estimatedGateDeparture)
      .utcOffset(current.originUtcHourOffset)
      .toDate(),
    Status: current.status,
  };

  return getObjectDifference(estimated, scheduled, (k, value, type) => {
    const keyName = startCase(k);

    return type === 'ADDED'
      ? format('%s was added', keyName)
      : type === 'REMOVED'
        ? format('%s was removed', keyName)
        : format(
            '%s was changed to %s',
            keyName,
            isDate(value) ? moment(value).format('LT') : value,
          );
  });
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
export function getFlightAlertPayload(
  flight: Flight,
  changes: DiffEntry[],
): Parameters<typeof sendFlightAlert>[1] {
  const maxDisplay = 3;
  const hasOverMax = changes.length > maxDisplay;
  const title = format(
    '⚠️ %s%s on %s Updates',
    flight.airlineIata,
    flight.flightNumber,
    moment(flight.estimatedGateDeparture).format('MM/DD/YYYY'),
  );
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

  return {
    body,
    title,
  };
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
          data: changes.map((entry, index) => ({
            changeType: entry.changeType,
            currentValue: entry.currentValue ?? undefined,
            description: entry.description,
            flightID,
            id: createID(),
            index,
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
  Logger.debug('Flight[%s] changes difference=%o', flightID, difference);
  Logger.debug('Flight[%s] diff', flightID, { current, previous });

  if (isEmpty(difference)) {
    return;
  }

  const [createdTimeline, sentAlerts] = await Promise.allSettled([
    createFlightChangeTimeline(current, difference).catch(error => {
      Sentry.captureException(error);
      Logger.error('Failed to create flight timeline', error);
    }),
    difference.length > 0
      ? sendFlightAlert(
          flightID,
          getFlightAlertPayload(current, difference),
        ).catch(error => {
          Sentry.captureException(error);
          Logger.error('Failed to send flight alert', error);
        })
      : null,
  ]);

  Logger.debug(
    'Flight[%s] changes handled createdTimeline=%s sentAlerts=%s',
    flightID,
    createdTimeline.status,
    sentAlerts.status,
  );
}
