import ky from 'ky';
import { tryNice } from 'try-nice';
import { ImageType } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';

// https://api.travelpayouts.com/data/en/airlines.json
const baseURL =
  'https://raw.githubusercontent.com/anduong96/airlines-logos/main';

async function getData<T>(route: string) {
  return ky.get(baseURL + route).then(res => res.json<T>());
}

async function populateAirlines() {
  Logger.info('Getting airlines');
  const response = await getData<
    Array<{
      iata: string;
      isLowCost: boolean;
      logoCompactImageType: ImageType;
      logoCompactImageURL: string;
      logoFullImageType: ImageType;
      logoFullImageURL: string;
      name: string;
    }>
  >('/airlines.json');
  Logger.warn('Creating airlines count[%s]', response.length);
  await prisma.$transaction([
    prisma.airline.deleteMany({}),
    prisma.airline.createMany({
      data: response.map(item => ({
        iata: item.iata,
        isLowCost: item.isLowCost,
        logoCompactImageType: item.logoCompactImageType,
        logoCompactImageURL: item.logoCompactImageURL,
        logoFullImageType: item.logoFullImageType,
        logoFullImageURL: item.logoFullImageURL,
        name: item.name,
      })),
    }),
  ]);
  Logger.info('Created airlines');
}

async function populateAirports() {
  Logger.info('Getting airports');
  type Entry = {
    cityCode: string;
    cityName: string;
    countryCode: string;
    countyName: string;
    elevation: number;
    iata: string;
    icaoCode: string;
    location: { coordinates: number[] };
    name: string;
    state: string;
    timezone: string;
  };

  const response = await getData<Array<Entry>>('/airports.json');

  Logger.warn('Creating airports count[%s]', response.length);
  await prisma.$transaction([
    prisma.airport.deleteMany({}),
    prisma.airport.createMany({
      data: response
        .filter(item => !item.cityCode.includes('Raiway Stn'))
        .map(item => ({
          cityCode: item.cityCode,
          cityName: item.cityName,
          countryCode: item.countryCode,
          countyName: item.countyName,
          elevation: item.elevation,
          iata: item.iata,
          latitude: item.location?.coordinates[1] ?? -1,
          longitude: item.location?.coordinates[0] ?? -1,
          name: item.name
            .replace('International', 'Intl')
            .replace('Airport', ''),
          state: item.state,
          timezone: item.timezone,
        })),
    }),
  ]);
  Logger.info('Created airports');
}

async function populateCities() {
  Logger.info('Getting cities');
  const response = await getData<
    Array<{
      countryCode: string;
      iata: string;
      location: { coordinates: number[] };
      name: string;
      timezone: string;
    }>
  >('/cities.json');
  Logger.warn('Creating cities count[%s]', response.length);
  await prisma.$transaction([
    prisma.city.deleteMany({}),
    prisma.city.createMany({
      data: response.map(item => ({
        code: item.iata,
        countryCode: item.countryCode,
        latitude: item.location?.coordinates[1] ?? -1,
        longitude: item.location?.coordinates[0] ?? -1,
        name: item.name,
        timezone: item.timezone,
      })),
    }),
  ]);
  Logger.info('Created cities');
}

async function populateCountries() {
  Logger.info('Getting countries');
  const response = await getData<
    Array<{
      dialCode: string;
      flagImageType: ImageType;
      flagImageUri: string;
      isoCode: string;
      name: string;
    }>
  >('/countries.json');
  Logger.warn('Creating countries count[%s]', response.length);
  await prisma.$transaction([
    prisma.country.deleteMany({}),
    prisma.country.createMany({
      data: response.map(item => ({
        dialCode: item.dialCode,
        flagImageType: item.flagImageType,
        flagImageURL: item.flagImageUri,
        isoCode: item.isoCode,
        name: item.name,
      })),
    }),
  ]);
  Logger.info('Created countries');
}

Logger.warn('Upsert database');
const [r, error] = await tryNice(() =>
  Promise.allSettled([
    populateAirlines(),
    populateCountries(),
    populateCities(),
    populateAirports(),
  ]),
);

await prisma.$disconnect();
Logger.info('Disconnected from database');

if (!r) {
  Logger.error(error);
} else {
  Logger.warn('seed result', r);
}
