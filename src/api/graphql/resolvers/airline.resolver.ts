import { Airline } from '@prisma/client';
import { Arg, Authorized, Query, Resolver } from 'type-graphql';

import { prisma } from '@app/prisma';
import { GQL_Airline } from '@app/@generated/graphql/models/Airline';

@Resolver(() => GQL_Airline)
export class AirlineResolver {
  @Authorized()
  @Query(() => GQL_Airline)
  airline(@Arg('iata') iata: string): Promise<Airline> {
    return prisma.airline.findFirstOrThrow({
      where: {
        iata,
      },
    });
  }

  @Authorized()
  @Query(() => [GQL_Airline])
  airlines(): Promise<Airline[]> {
    return prisma.airline.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
