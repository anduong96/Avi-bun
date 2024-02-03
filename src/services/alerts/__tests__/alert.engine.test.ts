import moment from 'moment';
import { Flight } from '@prisma/client';
import { describe, expect, it, mock } from 'bun:test';

import { findAlertableFlightDiff } from '../alert.engine';

const mockSendToTopic = () => {
  return {
    messageId: 1,
  };
};

mock.module('@app/firebase', () => ({
  firebase: {
    messaging: () => ({
      sendToTopic: mockSendToTopic,
    }),
  },
}));

describe('services::alerts::alert.engine', () => {
  it('findAlertableFlightDiff', () => {
    const changes = {
      current: {
        destinationUtcHourOffset: 5,
        estimatedGateArrival: moment(
          '2023-04-01 03:20',
          'YYYY-MM-DD HH:mm',
        ).toDate(),
        estimatedGateDeparture: moment(
          '2023-04-01 03:10',
          'YYYY-MM-DD HH:mm',
        ).toDate(),
        originUtcHourOffset: 5,
        status: 'CANCELLED',
      },
      previous: {
        destinationUtcHourOffset: 5,
        estimatedGateArrival: moment(
          '2023-04-01 03:12',
          'YYYY-MM-DD HH:mm',
        ).toDate(),
        estimatedGateDeparture: moment(
          '2023-04-01 03:10',
          'YYYY-MM-DD HH:mm',
        ).toDate(),
        originUtcHourOffset: 5,
        status: 'DEPARTED',
      },
    };

    const diff = findAlertableFlightDiff(
      changes.current as unknown as Flight,
      changes.previous as unknown as Flight,
    );

    expect(diff).toEqual([
      {
        changeType: 'MODIFIED',
        currentValue: changes.current.estimatedGateArrival,
        description: 'Arrival Time was changed to 3:20 AM',
        key: 'ArrivalTime',
        previousValue: changes.previous.estimatedGateArrival,
        valueType: 'DATE',
      },
      {
        changeType: 'MODIFIED',
        currentValue: 'CANCELLED',
        description: 'Status was changed to CANCELLED',
        key: 'Status',
        previousValue: 'DEPARTED',
        valueType: 'STRING',
      },
    ]);
  });
});
