import { Flight } from '@prisma/client';

export type FlightQueryParam = Pick<
  Flight,
  'airlineIata' | 'flightNumber' | 'flightDate' | 'flightMonth' | 'flightYear'
>;
