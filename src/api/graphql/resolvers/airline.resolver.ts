import { GQL_Airline } from '@app/@generated/graphql/models/Airline';
import { prisma } from '@app/prisma';
import { Airline } from '@prisma/client';
import { Arg, Authorized, Query, Resolver } from 'type-graphql';

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
