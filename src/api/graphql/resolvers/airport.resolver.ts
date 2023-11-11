import * as GraphQLScalars from 'graphql-scalars';
import { Arg, Authorized, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { GQL_Airport } from '@app/@generated/graphql/models/Airport';
import {
  getTsaAirportCheckpoints,
  getTsaWaitTimeForFlight,
} from '@app/services/airports/get.tsa.wait.time';

@Resolver(() => GQL_Airport)
export class AirportResolver {
  @Authorized()
  @Query(() => GQL_Airport)
  airport(@Arg('iata') iata: string) {
    return prisma.airport.findFirstOrThrow({
      where: {
        iata,
      },
    });
  }

  @Authorized()
  @Query(() => GraphQLScalars.JSONResolver, { nullable: true })
  async airportTsaCheckpointsStatus(
    @Arg('iata') iata: string,
    @Arg('dayOfWeek') dayOfWeek: number,
  ) {
    const entry = await getTsaAirportCheckpoints(iata, dayOfWeek);
    return entry?.data;
  }

  @Authorized()
  @Query(() => GraphQLScalars.JSONResolver, { nullable: true })
  async airportTsaWaitTime(@Arg('iata') iata: string) {
    const entry = await getTsaWaitTimeForFlight(iata);
    return entry?.data;
  }
}
