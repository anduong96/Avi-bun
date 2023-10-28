import ky from 'ky';
import { Country, ImageType } from '@prisma/client';

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
    state?: string;
    timezone: string;
  };

  const response = await getData<Array<Entry>>('/airports.json');
  Logger.warn('Creating airports count[%s]', response.length);
  for (const item of response) {
    if (item.iata === 'XHN') {
      item.name = 'Guillemins, Raiway Stn';
      item.cityName = 'Liege';
      item.countryCode = 'BE';
      item.cityCode = 'LGG';
      item.location = {
        coordinates: [50.633333333333, 5.566666666667],
      };
      item.state = undefined;
    } else if (item.iata === 'SIP' || item.iata === 'UKS') {
      item.countryCode = 'UA';
    } else if (
      item.iata === 'AWK' ||
      item.iata === 'JON' ||
      item.iata === 'MDY'
    ) {
      item.countryCode = 'UMI';
    }

    try {
      await prisma.airport.create({
        data: {
          cityCode: item.cityCode.trim(),
          cityName: item.cityName.trim(),
          countryCode: item.countryCode.trim(),
          countyName: item.countyName.trim(),
          elevation: item.elevation,
          iata: item.iata.trim(),
          latitude: item.location?.coordinates[1] ?? -1,
          longitude: item.location?.coordinates[0] ?? -1,
          name: item.name
            .replace('International', 'Intl')
            .replace('Airport', ''),
          state: item.state?.trim(),
          timezone: item.timezone,
        },
      });
    } catch (error) {
      Logger.error(
        'Failed to create airport',
        JSON.stringify(item, null, 2),
        error,
      );
    }
  }

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
  for await (const item of response) {
    if (item.iata === 'UKS' || item.iata === 'SIP') {
      item.countryCode = 'UA';
    } else if (item.iata === 'NIC' || item.iata === 'ECN') {
      item.countryCode = 'CY';
    } else if (
      item.iata === 'AWK' ||
      item.iata === 'JON' ||
      item.iata === 'MDY'
    ) {
      item.countryCode = 'UMI';
    }

    try {
      await prisma.city.create({
        data: {
          code: item.iata,
          countryCode: item.countryCode,
          latitude: item.location?.coordinates[1] ?? -1,
          longitude: item.location?.coordinates[0] ?? -1,
          name: item.name,
          timezone: item.timezone,
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      Logger.error(
        'Failed to create city',
        JSON.stringify(item, null, 2),
        error,
      );
    }
  }

  Logger.info('Created cities');
}

async function populateCountries() {
  Logger.info('Getting countries');
  type Item = {
    dialCode: string;
    flagImageType: ImageType;
    flagImageUri: string;
    isoCode: string;
    name: string;
  };
  const response = await getData<Array<Item>>('/countries.json');
  Logger.warn('Creating countries count[%s]', response.length);
  const data = response.map(
    (item): Omit<Country, 'id'> => ({
      dialCode: item.dialCode,
      flagImageType: item.flagImageType,
      flagImageURL: item.flagImageUri,
      isoCode: item.isoCode,
      name: item.name,
    }),
  );

  data.push({
    dialCode: '599',
    flagImageType: null,
    flagImageURL: null,
    isoCode: 'BQ',
    name: 'Bonaire, Sint Eustatius and Saba',
  });

  data.push({
    dialCode: '599',
    flagImageType: null,
    flagImageURL: null,
    isoCode: 'CW',
    name: 'Curaçao',
  });

  await prisma.country.createMany({
    data,
    skipDuplicates: true,
  });

  Logger.info('Created countries');
}

Logger.warn('Upsert database');
await prisma.airport.deleteMany();
await prisma.city.deleteMany();
await prisma.country.deleteMany();
await populateCountries();
await populateCities();
await populateAirports();
await populateAirlines();

await prisma.$disconnect();
Logger.info('Disconnected from database');
