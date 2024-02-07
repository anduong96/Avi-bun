import { Flight } from '@prisma/client';

export type FlightQueryParam = Pick<
  Flight,
  'airlineIata' | 'flightDate' | 'flightMonth' | 'flightNumber' | 'flightYear'
>;

export type FlightQueryAirportsParams = {
  destinationIata: string;
  originIata: string;
} & Pick<
  FlightQueryParam,
  'airlineIata' | 'flightDate' | 'flightMonth' | 'flightYear'
>;
