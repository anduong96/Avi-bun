import { Flight } from '@prisma/client';

/**
 * The function `buildFlightLink` takes a flight ID as input and returns a flight link in the format
 * `flywithavi://flights/{flightID}`.
 * @param {string} flightID - The flightID parameter is a string that represents the unique identifier
 * of a flight.
 * @returns a flight link in the format "flywithavi://flights/{flightID}".
 */
export function buildFlightLink(flightID: Flight['id']) {
  return `flywithavi://flights/${flightID}`;
}

export function buildFlightLinkData(flightID: Flight['id']) {
  return {
    url: buildFlightLink(flightID),
  };
}
