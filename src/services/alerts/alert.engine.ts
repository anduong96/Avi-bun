import * as uuid from 'uuid';
import { format } from 'sys';
import { Flight } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
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

function createAndSendFlightAlert(flight: Flight, changes: DiffEntry[]) {
  const maxDisplay = 3;
  const hasOverMax = changes.length > maxDisplay;
  const title = format('⚠️ %s%s', flight.airlineIata, flight.flightNumber);
  const body = format(
    changes.length === 1
      ? '%s was changed'
      : hasOverMax
      ? '%s and %d more were changed'
      : '%s were changed',
    changes
      .slice(0, maxDisplay)
      .map(entry => entry.key)
      .join(', '),
  );

  return sendFlightAlert(flight.id, {
    body,
    title,
  });
}

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
            id: uuid.v4(),
            previousValue: entry.previousValue ?? undefined,
            requireAlert: true,
            timestamp: new Date(),
            valueType: entry.valueType,
          })),
        },
      },
      flightID,
      id: uuid.v4(),
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

export async function handleFlightChangesForAlert(
  current: Flight,
  previous: Flight,
) {
  const difference = findAlertableFlightDiff(current, previous);
  const [createdTimeline, sentAlerts] = await Promise.allSettled([
    createFlightChangeTimeline(current, difference),
    difference.length > 0
      ? createAndSendFlightAlert(current, difference)
      : null,
  ]);

  Logger.debug('Flight changes handled', {
    createdTimeline: createdTimeline.status,
    sentAlerts: sentAlerts.status,
  });
}
