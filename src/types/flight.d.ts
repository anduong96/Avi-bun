import { Flight } from '@prisma/client';

export type FlightQueryParam = Pick<
  Flight,
  'airlineIata' | 'flightDate' | 'flightMonth' | 'flightNumber' | 'flightYear'
>;
