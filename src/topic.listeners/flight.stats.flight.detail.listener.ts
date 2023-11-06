import moment from 'moment';
import { format } from 'sys';
import { isEmpty, omit, pick } from 'lodash';
import { Prisma, ValueType } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { Sentry } from '@app/lib/sentry';
import { timezoneToUtcOffset } from '@app/lib/timezone';
import { TopicPublisher } from '@app/topics/topic.publisher';
import { FlightStatsFlightDetailTopic } from '@app/topics/defined.topics/flight.stats.flight.detail.topic';

function transformEvent(
  event: FlightStatsFlightDetailTopic['data']['eventTimeline'][number]['events'][number],
  originTimezone: string,
  destinationTimezone: string,
): Pick<
  Prisma.FlightEventCreateInput,
  | 'changedValue'
  | 'changedValueType'
  | 'description'
  | 'prevValue'
  | 'prevValueType'
  | 'requireAlert'
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
      changedValue: newTime,
      changedValueType: ValueType.DATE,
      description: event.changed,
      prevValue: originalTime,
      prevValueType: ValueType.DATE,
      requireAlert: true,
    };
  }

  return null;
}

function composeEvents(
  flightID: string,
  timelineID: string,
  timeline: FlightStatsFlightDetailTopic['data']['eventTimeline'][number],
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

TopicPublisher.subscribe(FlightStatsFlightDetailTopic, async topic => {
  const hasTimeline = await prisma.flightTimeline.findFirst({
    select: {
      id: true,
    },
    where: {
      flightID: topic.flightID,
    },
  });

  if (hasTimeline) {
    return;
  }

  Logger.debug(
    'Creating flight timeline for Flight[%s] with %s events',
    topic.flightID,
    topic.data.eventTimeline.length,
  );

  try {
    await prisma.$transaction(async $tx => {
      const entryIds: string[] = [];
      const initial = await $tx.flightTimeline.create({
        data: {
          flightID: topic.flightID,
          id: format('%s_timeline_%s', topic.flightID, 1),
          source: 'Avi',
          timestamp: new Date(),
          title: 'Entry created',
        },
        select: {
          id: true,
        },
      });

      for await (const entry of topic.data.eventTimeline) {
        const timestamp = new Date(entry.sortTime);
        const timelineID = format(
          '%s_timeline_%s',
          topic.flightID,
          timestamp.getTime(),
        );
        const events = composeEvents(
          topic.flightID,
          timelineID,
          entry,
          topic.data.departureAirport.timeZoneRegionName,
          topic.data.arrivalAirport.timeZoneRegionName,
        );

        if (isEmpty(events)) {
          continue;
        }

        const timeline = await $tx.flightTimeline.upsert({
          create: {
            FlightEvents: {
              createMany: {
                data: events.map(event => omit(event, ['flightTimelineID'])),
              },
            },
            flightID: topic.flightID,
            id: timelineID,
            source: entry.source,
            timestamp: timestamp,
            title: entry.title,
          },
          select: {
            id: true,
          },
          update: {
            FlightEvents: {
              upsert: events.map((event, index) => ({
                create: omit(event, ['flightTimelineID']),
                update: pick(event, [
                  'changedValue',
                  'changedValueType',
                  'description',
                  'prevValue',
                  'prevValueType',
                  'requireAlert',
                ]),
                where: {
                  flightID_flightTimelineID_index: {
                    flightID: topic.flightID,
                    flightTimelineID: timelineID,
                    index: index,
                  },
                },
              })),
            },
          },
          where: {
            flightID_timestamp: {
              flightID: topic.flightID,
              timestamp: timestamp,
            },
          },
        });

        entryIds.push(timeline.id);
      }

      entryIds.unshift(initial.id);
      Logger.debug('Flight timeline created: %o', entryIds);
    });
  } catch (error) {
    Sentry.captureException(error);
    Logger.error('Failed to create flight timeline: %o', error);
  }
});
