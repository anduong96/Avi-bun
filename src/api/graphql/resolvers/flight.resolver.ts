import moment from 'moment';
import {
  Arg,
  Authorized,
  FieldResolver,
  Int,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { prisma } from '@app/prisma';
import { getFlights } from '@app/services/flight/get.flights';
import { GQL_Flight } from '@app/@generated/graphql/models/Flight';
import { GQL_Airline } from '@app/@generated/graphql/models/Airline';
import { GQL_Airport } from '@app/@generated/graphql/models/Airport';
import { getRandomFlight } from '@app/services/flight/get.random.flight';

@Resolver(() => GQL_Flight)
export class FlightResolver {
  @FieldResolver(() => GQL_Airline)
  async Airline(@Root() root: GQL_Flight) {
    return prisma.airline.findFirstOrThrow({
      where: {
        iata: root.airlineIata,
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

  @FieldResolver(() => GQL_Airport)
  async Origin(@Root() root: GQL_Flight) {
    return prisma.airport.findFirstOrThrow({
      where: {
        iata: root.originIata,
      },
    });
  }

  @FieldResolver(() => Int)
  durationMs(@Root() root: GQL_Flight) {
    const gateDeparture = moment(root.estimatedGateDeparture);
    const gateArrival = moment(root.estimatedGateArrival);
    return gateArrival.diff(gateDeparture);
  }

  @Authorized()
  @Query(() => GQL_Flight)
  async flight(@Arg('flightID') flightID: string) {
    const flight = await prisma.flight.findFirstOrThrow({
      where: {
        id: flightID,
      },
    });

    return flight;
  }

  @Authorized()
  @Query(() => [GQL_Flight])
  async flights(
    @Arg('flightNumber') flightNumber: string,
    @Arg('airlineIata') airlineIata: string,
    @Arg('year', () => Int) year: number,
    @Arg('month', () => Int) month: number,
    @Arg('date', () => Int) date: number,
  ) {
    const result = await getFlights({
      airlineIata,
      flightDate: date,
      flightMonth: month,
      flightNumber,
      flightYear: year,
    });

    return result;
  }

  @FieldResolver(() => Int)
  progressPercent(@Root() root: GQL_Flight) {
    const flightDurationMs = this.durationMs(root);
    const remainingDurationMs = this.remainingDurationMs(root);
    if (remainingDurationMs > 0) {
      return 0;
    }

    return 1 - remainingDurationMs / flightDurationMs;
  }

  @Authorized()
  @Query(() => GQL_Flight)
  async randomFlight() {
    const flight = await getRandomFlight();
    return flight;
  }

  @FieldResolver(() => Int, {
    description: 'Time in milliseconds until the flight departs',
  })
  remainingDurationMs(@Root() root: GQL_Flight) {
    const now = moment();
    const gateArrival = moment(root.estimatedGateArrival);
    return gateArrival.diff(now);
  }
}
