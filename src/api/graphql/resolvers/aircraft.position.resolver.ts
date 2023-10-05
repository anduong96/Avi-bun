import { GQL_AircraftPosition } from '@app/@generated/graphql/models/AircraftPosition';
import { prisma } from '@app/prisma';
import { Arg, Authorized, Query, Resolver } from 'type-graphql';

@Resolver(() => GQL_AircraftPosition)
export class AircraftPositionResolver {
  @Authorized()
  @Query(() => GQL_AircraftPosition, { nullable: true })
  async aircraftPosition(@Arg('aircraftID') aircraftID: number) {
    const position = await prisma.aircraftPosition.findFirst({
      take: 1,
      where: {
        aircraftID,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return position;
  }
}
