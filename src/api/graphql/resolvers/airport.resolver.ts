import { GQL_Airport } from '@app/@generated/graphql/models/Airport';
import { prisma } from '@app/prisma';
import { Arg, Query, Resolver } from 'type-graphql';

@Resolver(() => GQL_Airport)
export class AirportResolver {
  @Query(() => GQL_Airport)
  airport(@Arg('iata') iata: string) {
    return prisma.airport.findFirstOrThrow({
      where: {
        iata,
      },
    });
  }
}
