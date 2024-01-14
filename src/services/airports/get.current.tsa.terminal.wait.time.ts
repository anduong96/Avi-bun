import { format } from 'sys';

import { Logger } from '@app/lib/logger';
import { QSensor } from '@app/vendors/airports/qsensor';
import { QSensor_TerminalMetadata } from '@app/vendors/airports/qsensor/types';

import { assertIsAirportUSA } from '../airport/is.airport.usa';
import { getCachedEntry } from '../json.cache/get.cached.entry';
import { upsertCachedEntry } from '../json.cache/upsert.cached.entry';

function getKey(airportIata: string) {
  return format('%s_current_tsa_terminal_estimated_wait_time', airportIata);
}

/**
 * The function `upsertCurrentTsaTerminalWaitTime` retrieves current security metadata for a given
 * airport and upserts it into a JSON cache table, returning the updated terminal data.
 * @param {string} airportIata - The `airportIata` parameter is a string that represents the IATA code
 * of the airport.
 * @returns an array of Terminal objects.
 */
export async function upsertCurrentTsaTerminalWaitTime(airportIata: string) {
  try {
    await assertIsAirportUSA(airportIata);
    const result = await QSensor.getCurrentSecurityMetadata(airportIata);
    const key = getKey(airportIata);
    await upsertCachedEntry(key, result.terminals);
    return result.terminals;
  } catch (error) {
    Logger.error('Failed to get current TSA terminal wait time\n', error);
    return null;
  }
}

/**
 * The function `getCurrentTsaTerminalWaitTime` retrieves the current TSA terminal wait time for a
 * given airport IATA code, and if the data is not available or expired, it updates the data and
 * returns it.
 * @param {string} airportIata - The `airportIata` parameter is a string that represents the IATA code
 * of an airport. IATA codes are three-letter codes used to identify airports worldwide.
 * @returns the current TSA terminal wait time for a given airport.
 */
export async function getCurrentTsaTerminalWaitTime(airportIata: string) {
  const ID = getKey(airportIata);
  const data = await getCachedEntry<QSensor_TerminalMetadata[]>(ID, {
    nilOnExpired: true,
  });

  return data ?? upsertCurrentTsaTerminalWaitTime(airportIata);
}
