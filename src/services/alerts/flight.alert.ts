import { merge } from 'lodash';
import { AlertChannel, Flight } from '@prisma/client';

import { prisma } from '@app/prisma';
import { firebase } from '@app/firebase';
import { BasicObject } from '@app/types/common';

import { Logger } from '../../lib/logger';
import { buildFlightLinkData } from '../links/flight.link';

type Payload = {
  body: string;
  data?: BasicObject;
  title: string;
};

/**
 * The `sendFlightAlert` function sends a push notification to a specific flight's topic using Firebase
 * Cloud Messaging, and then logs the details of the sent alert.
 * @param flightID - The `flightID` parameter is the ID of the flight for which the alert is being
 * sent. It is of type `Flight['id']`, which means it is referencing the `id` property of the `Flight`
 * object.
 * @param {Payload}  - - `flightID`: The ID of the flight for which the alert is being sent.
 */
export async function sendFlightAlert(
  flightID: Flight['id'],
  { body, data, title }: Payload,
) {
  try {
    Logger.debug('Sending flight alert', {
      body,
      data,
      flightID,
      title,
    });

    /**
     * Not working right now
     * @see https://github.com/oven-sh/bun/issues/2036
     */
    const response = await firebase.messaging().sendToTopic(flightID, {
      data: merge(buildFlightLinkData(flightID), data),
      notification: {
        body,
        title,
      },
    });

    const entry = await prisma.flightAlert.create({
      data: {
        body,
        channel: [AlertChannel.PUSH],
        flightID,
        receiptID: response.messageId.toString(),
        title,
      },
    });

    Logger.info('Flight alert sent', {
      flightID,
      recordID: entry.id,
      responseID: response.messageId,
    });

    return response.messageId;
  } catch (error) {
    Logger.error(error, 'Failed to send flight alert');
    throw error;
  }
}
