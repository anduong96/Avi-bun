import { Arg, Authorized, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { GQL_Airport } from '@app/@generated/graphql/models/Airport';
import {
  getTsaAirportCheckpointsStatus,
  getTsaWaitTimeForFlight,
} from '@app/services/airports/get.tsa.wait.time';

import { GQL_AirportTsaWaitTime } from '../_responses/airport.tsa.wait.time';
import { GQL_AirportTsaCheckPointTerminal } from '../_responses/airport.tsa.checkpoints';

@Resolver(() => GQL_Airport)
export class AirportResolver {
  @Authorized()
  @Query(() => GQL_Airport)
  airport(@Arg('airportIata') iata: string) {
    return prisma.airport.findFirstOrThrow({
      where: {
        iata,
      },
    });
  }

  @Authorized()
  @Query(() => [GQL_AirportTsaCheckPointTerminal], { nullable: true })
  async airportTsaCheckpointsStatus(
    @Arg('airportIata') iata: string,
    @Arg('dayOfWeek') dayOfWeek: number,
  ) {
    const entry = await getTsaAirportCheckpointsStatus(iata, dayOfWeek);
    return entry;
  }

  @Authorized()
  @Query(() => [GQL_AirportTsaWaitTime], { nullable: true })
  async airportTsaWaitTime(@Arg('airportIata') iata: string) {
    const entry = await getTsaWaitTimeForFlight(iata);
    return entry;
  }
}
