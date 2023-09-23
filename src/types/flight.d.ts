import { Flight } from '@prisma/client';

export type FlightQueryParam = Pick<Flight, 'airlineIata' | 'flightNumber'> & {
  departureDate: {
    year: number;
    month: number;
    date: number;
  };
};
