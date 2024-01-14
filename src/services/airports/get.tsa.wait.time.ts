import { format } from 'sys';
import { Airport } from '@prisma/client';

import { TSA } from '@app/vendors/airports/tsa';
import { RequiredAll } from '@app/types/required.all';

import { assertIsAirportUSA } from '../airport/is.airport.usa';
import { getCachedEntry } from '../json.cache/get.cached.entry';
import { upsertCachedEntry } from '../json.cache/upsert.cached.entry';

export async function createTsaWaitTimeForAirport(
  airport: RequiredAll<Pick<Airport, 'iata'>>,
) {
  const result = await TSA.getAirportWaitTimes(airport.iata);
  const ID = format('%s_tsa_wait_time', airport.iata);
  await upsertCachedEntry(ID, result.data);
  return result.data;
}

export async function createTsaCheckpointsForAirport(
  airportIata: string,
  dayOfWeek: number,
) {
  const result = await TSA.getAirportCheckpointsStatus(airportIata, dayOfWeek);
  const id = format('%s_day_%s_tsa_checkpoints', airportIata, dayOfWeek);
  await upsertCachedEntry(id, result.terminals);
  return result.terminals;
}

export async function getTsaWaitTimeForFlight(airportIata: string) {
  type Result = Awaited<
    ReturnType<(typeof TSA)['getAirportWaitTimes']>
  >['data'];

  await assertIsAirportUSA(airportIata);
  const key = format('%s_tsa_wait_time', airportIata);
  const data = await getCachedEntry<Result>(key);
  return data ?? createTsaWaitTimeForAirport({ iata: airportIata });
}

export async function getTsaAirportCheckpointsStatus(
  airportIata: string,
  dayOfWeek: number,
) {
  type Result = ReturnType<typeof createTsaCheckpointsForAirport>;
  await assertIsAirportUSA(airportIata);
  const ID = format('%s_day_%s_tsa_checkpoints', airportIata, dayOfWeek);
  const data = await getCachedEntry<Result>(ID);
  return data ?? createTsaCheckpointsForAirport(airportIata, dayOfWeek);
}
