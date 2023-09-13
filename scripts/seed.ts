import { ImageType } from "@prisma/client";
import { Logger } from "@app/lib/logger";
import axios from "axios";
import { prisma } from "@app/lib/prisma";

const client = axios.create({
  baseURL: "https://raw.githubusercontent.com/anduong96/airlines-logos/main",
});

async function populateAirlines() {
  const response = await client.get<
    Array<{
      name: string;
      iata: string;
      isLowCost: boolean;
      logoFullImageType: ImageType;
      logoCompactImageType: ImageType;
      logoFullImageURL: string;
      logoCompactImageURL: string;
    }>
  >("/airlines.json");
  await prisma.$transaction([
    prisma.airline.deleteMany({}),
    prisma.airline.createMany({
      data: response.data.map((item) => ({
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
}

async function populateAirports() {
  const response = await client.get<
    Array<{
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
    }>
  >("/airports.json");

  await prisma.$transaction([
    prisma.airport.deleteMany({}),
    prisma.airport.createMany({
      data: response.data
        .filter((item) => !item.cityCode.includes("Raiway Stn"))
        .map((item) => ({
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
}

async function populateCities() {
  const response = await client.get<
    Array<{
      name: string;
      iata: string;
      timezone: string;
      countryCode: string;
      location: { coordinates: number[] };
    }>
  >("/cities.json");
  models.$transaction([
    models.city.deleteMany({}),
    models.city.createMany({
      data: response.data.map((item) => ({
        name: item.name,
        code: item.iata,
        latitude: item.location?.coordinates[1] ?? -1,
        longitude: item.location?.coordinates[0] ?? -1,
        timezone: item.timezone,
        countryCode: item.countryCode,
      })),
    }),
  ]);
}

async function populateCountries() {
  const response = await client.get<
    Array<{
      name: string;
      isoCode: string;
      dialCode: string;
      flagImageType: ImageType;
      flagImageUri: string;
    }>
  >("/countries.json");

  models.$transaction([
    models.country.deleteMany({}),
    models.country.createMany({
      data: response.data.map((item) => ({
        isoCode: item.isoCode,
        name: item.name,
        dialCode: item.dialCode,
        flagImageType: item.flagImageType,
        flagImageURL: item.flagImageUri,
      })),
    }),
  ]);
}

Logger.warn("Upserting database");
const r = await Promise.allSettled([
  populateAirlines(),
  populateCountries(),
  populateCities(),
  populateAirports(),
]);

Logger.warn("seed result", r);
