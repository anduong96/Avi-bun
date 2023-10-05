import { GQL_Aircraft } from '@app/@generated/graphql/models/Aircraft';
import { prisma } from '@app/prisma';
import { Arg, Authorized, Query, Resolver } from 'type-graphql';

@Resolver(() => GQL_Aircraft)
export class AircraftResolver {
  @Authorized()
  @Query(() => GQL_Aircraft, { nullable: true })
  async aircraft(@Arg('tailNumber') tailNumber: string) {
    const result = await prisma.aircraft.findFirst({
      where: {
        tailNumber,
      },
    });

    return result;
  }
}
