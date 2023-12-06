import { chunk } from 'lodash';
import { Airline, Airport, City, Country } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';

/**
 * Sometimes database is not large enough to create 1000s at a time
 */
const maxCreationPerTransaction = 20;

function getData<T>(name: string): Promise<T[]> {
  return Bun.file(`./prisma/seed/data/${name}.json`).json();
}

async function nuke() {
  await prisma.$transaction([
    prisma.airport.deleteMany(),
    prisma.city.deleteMany(),
    prisma.country.deleteMany(),
    prisma.airline.deleteMany(),
  ]);
}

async function populateCountry() {
  const counties = await getData<Country>('country');
  for (const data of chunk(counties, maxCreationPerTransaction)) {
    await prisma.country.createMany({
      data,
    });
  }
}

async function populateCity() {
  const cities = await getData<City>('city');
  for (const data of chunk(cities, maxCreationPerTransaction)) {
    await prisma.city.createMany({
      data,
    });
  }
}

async function populateAirport() {
  const airports = await getData<Airport>('airport');
  for (const data of chunk(airports, maxCreationPerTransaction)) {
    await prisma.airport.createMany({
      data,
    });
  }
}

async function populateAirline() {
  const airlines = await getData<Airline>('airline');
  for (const data of chunk(airlines, maxCreationPerTransaction)) {
    await prisma.airline.createMany({
      data,
    });
  }
}

Logger.warn('Upsert database');
await nuke();
await populateCountry();
await populateCity();
await populateAirport();
await populateAirline();
await prisma.$disconnect();
Logger.info('Disconnected from database');
