import { GQL_Flight } from '@app/@generated/graphql/models/Flight';
import { getFlights } from '@app/services/flight/get.flight';
import { Arg, Authorized, Resolver, Query } from 'type-graphql';

@Resolver(() => GQL_Flight)
export class FlightResolver {
  @Authorized()
  @Query(() => [GQL_Flight])
  flights(
    @Arg('flightNumber') flightNumber: string,
    @Arg('airlineIata') airlineIata: string,
    @Arg('departureDate') departureDate: Date,
  ) {
    return getFlights({
      airlineIata,
      flightNumber,
      departureDate,
    });
  }
}
