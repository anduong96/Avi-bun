import moment from 'moment';
import { format } from 'sys';
import { isEmpty, omit } from 'lodash';
import { Flight } from '@prisma/client';
import { Prisma, ValueType } from '@prisma/client';

import { Logger } from '@app/lib/logger';
import { timezoneToUtcOffset } from '@app/lib/timezone';
import { FlightDetails } from '@app/flight.vendors/flight.stats/types';

type FlightStatsTimeline = FlightDetails['eventTimeline'][number];
type FlightStatsEvent = FlightStatsTimeline['events'][number];

function transformEvent(
  event: FlightStatsEvent,
  originTimezone: string,
  destinationTimezone: string,
): Pick<
  Prisma.FlightEventCreateInput,
  | 'currentValue'
  | 'description'
  | 'previousValue'
  | 'requireAlert'
  | 'valueType'
> | null {
  if ('eventText' in event) {
    return {
      description: event.eventText,
      requireAlert: false,
    };
  } else if ('newDate' in event && 'oldDate' in event) {
    const isOrigin = event.changed.includes('Departure');
    const isDestination = event.changed.includes('Arrival');
    if (!isOrigin && !isDestination) {
      return null;
    }

    const timezone = isOrigin ? originTimezone : destinationTimezone;
    const timezoneOffset = timezoneToUtcOffset(timezone);
    const originTimeStr = format(
      '%s %s',
      event.fromMonth0.trim(),
      event.fromTime0.trim(),
    );
    const newTimeStr = format(
      '%s %s',
      event.toMonth0.trim(),
      event.toTime0.trim(),
    );

    const originalTime = moment(originTimeStr, 'from DD-MMM-YYYY HH:mm')
      .utcOffset(timezoneOffset)
      .toDate();

    const newTime = moment(newTimeStr, 'to DD-MMM-YYYY HH:mm')
      .utcOffset(timezoneOffset)
      .toDate();

    return {
      currentValue: newTime,
      description: event.changed,
      previousValue: originalTime,
      requireAlert: true,
      valueType: ValueType.DATE,
    };
  }

  return null;
}

function composeEvents(
  flightID: string,
  timelineID: string,
  timeline: FlightStatsTimeline,
  originTimezone: string,
  destinationTimezone: string,
): Prisma.FlightEventUncheckedCreateInput[] {
  const events: Prisma.FlightEventUncheckedCreateInput[] = [];
  for (const event of timeline.events) {
    const transformed = transformEvent(
      event,
      originTimezone,
      destinationTimezone,
    );

    if (!transformed) {
      Logger.warn('Flight[%s] Unsupported event: %o', flightID, event);
      continue;
    }

    const index = timeline.events.indexOf(event);
    events.push({
      ...transformed,
      flightID,
      flightTimelineID: timelineID,
      id: format('%s_event_%s', timelineID, index),
      index: timeline.events.indexOf(event),
      timestamp: new Date(timeline.sortTime),
    });
  }

  return events;
}

export function getFlightTimelinePayload(
  flightID: Flight['id'],
  data: FlightDetails,
) {
  const entryIds: string[] = [];
  const initialTimelineID = format('%s_timeline_%s', flightID, 1);
  const payloads: Prisma.FlightTimelineUncheckedCreateInput[] = [
    {
      flightID,
      id: initialTimelineID,
      source: 'Avi',
      timestamp: new Date(),
      title: 'Entry created',
    },
  ];

  for (const entry of data.eventTimeline) {
    const timestamp = new Date(entry.sortTime);
    const timelineID = format('%s_timeline_%s', flightID, timestamp.getTime());
    const events = composeEvents(
      flightID,
      timelineID,
      entry,
      data.departureAirport.timeZoneRegionName,
      data.arrivalAirport.timeZoneRegionName,
    );

    if (isEmpty(events)) {
      continue;
    }

    payloads.push({
      FlightEvents: {
        createMany: {
          data: events.map(event => omit(event, ['flightTimelineID'])),
        },
      },
      flightID,
      id: timelineID,
      source: entry.source,
      timestamp: timestamp,
      title: entry.title,
    });

    entryIds.push(timelineID);
  }

  return payloads;
}
