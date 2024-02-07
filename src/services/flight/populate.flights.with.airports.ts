import { uniqBy } from 'lodash';

import { FlightQueryAirportsParams } from '@app/types/flight';
import { FlightStats } from '@app/vendors/flights/flight.stats';

import { populateFlights } from './populate.flights';

export async function populateFlightsWithAirports(
  params: FlightQueryAirportsParams,
) {
  const flights = await FlightStats.searchFlightsWithAirports(params);
  await Promise.allSettled(
    uniqBy(
      flights,
      flight => flight.carrier.fs + flight.carrier.flightNumber,
    ).map(flight =>
      populateFlights({
        airlineIata: flight.carrier.fs,
        flightDate: params.flightDate,
        flightMonth: params.flightMonth,
        flightNumber: flight.carrier.flightNumber,
        flightYear: params.flightYear,
      }),
    ),
  );
}
