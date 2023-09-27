import { FlightDetails } from './types';
import { FlightStats_Status } from './enums';
import { FlightStatus } from '@prisma/client';

/**
 * The function `parseFlightIdFromUrl` takes a URL as input and returns the value of the "flightId"
 * parameter in the URL.
 * @param {string} url - The `url` parameter is a string that represents a URL.
 * @returns the flightId value extracted from the URL.
 */
export function parseFlightIdFromUrl(url: string): string {
  // /flight-tracker/AA/1328?year=2023&month=08&date=26&flightId=1207666509

  const queryStr = url.split('?')[1];

  for (const pair of queryStr.split('&')) {
    const [key, value] = pair.split('=');
    if (key === 'flightId') {
      return value;
    }
  }

  throw new Error('Flight ID cannot be located');
}

/**
 * The function `toFlightStatus` converts a flight status from the `FlightStats_Status` enum to the
 * `FlightStatus` enum.
 */
export function toFlightStatus(
  status: FlightDetails['status']['status'],
): FlightStatus {
  switch (status) {
    case FlightStats_Status.ARRIVED:
      return FlightStatus.ARRIVED;

    case FlightStats_Status.CANCELED:
      return FlightStatus.CANCELED;

    case FlightStats_Status.DEPARTED:
      return FlightStatus.DEPARTED;

    case FlightStats_Status.LANDED:
      return FlightStatus.LANDED;

    case FlightStats_Status.SCHEDULED:
      return FlightStatus.SCHEDULED;

    case FlightStats_Status.ESTIMATED:
      return FlightStatus.SCHEDULED;

    default:
      return FlightStatus.SCHEDULED;
  }
}
