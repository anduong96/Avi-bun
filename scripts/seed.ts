import { Logger } from '@app/lib/logger';
import { prisma } from '@app/prisma';
import { ImageType } from '@prisma/client';
import ky from 'ky';
import { tryNice } from 'try-nice';

const baseURL =
  'https://raw.githubusercontent.com/anduong96/airlines-logos/main';

async function getData<T>(route: string) {
  return ky.get(baseURL + route).then(res => res.json<T>());
}

async function populateAirlines() {
  Logger.info('Getting airlines');
  const response = await getData<
    Array<{
      name: string;
      iata: string;
      isLowCost: boolean;
      logoFullImageType: ImageType;
      logoCompactImageType: ImageType;
      logoFullImageURL: string;
      logoCompactImageURL: string;
    }>
  >('/airlines.json');
  Logger.warn('Creating airlines count[%s]', response.length);
  await prisma.$transaction([
    prisma.airline.deleteMany({}),
    prisma.airline.createMany({
      data: response.map(item => ({
        name: item.name,
        iata: item.iata,
        isLowCost: item.isLowCost,
        logoFullImageType: item.logoFullImageType,
        logoCompactImageType: item.logoCompactImageType,
        logoCompactImageURL: item.logoCompactImageURL,
        logoFullImageURL: item.logoFullImageURL,
      })),
    }),
  ]);
  Logger.info('Created airlines');
}

async function populateAirports() {
  Logger.info('Getting airports');
  type Entry = {
    name: string;
    iata: string;
    timezone: string;
    cityName: string;
    cityCode: string;
    countryCode: string;
    elevation: number;
    icaoCode: string;
    state: string;
    countyName: string;
    location: { coordinates: number[] };
  };

  const response = await getData<Array<Entry>>('/airports.json');

  Logger.warn('Creating airports count[%s]', response.length);
  await prisma.$transaction([
    prisma.airport.deleteMany({}),
    prisma.airport.createMany({
      data: response
        .filter(item => !item.cityCode.includes('Raiway Stn'))
        .map(item => ({
          iata: item.iata,
          name: item.name,
          latitude: item.location?.coordinates[1] ?? -1,
          longitude: item.location?.coordinates[0] ?? -1,
          timezone: item.timezone,
          cityCode: item.cityCode,
          cityName: item.cityName,
          countryCode: item.countryCode,
          countyName: item.countyName,
          elevation: item.elevation,
          state: item.state,
        })),
    }),
  ]);
  Logger.info('Created airports');
}

async function populateCities() {
  Logger.info('Getting cities');
  const response = await getData<
    Array<{
      name: string;
      iata: string;
      timezone: string;
      countryCode: string;
      location: { coordinates: number[] };
    }>
  >('/cities.json');
  Logger.warn('Creating cities count[%s]', response.length);
  await prisma.$transaction([
    prisma.city.deleteMany({}),
    prisma.city.createMany({
      data: response.map(item => ({
        name: item.name,
        code: item.iata,
        latitude: item.location?.coordinates[1] ?? -1,
        longitude: item.location?.coordinates[0] ?? -1,
        timezone: item.timezone,
        countryCode: item.countryCode,
      })),
    }),
  ]);
  Logger.info('Created cities');
}

async function populateCountries() {
  Logger.info('Getting countries');
  const response = await getData<
    Array<{
      name: string;
      isoCode: string;
      dialCode: string;
      flagImageType: ImageType;
      flagImageUri: string;
    }>
  >('/countries.json');
  Logger.warn('Creating countries count[%s]', response.length);
  await prisma.$transaction([
    prisma.country.deleteMany({}),
    prisma.country.createMany({
      data: response.map(item => ({
        isoCode: item.isoCode,
        name: item.name,
        dialCode: item.dialCode,
        flagImageType: item.flagImageType,
        flagImageURL: item.flagImageUri,
      })),
    }),
  ]);
  Logger.info('Created countries');
}

Logger.warn('Upserting database');
const [r, error] = await tryNice(() =>
  Promise.allSettled([
    populateAirlines(),
    populateCountries(),
    populateCities(),
    populateAirports(),
  ]),
);

if (!r) {
  Logger.error(error);
} else {
  Logger.warn('seed result', r);
}
