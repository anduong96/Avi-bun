import { Arg, Authorized, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { GQL_Airport } from '@app/@generated/graphql/models/Airport';

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
}
