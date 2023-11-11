import moment from 'moment';
import { format } from 'sys';
import { Airport } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';
import { TSA } from '@app/vendors/airports/tsa';
import { RequiredAll } from '@app/types/required.all';
import { US_COUNTRY } from '@app/lib/constants/countries';

export async function createTsaWaitTimeForAirport(
  airport: RequiredAll<Pick<Airport, 'iata' | 'id'>>,
) {
  const result = await TSA.getAirportWaitTimes(airport.iata);
  const entry = await prisma.jsonCache.create({
    data: {
      data: result.data,
      expiresAt: moment().add(7, 'days').toDate(),
      id: format('%s_tsa_wait_time', airport.iata),
    },
  });

  Logger.warn('TSA wait time for airport %s created', airport.iata);
  return entry;
}

export async function createTsaCheckpointsForAirport(
  airportIata: string,
  dayOfWeek: number,
) {
  const result = await TSA.getAirportCheckpointsStatus(airportIata, dayOfWeek);
  const entry = await prisma.jsonCache.create({
    data: {
      data: result.terminals,
      expiresAt: moment().add(7, 'days').toDate(),
      id: format('%s_day_%s_tsa_checkpoints', airportIata, dayOfWeek),
    },
  });

  return entry;
}

export async function getTsaWaitTimeForFlight(airportIata: string) {
  const airport = await prisma.airport.findFirstOrThrow({
    where: {
      iata: airportIata,
    },
  });

  if (airport.countryCode !== US_COUNTRY) {
    return undefined;
  }

  const waitTime = await prisma.jsonCache.findFirst({
    where: {
      id: format('%s_tsa_wait_time', airport.iata),
    },
  });

  return (
    waitTime ??
    createTsaWaitTimeForAirport({
      iata: airport.iata!,
      id: airport.id,
    })
  );
}

export async function getTsaAirportCheckpoints(
  airportIata: string,
  dayOfWeek: number,
) {
  const airport = await prisma.airport.findFirstOrThrow({
    where: {
      iata: airportIata,
    },
  });

  if (airport.countryCode !== US_COUNTRY) {
    return undefined;
  }

  const checkpoints = await prisma.jsonCache.findFirst({
    where: {
      id: format('%s_day_%s_tsa_checkpoints', airportIata, dayOfWeek),
    },
  });

  return checkpoints ?? createTsaCheckpointsForAirport(airportIata, dayOfWeek);
}
