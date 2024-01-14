import { Airport } from '@prisma/client';

import { prisma } from '@app/prisma';
import { US_COUNTRY } from '@app/lib/constants/countries';

/**
 * The function checks if an airport is located in the USA based on its IATA code or country code.
 * @param {Pick<Airport, 'countryCode'> | string} airportIata - The `airportIata` parameter is either a
 * string representing the IATA code of an airport or an object with a `countryCode` property
 * representing the country code of an airport.
 * @returns a boolean value indicating whether the airport specified by the airportIata parameter is
 * located in the USA.
 */
export async function isAirportUSA(
  airportIata: Pick<Airport, 'countryCode'> | string,
) {
  if (typeof airportIata !== 'string' && 'countryCode' in airportIata) {
    return airportIata.countryCode === US_COUNTRY;
  }

  const airport = await prisma.airport.findFirstOrThrow({
    select: {
      countryCode: true,
    },
    where: {
      iata: airportIata,
    },
  });

  return isAirportUSA(airport);
}

/**
 * The function `assertIsAirportUSA` checks if an airport is located in the USA and throws an error if
 * it is not.
 * @param {Pick<Airport, 'countryCode'> | string} airportIata - The `airportIata` parameter is either a
 * string representing the IATA code of an airport or an object with a `countryCode` property
 * representing the country code of an airport.
 */
export async function assertIsAirportUSA(
  airportIata: Pick<Airport, 'countryCode'> | string,
) {
  const isUsa = await isAirportUSA(airportIata);
  if (!isUsa) {
    throw new Error('Airport is not located in the USA');
  }
}
