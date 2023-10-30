import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';

function getData(name: string) {
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
  const data = await getData('country');
  await prisma.country.createMany({ data });
}

async function populateCity() {
  const data = await getData('city');
  await prisma.city.createMany({ data });
}

async function populateAirport() {
  const data = await getData('airport');
  await prisma.airport.createMany({ data });
}

async function populateAirline() {
  const data = await getData('airline');
  await prisma.airline.createMany({ data });
}

Logger.warn('Upsert database');
await nuke();
await populateCountry();
await populateCity();
await populateAirport();
await populateAirline();
await prisma.$disconnect();
Logger.info('Disconnected from database');
