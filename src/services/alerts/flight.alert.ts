import { AlertChannel, Flight } from '@prisma/client';

import { BasicObject } from '@app/types/common';
import FirebaseAdmin from 'firebase-admin';
import { Logger } from '../../lib/logger';
import { buildFlightLinkData } from '../links/flight.link';
import { merge } from 'lodash';
import { prisma } from '@app/prisma';

type Payload = {
  title: string;
  body: string;
  data?: BasicObject;
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
  { title, body, data }: Payload,
) {
  try {
    const response = await FirebaseAdmin.messaging().sendToTopic(flightID, {
      data: merge(buildFlightLinkData(flightID), data),
      notification: {
        title,
        body,
      },
    });

    const entry = await prisma.flightAlert.create({
      data: {
        flightID,
        title,
        body,
        receiptID: response.messageId.toString(),
        channel: [AlertChannel.PUSH],
      },
    });

    Logger.info('Flight alert sent', {
      flightID,
      responseID: response.messageId,
      recordID: entry.id,
    });

    return response.messageId;
  } catch (error) {
    Logger.error(error, 'Failed to send flight alert');
    throw error;
  }
}
