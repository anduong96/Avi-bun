import { GQL_Airline } from '@app/@generated/graphql/models/Airline';
import { GQL_Airport } from '@app/@generated/graphql/models/Airport';
import { GQL_Flight } from '@app/@generated/graphql/models/Flight';
import { prisma } from '@app/prisma';
import { getFlights } from '@app/services/flight/get.flight';
import {
  Arg,
  Authorized,
  FieldResolver,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

@Resolver(() => GQL_Flight)
export class FlightResolver {
  @Authorized()
  @Query(() => [GQL_Flight])
  async flights(
    @Arg('flightNumber') flightNumber: string,
    @Arg('airlineIata') airlineIata: string,
    @Arg('departureDate') departureDate: Date,
  ) {
    const result = await getFlights({
      airlineIata,
      flightNumber,
      departureDate,
    });

    return result;
  }

  @Authorized()
  @Query(() => GQL_Flight)
  flight(@Arg('flightID') flightID: string) {
    return prisma.flight.findFirstOrThrow({
      where: {
        id: flightID,
      },
    });
  }

  @FieldResolver(() => GQL_Airport)
  async Origin(@Root() root: GQL_Flight) {
    return prisma.airport.findFirstOrThrow({
      where: {
        iata: root.originIata,
      },
    });
  }

  @FieldResolver(() => GQL_Airport)
  async Destination(@Root() root: GQL_Flight) {
    return prisma.airport.findFirstOrThrow({
      where: {
        iata: root.destinationIata,
      },
    });
  }

  @FieldResolver(() => GQL_Airline)
  async Airline(@Root() root: GQL_Flight) {
    return prisma.airline.findFirstOrThrow({
      where: {
        iata: root.airlineIata,
      },
    });
  }
}
