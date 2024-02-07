import { Arg, Authorized, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { MaybeNil } from '@app/types/maybe.nil';
import { GQL_Airport } from '@app/@generated/graphql/models/Airport';
import { getCurrentTsaTerminalWaitTime } from '@app/services/airports/get.current.tsa.terminal.wait.time';
import {
  getTsaAirportCheckpointsStatus,
  getTsaWaitTimeForFlight,
} from '@app/services/airports/get.tsa.wait.time';

import { Selections } from '../_decorators/selection.decorator';
import { GQL_AirportTsaWaitTime } from '../_responses/airport.tsa.wait.time';
import { GQL_AirportTsaCheckPointTerminal } from '../_responses/airport.tsa.checkpoints';
import { GQL_AirportTsaEstimatedWaitTime } from '../_responses/airport.tsa.estimated.wait.time';

@Resolver(() => GQL_Airport)
export class AirportResolver {
  @Authorized()
  @Query(() => GQL_Airport)
  airport(@Arg('airportIata') iata: string, @Selections() selections: object) {
    return prisma.airport.findFirstOrThrow({
      select: selections,
      where: {
        iata,
      },
    });
  }

  @Authorized()
  @Query(() => [GQL_AirportTsaCheckPointTerminal], {
    description: 'TSA check points status',
    nullable: true,
  })
  async airportTsaCheckpointsStatus(
    @Arg('airportIata') iata: string,
    @Arg('dayOfWeek') dayOfWeek: number,
  ) {
    const entry = await getTsaAirportCheckpointsStatus(iata, dayOfWeek);
    return entry;
  }

  @Authorized()
  @Query(() => [GQL_AirportTsaEstimatedWaitTime], {
    description: 'Current TSA estimated wait time',
    nullable: true,
  })
  async airportTsaCurrentWaitTime(
    @Arg('airportIata') iata: string,
  ): Promise<MaybeNil<GQL_AirportTsaEstimatedWaitTime[]>> {
    const entry = await getCurrentTsaTerminalWaitTime(iata);

    if (!entry) {
      return null;
    }

    return entry?.map(item => ({
      airportIata: iata,
      estimatedWaitMinutes: item.estimatedWaitMinutes,
      terminal: item.name,
    }));
  }

  @Authorized()
  @Query(() => [GQL_AirportTsaWaitTime], {
    description: 'History TSA averaged wait time',
    nullable: true,
  })
  async airportTsaWaitTime(@Arg('airportIata') iata: string) {
    const entry = await getTsaWaitTimeForFlight(iata);
    return entry;
  }

  @Authorized()
  @Query(() => [GQL_Airport], {
    description: 'List of airports',
  })
  airports(@Selections() selections: object) {
    return prisma.airport.findMany({
      select: selections,
    });
  }
}
