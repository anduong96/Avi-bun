import { format } from 'sys';

import { Coordinates } from '@app/types/coordinates';

/**
 * The function `getCoordinateString` takes a `Coordinates` object and returns a string representation
 * of its latitude and longitude values.
 * @param {Coordinates} coordinate - The parameter `coordinate` is of type `Coordinates`.
 * @returns a string that represents the latitude and longitude coordinates.
 */
export function getCoordinateString(coordinate: Coordinates) {
  return format('%s,%s', coordinate.latitude, coordinate.longitude);
}
