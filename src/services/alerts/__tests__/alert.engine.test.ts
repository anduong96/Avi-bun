import moment from 'moment';
import { Flight, FlightStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, mock } from 'bun:test';

import { findAlertableFlightDiff } from '../alert.engine';

describe('services::alerts::alert.engine', () => {
  const mockSendToTopic = mock(() => {
    return Promise.resolve(1);
  });

  mock.module('@app/firebase', () => ({
    firebase: {
      messaging: () => ({
        sendToTopic: mockSendToTopic,
      }),
    },
  }));

  const makeDate = (date: string) => moment(date, 'YYYY-MM-DD HH:mm').toDate();
  const destinationUtcHourOffset = 5;
  const originUtcHourOffset = 2;
  const currentFlight = {
    destinationUtcHourOffset,
    estimatedGateArrival: makeDate('2023-04-01 03:20'),
    estimatedGateDeparture: makeDate('2023-04-01 03:10'),
    originUtcHourOffset,
    status: FlightStatus.DEPARTED,
  } as Flight;
  const nextFlight: Flight = {
    destinationUtcHourOffset,
    estimatedGateArrival: makeDate('2023-04-01 04:20'),
    estimatedGateDeparture: makeDate('2023-04-01 02:10'),
    originUtcHourOffset,
    status: FlightStatus.CANCELED,
  } as Flight;

  beforeEach(() => {
    mockSendToTopic.mockClear();
  });

  it('test findAlertableFlightDiff', () => {
    const diff = findAlertableFlightDiff(nextFlight, currentFlight);
    expect(diff).toEqual([
      {
        changeType: 'MODIFIED',
        currentValue: nextFlight.estimatedGateArrival,
        description: 'Arrival Time was changed to 4:20 AM',
        key: 'ArrivalTime',
        previousValue: currentFlight.estimatedGateArrival,
        valueType: 'DATE',
      },
      {
        changeType: 'MODIFIED',
        currentValue: nextFlight.estimatedGateDeparture,
        description: 'Departure Time was changed to 2:10 AM',
        key: 'DepartureTime',
        previousValue: currentFlight.estimatedGateDeparture,
        valueType: 'DATE',
      },
      {
        changeType: 'MODIFIED',
        currentValue: 'CANCELED',
        description: 'Status was changed to CANCELED',
        key: 'Status',
        previousValue: 'DEPARTED',
        valueType: 'STRING',
      },
    ]);
  });
});
